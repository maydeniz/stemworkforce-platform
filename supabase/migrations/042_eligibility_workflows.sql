-- Eligibility Workflows Migration
-- Configurable eligibility determination per LWDB

-- Enum types
CREATE TYPE wioa_program AS ENUM ('adult', 'dislocated_worker', 'youth', 'national_dislocated_worker_grants');
CREATE TYPE workflow_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE validation_level AS ENUM ('blocking', 'warning', 'info');
CREATE TYPE determination_result AS ENUM ('eligible', 'ineligible', 'pending_review', 'pending_documents');
CREATE TYPE review_status AS ENUM ('not_required', 'pending', 'approved', 'denied');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE criterion_result_status AS ENUM ('passed', 'failed', 'pending', 'overridden', 'skipped');

-- Eligibility Workflows Table
CREATE TABLE eligibility_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lwdb_id UUID NOT NULL REFERENCES lwdb_regions(id) ON DELETE CASCADE,
  program wioa_program NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_es VARCHAR(255),
  description TEXT,
  description_es TEXT,

  -- Version control
  version INTEGER NOT NULL DEFAULT 1,
  status workflow_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  published_by UUID REFERENCES auth.users(id),

  -- Settings stored as JSONB
  settings JSONB NOT NULL DEFAULT '{
    "enableAutoDetermination": true,
    "autoDeterminationThreshold": 90,
    "requireCaseManagerReview": true,
    "reviewTimeoutDays": 5,
    "notifyParticipantOnPending": true,
    "notifyParticipantOnApproval": true,
    "notifyParticipantOnDenial": true,
    "allowDocumentUpload": true,
    "maxDocumentSizeMB": 10,
    "allowedDocumentTypes": ["image/jpeg", "image/png", "application/pdf"],
    "availableLanguages": ["en", "es"],
    "eligibilityValidDays": 180
  }'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID NOT NULL REFERENCES auth.users(id),

  -- Ensure unique active workflow per LWDB/program combination
  CONSTRAINT unique_published_workflow UNIQUE NULLS NOT DISTINCT (lwdb_id, program, status)
    WHERE status = 'published'
);

-- Eligibility Criteria Table
CREATE TABLE eligibility_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES eligibility_workflows(id) ON DELETE CASCADE,

  -- Criterion definition
  type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_es VARCHAR(255),
  description TEXT,
  description_es TEXT,

  -- Value configuration stored as JSONB
  value_config JSONB NOT NULL,

  -- Validation behavior
  validation_level validation_level NOT NULL DEFAULT 'blocking',
  error_message TEXT NOT NULL,
  error_message_es TEXT,
  warning_message TEXT,
  warning_message_es TEXT,

  -- Documentation requirements stored as JSONB array
  document_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Flags
  is_federal_requirement BOOLEAN NOT NULL DEFAULT true,
  allow_override BOOLEAN NOT NULL DEFAULT false,
  override_requires_approval BOOLEAN NOT NULL DEFAULT true,

  -- Display order
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- Conditional logic stored as JSONB
  conditions JSONB,

  -- Grouping for any/all logic
  group_id VARCHAR(100),
  group_operator VARCHAR(10) CHECK (group_operator IN ('all', 'any')),

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Priority Populations Table
CREATE TABLE priority_populations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES eligibility_workflows(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  name_es VARCHAR(255),
  description TEXT,
  description_es TEXT,
  priority_level INTEGER NOT NULL CHECK (priority_level BETWEEN 1 AND 3),

  -- Criteria IDs that define this population
  criteria_ids UUID[] NOT NULL DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow Change Log Table
CREATE TABLE workflow_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES eligibility_workflows(id) ON DELETE CASCADE,

  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name VARCHAR(255) NOT NULL,

  change_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB
);

