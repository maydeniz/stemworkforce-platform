import React, { useMemo } from 'react';
import { ArrowLeft, Building2, CheckCircle2, GraduationCap, Layers } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { OrganizationSelector } from '@/components/common/OrganizationSelector';
import { validateEmailDomain, willBeAutoVerified } from '@/utils/emailDomain';

interface OrganizationData {
  organizationId: string;
  organizationName: string;
  subunitId?: string;
  subunitName?: string;
  departmentId?: string;
  departmentName?: string;
  customOrganization?: string;
  customSubunit?: string;
  customDepartment?: string;
}

interface OrganizationStepProps {
  role: string;
  email: string;
  organizationData: OrganizationData;
  organizationName: string;
  collegeName: string;
  collegeUnit: string;
  onOrganizationDataChange: (data: OrganizationData) => void;
  onOrganizationNameChange: (name: string) => void;
  onCollegeNameChange: (name: string) => void;
  onCollegeUnitChange: (unit: string) => void;
  onBack: () => void;
  loading: boolean;
}

const OrganizationStep: React.FC<OrganizationStepProps> = ({
  role,
  email,
  organizationData,
  organizationName,
  collegeName,
  collegeUnit,
  onOrganizationDataChange,
  onOrganizationNameChange,
  onCollegeNameChange,
  onCollegeUnitChange,
  onBack,
  loading,
}) => {
  const isEducator = role === 'educator';
  const usesOrgSelector = ['partner_lab', 'partner_federal'].includes(role);

  const emailDomainValidation = useMemo(() => {
    if (!usesOrgSelector || !organizationData.organizationId || !email) {
      return { valid: true, message: undefined, autoVerified: false };
    }
    return validateEmailDomain(email, organizationData.organizationId, organizationData.organizationName);
  }, [email, organizationData.organizationId, organizationData.organizationName, usesOrgSelector]);

  const isAutoVerified = useMemo(() => {
    if (!usesOrgSelector || !organizationData.organizationId) return false;
    return willBeAutoVerified(email, organizationData.organizationId);
  }, [email, organizationData.organizationId, usesOrgSelector]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">
        {isEducator ? 'Your institution' : 'Your organization'}
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        {isEducator ? 'Tell us about your college or university' : 'Tell us where you work'}
      </p>

      <div className="space-y-4">
        {isEducator ? (
          <>
            <Input
              label="College / University"
              value={collegeName}
              onChange={(e) => onCollegeNameChange(e.target.value)}
              placeholder="e.g., MIT, Stanford University, Howard University"
              leftIcon={<GraduationCap className="w-4 h-4" />}
              required
              disabled={loading}
            />
            <Input
              label="Unit / Department"
              value={collegeUnit}
              onChange={(e) => onCollegeUnitChange(e.target.value)}
              placeholder="e.g., School of Engineering, Computer Science Dept."
              leftIcon={<Layers className="w-4 h-4" />}
              helperText="Optional - specify your school, college, or department"
              disabled={loading}
            />
          </>
        ) : usesOrgSelector ? (
          <>
            <OrganizationSelector
              role={role}
              value={organizationData}
              onChange={onOrganizationDataChange}
              disabled={loading}
            />
            {organizationData.organizationId && email && (
              <div className="mt-1">
                {isAutoVerified ? (
                  <p className="text-sm text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Email verified - matches organization domain
                  </p>
                ) : !emailDomainValidation.valid ? (
                  <p className="text-sm text-red-400">{emailDomainValidation.message}</p>
                ) : null}
              </div>
            )}
          </>
        ) : (
          <Input
            label="Organization Name"
            value={organizationName}
            onChange={(e) => onOrganizationNameChange(e.target.value)}
            placeholder="e.g., Lockheed Martin, SpaceX, Red Cross"
            leftIcon={<Building2 className="w-4 h-4" />}
            required
            disabled={loading}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </div>
  );
};

export default OrganizationStep;