-- Eligibility Determinations Table
CREATE TABLE eligibility_determinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES eligibility_workflows(id),
  workflow_version INTEGER NOT NULL,

  -- Results
  overall_result determination_result NOT NULL,
  confidence_score DECIMAL(5, 2) NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),

  -- Criterion-level results stored as JSONB
  criterion_results JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Priority population matching
  matched_priority_populations UUID[] NOT NULL DEFAULT '{}',
  priority_level INTEGER CHECK (priority_level BETWEEN 1 AND 3),

  -- Missing documents
  missing_documents TEXT[] NOT NULL DEFAULT '{}',

  -- Review info
  review_status review_status NOT NULL DEFAULT 'not_required',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- Metadata
  determined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,

  -- Ensure participant can only have one active determination per workflow
  CONSTRAINT unique_active_determination UNIQUE (participant_id, workflow_id)
);

-- Submitted Documents Table
CREATE TABLE determination_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  determination_id UUID NOT NULL REFERENCES eligibility_determinations(id) ON DELETE CASCADE,

  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type VARCHAR(100),

  -- Verification
  verification_status verification_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Metadata
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criterion Override Requests Table
CREATE TABLE criterion_override_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  determination_id UUID NOT NULL REFERENCES eligibility_determinations(id) ON DELETE CASCADE,
  criterion_id UUID NOT NULL REFERENCES eligibility_criteria(id),

  requested_by UUID NOT NULL REFERENCES auth.users(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT NOT NULL,
  supporting_documentation TEXT,

  -- Approval
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT
);

-- Federal Baseline Templates Table (read-only reference)
CREATE TABLE federal_baseline_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program wioa_program NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Template criteria stored as JSONB
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority_populations JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_settings JSONB NOT NULL DEFAULT '{}'::jsonb,

  regulatory_reference VARCHAR(255),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow Test Cases Table
CREATE TABLE workflow_test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES eligibility_workflows(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Test inputs and expected outputs
  inputs JSONB NOT NULL,
  expected_result determination_result NOT NULL,
  expected_priority_level INTEGER CHECK (expected_priority_level BETWEEN 1 AND 3),

  -- Last run results
  last_run_at TIMESTAMPTZ,
  last_run_passed BOOLEAN,
  last_run_result JSONB,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX idx_eligibility_workflows_lwdb ON eligibility_workflows(lwdb_id);
CREATE INDEX idx_eligibility_workflows_status ON eligibility_workflows(status);
CREATE INDEX idx_eligibility_criteria_workflow ON eligibility_criteria(workflow_id);
CREATE INDEX idx_eligibility_criteria_type ON eligibility_criteria(type);
CREATE INDEX idx_eligibility_determinations_participant ON eligibility_determinations(participant_id);
CREATE INDEX idx_eligibility_determinations_result ON eligibility_determinations(overall_result);
CREATE INDEX idx_determination_documents_determination ON determination_documents(determination_id);
CREATE INDEX idx_workflow_change_log_workflow ON workflow_change_log(workflow_id);

-- RLS Policies
ALTER TABLE eligibility_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE priority_populations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_change_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_determinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE determination_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE criterion_override_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE federal_baseline_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_test_cases ENABLE ROW LEVEL SECURITY;

-- Workflows: LWDB admins can manage their workflows, platform admins can view all
CREATE POLICY workflows_lwdb_admin ON eligibility_workflows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM staff s
      WHERE s.user_id = auth.uid()
      AND (
        s.role = 'platform_admin'
        OR (s.role IN ('lwdb_admin', 'lwdb_manager') AND s.lwdb_id = eligibility_workflows.lwdb_id)
      )
    )
  );

-- Criteria: Same as workflows
CREATE POLICY criteria_lwdb_admin ON eligibility_criteria
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM eligibility_workflows w
      JOIN staff s ON s.user_id = auth.uid()
      WHERE w.id = eligibility_criteria.workflow_id
      AND (
        s.role = 'platform_admin'
        OR (s.role IN ('lwdb_admin', 'lwdb_manager') AND s.lwdb_id = w.lwdb_id)
      )
    )
  );

-- Determinations: Case managers can view their LWDB's determinations
CREATE POLICY determinations_case_managers ON eligibility_determinations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM eligibility_workflows w
      JOIN staff s ON s.user_id = auth.uid()
      WHERE w.id = eligibility_determinations.workflow_id
      AND (
        s.role = 'platform_admin'
        OR s.lwdb_id = w.lwdb_id
      )
    )
  );

-- Federal templates: Everyone can read
CREATE POLICY templates_read_all ON federal_baseline_templates
  FOR SELECT USING (true);

-- Insert federal baseline templates
INSERT INTO federal_baseline_templates (program, name, description, criteria, priority_populations, default_settings, regulatory_reference) VALUES
(
  'adult',
  'WIOA Adult Program Baseline',
  'Federal baseline eligibility criteria for WIOA Title I Adult Program',
  '[
    {"type": "age", "name": "Age Requirement", "name_es": "Requisito de Edad", "description": "Must be 18 years of age or older", "description_es": "Debe tener 18 años o más", "value_config": {"type": "number", "operator": "greater_than_or_equal", "value": 18}, "validation_level": "blocking", "error_message": "Participant must be at least 18 years old", "error_message_es": "El participante debe tener al menos 18 años", "is_federal_requirement": true, "allow_override": false, "sort_order": 1},
    {"type": "citizenship", "name": "Authorization to Work", "name_es": "Autorización para Trabajar", "description": "Must be a citizen or authorized to work in the United States", "description_es": "Debe ser ciudadano o estar autorizado para trabajar en Estados Unidos", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "error_message": "Participant must be authorized to work in the United States", "error_message_es": "El participante debe estar autorizado para trabajar en Estados Unidos", "is_federal_requirement": true, "allow_override": false, "sort_order": 2, "document_requirements": [{"documentType": "work_authorization", "required": true, "alternativeDocuments": ["passport", "drivers_license"], "description": "Proof of work authorization"}]},
    {"type": "selective_service", "name": "Selective Service Registration", "name_es": "Registro del Servicio Selectivo", "description": "Males born on or after January 1, 1960 must be registered with Selective Service", "description_es": "Los hombres nacidos el o después del 1 de enero de 1960 deben estar registrados en el Servicio Selectivo", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "error_message": "Male participants must be registered with Selective Service", "error_message_es": "Los participantes masculinos deben estar registrados en el Servicio Selectivo", "is_federal_requirement": true, "allow_override": true, "override_requires_approval": true, "sort_order": 3, "conditions": [{"field": "gender", "operator": "equals", "value": "male"}, {"field": "birthDate", "operator": "greater_than_or_equal", "value": "1960-01-01"}]}
  ]'::jsonb,
  '[
    {"name": "Veterans and Eligible Spouses", "name_es": "Veteranos y Cónyuges Elegibles", "description": "Veterans and eligible spouses of veterans", "priority_level": 1},
    {"name": "Recipients of Public Assistance", "name_es": "Beneficiarios de Asistencia Pública", "description": "Recipients of public assistance or low-income individuals", "priority_level": 2},
    {"name": "Basic Skills Deficient", "name_es": "Deficiencia en Habilidades Básicas", "description": "Individuals who are basic skills deficient", "priority_level": 3}
  ]'::jsonb,
  '{"enableAutoDetermination": true, "autoDeterminationThreshold": 90, "requireCaseManagerReview": true, "reviewTimeoutDays": 5, "eligibilityValidDays": 180}'::jsonb,
  'WIOA Section 3(2), 20 CFR 680.120'
),
(
  'dislocated_worker',
  'WIOA Dislocated Worker Program Baseline',
  'Federal baseline eligibility criteria for WIOA Title I Dislocated Worker Program',
  '[
    {"type": "citizenship", "name": "Authorization to Work", "name_es": "Autorización para Trabajar", "description": "Must be a citizen or authorized to work in the United States", "description_es": "Debe ser ciudadano o estar autorizado para trabajar en Estados Unidos", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "error_message": "Participant must be authorized to work in the United States", "is_federal_requirement": true, "allow_override": false, "sort_order": 1},
    {"type": "selective_service", "name": "Selective Service Registration", "name_es": "Registro del Servicio Selectivo", "description": "Males born on or after January 1, 1960 must be registered with Selective Service", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "error_message": "Male participants must be registered with Selective Service", "is_federal_requirement": true, "allow_override": true, "sort_order": 2},
    {"type": "layoff_notice", "name": "Layoff or Termination Notice", "name_es": "Aviso de Despido o Terminación", "description": "Has been terminated or laid off, or has received notice of termination or layoff", "description_es": "Ha sido despedido o ha recibido aviso de despido", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "error_message": "Must have been laid off or received notice of layoff", "is_federal_requirement": true, "allow_override": false, "sort_order": 3, "group_id": "dw_category", "group_operator": "any", "document_requirements": [{"documentType": "layoff_notice", "required": true, "description": "Layoff notice or termination letter"}]},
    {"type": "plant_closure", "name": "Plant Closure or Substantial Layoff", "name_es": "Cierre de Planta o Despido Masivo", "description": "Employed at a facility with announced closure or substantial layoff", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "is_federal_requirement": true, "sort_order": 4, "group_id": "dw_category", "group_operator": "any"},
    {"type": "self_employed_closure", "name": "Self-Employed Business Closure", "name_es": "Cierre de Negocio Propio", "description": "Was self-employed and business closed due to economic conditions", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "is_federal_requirement": true, "sort_order": 5, "group_id": "dw_category", "group_operator": "any"},
    {"type": "displaced_homemaker", "name": "Displaced Homemaker", "name_es": "Ama de Casa Desplazada", "description": "Individual who was dependent on income of another family member but is no longer supported", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "is_federal_requirement": true, "sort_order": 6, "group_id": "dw_category", "group_operator": "any"},
    {"type": "military_spouse", "name": "Military Spouse", "name_es": "Cónyuge Militar", "description": "Spouse of a member of the Armed Forces who lost employment due to relocation", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "is_federal_requirement": true, "sort_order": 7, "group_id": "dw_category", "group_operator": "any"}
  ]'::jsonb,
  '[
    {"name": "Veterans and Eligible Spouses", "priority_level": 1},
    {"name": "Long-Term Unemployed", "description": "Unemployed for 27+ consecutive weeks", "priority_level": 2}
  ]'::jsonb,
  '{"enableAutoDetermination": true, "autoDeterminationThreshold": 85, "requireCaseManagerReview": true, "reviewTimeoutDays": 5, "eligibilityValidDays": 180}'::jsonb,
  'WIOA Section 3(15), 20 CFR 680.130'
),
(
  'youth',
  'WIOA Youth Program Baseline',
  'Federal baseline eligibility criteria for WIOA Title I Youth Program',
  '[
    {"type": "age", "name": "Age Requirement (In-School Youth)", "name_es": "Requisito de Edad (Jóvenes en la Escuela)", "description": "In-school youth must be 14-21 years old", "value_config": {"type": "number", "operator": "between", "minValue": 14, "maxValue": 21}, "validation_level": "blocking", "error_message": "In-school youth must be between 14 and 21 years old", "is_federal_requirement": true, "sort_order": 1, "group_id": "age_group", "group_operator": "any"},
    {"type": "age", "name": "Age Requirement (Out-of-School Youth)", "name_es": "Requisito de Edad (Jóvenes Fuera de la Escuela)", "description": "Out-of-school youth must be 16-24 years old", "value_config": {"type": "number", "operator": "between", "minValue": 16, "maxValue": 24}, "validation_level": "blocking", "error_message": "Out-of-school youth must be between 16 and 24 years old", "is_federal_requirement": true, "sort_order": 2, "group_id": "age_group", "group_operator": "any"},
    {"type": "citizenship", "name": "Authorization to Work", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "error_message": "Must be authorized to work in the United States", "is_federal_requirement": true, "sort_order": 3},
    {"type": "selective_service", "name": "Selective Service Registration", "description": "Males 18+ born on or after January 1, 1960 must be registered", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "is_federal_requirement": true, "allow_override": true, "sort_order": 4},
    {"type": "income", "name": "Low-Income Requirement", "name_es": "Requisito de Bajos Ingresos", "description": "Family income at or below poverty line or 70% LLSIL", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "blocking", "error_message": "Must meet low-income criteria", "is_federal_requirement": true, "sort_order": 5},
    {"type": "basic_skills_deficient", "name": "Basic Skills Deficient", "description": "Reading, writing, or computing skills below 8th grade level", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "info", "is_federal_requirement": true, "sort_order": 6, "group_id": "barrier", "group_operator": "any"},
    {"type": "english_proficiency", "name": "English Language Learner", "description": "Limited English proficiency", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "info", "is_federal_requirement": true, "sort_order": 7, "group_id": "barrier", "group_operator": "any"},
    {"type": "offender", "name": "Subject to Juvenile or Adult Justice System", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "info", "is_federal_requirement": true, "sort_order": 8, "group_id": "barrier", "group_operator": "any"},
    {"type": "homeless", "name": "Homeless or Runaway", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "info", "is_federal_requirement": true, "sort_order": 9, "group_id": "barrier", "group_operator": "any"},
    {"type": "foster_care", "name": "In Foster Care or Aged Out", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "info", "is_federal_requirement": true, "sort_order": 10, "group_id": "barrier", "group_operator": "any"},
    {"type": "pregnant_parenting", "name": "Pregnant or Parenting", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "info", "is_federal_requirement": true, "sort_order": 11, "group_id": "barrier", "group_operator": "any"},
    {"type": "disability", "name": "Individual with a Disability", "value_config": {"type": "boolean", "operator": "equals", "value": true}, "validation_level": "info", "is_federal_requirement": true, "sort_order": 12, "group_id": "barrier", "group_operator": "any"}
  ]'::jsonb,
  '[
    {"name": "Out-of-School Youth", "description": "Not attending any school", "priority_level": 1},
    {"name": "Youth with Multiple Barriers", "description": "Youth facing 2 or more barriers to employment", "priority_level": 2}
  ]'::jsonb,
  '{"enableAutoDetermination": true, "autoDeterminationThreshold": 80, "requireCaseManagerReview": true, "reviewTimeoutDays": 7, "eligibilityValidDays": 365}'::jsonb,
  'WIOA Section 129, 20 CFR 681'
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_eligibility_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER eligibility_workflows_updated_at
  BEFORE UPDATE ON eligibility_workflows
  FOR EACH ROW EXECUTE FUNCTION update_eligibility_updated_at();

CREATE TRIGGER eligibility_criteria_updated_at
  BEFORE UPDATE ON eligibility_criteria
  FOR EACH ROW EXECUTE FUNCTION update_eligibility_updated_at();

CREATE TRIGGER priority_populations_updated_at
  BEFORE UPDATE ON priority_populations
  FOR EACH ROW EXECUTE FUNCTION update_eligibility_updated_at();

-- Function to log workflow changes
CREATE OR REPLACE FUNCTION log_workflow_change()
RETURNS TRIGGER AS $$
DECLARE
  change_desc TEXT;
  user_name_val TEXT;
BEGIN
  -- Get user name
  SELECT COALESCE(first_name || ' ' || last_name, email) INTO user_name_val
  FROM staff WHERE user_id = auth.uid();

  IF user_name_val IS NULL THEN
    user_name_val := 'System';
  END IF;

  -- Determine change type and description
  IF TG_OP = 'INSERT' THEN
    change_desc := 'Workflow created';
    INSERT INTO workflow_change_log (workflow_id, user_id, user_name, change_type, description, new_value)
    VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), user_name_val, 'created', change_desc, row_to_json(NEW)::jsonb);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status AND NEW.status = 'published' THEN
      change_desc := 'Workflow published (version ' || NEW.version || ')';
      INSERT INTO workflow_change_log (workflow_id, user_id, user_name, change_type, description, previous_value, new_value)
      VALUES (NEW.id, auth.uid(), user_name_val, 'published', change_desc, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
    ELSIF OLD.status != NEW.status AND NEW.status = 'archived' THEN
      change_desc := 'Workflow archived';
      INSERT INTO workflow_change_log (workflow_id, user_id, user_name, change_type, description)
      VALUES (NEW.id, auth.uid(), user_name_val, 'archived', change_desc);
    ELSE
      change_desc := 'Workflow modified';
      INSERT INTO workflow_change_log (workflow_id, user_id, user_name, change_type, description, previous_value, new_value)
      VALUES (NEW.id, auth.uid(), user_name_val, 'modified', change_desc, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for workflow change logging
CREATE TRIGGER workflow_change_log_trigger
  AFTER INSERT OR UPDATE ON eligibility_workflows
  FOR EACH ROW EXECUTE FUNCTION log_workflow_change();
