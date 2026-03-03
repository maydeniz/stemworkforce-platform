// ===========================================
// PDF Generation Service
// Handles PDF generation for healthcare documents
// ===========================================

/**
 * Generic PDF generation options
 */
interface PDFGenerationOptions {
  filename: string;
  title: string;
  subtitle?: string;
  logoUrl?: string;
}

/**
 * Medical Excuse PDF data
 */
export interface MedicalExcusePDFData {
  studentName: string;
  studentId: string;
  schoolName: string;
  excuseType: string;
  startDate: string;
  endDate?: string;
  restrictions?: string[];
  notes?: string;
  providerName: string;
  providerCredentials?: string[];
  providerNPI?: string;
  signature?: string;
  createdAt: string;
}

/**
 * Sports Physical PDF data
 */
export interface SportsPhysicalPDFData {
  studentName: string;
  studentId: string;
  dateOfBirth: string;
  schoolName: string;
  sports: string[];
  examDate: string;
  expirationDate: string;
  clearanceLevel: 'full' | 'limited' | 'none';
  limitations?: string[];
  conditions?: string[];
  bloodPressure?: string;
  heartRate?: number;
  height?: string;
  weight?: string;
  vision?: { left: string; right: string };
  providerName: string;
  providerCredentials?: string[];
  providerNPI?: string;
  signature?: string;
}

/**
 * Dental Screening PDF data
 */
export interface DentalScreeningPDFData {
  studentName: string;
  studentId: string;
  dateOfBirth: string;
  schoolName: string;
  screeningDate: string;
  overallAssessment: string;
  findings: string[];
  recommendations: string[];
  urgentCareNeeded: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  providerName: string;
  providerCredentials?: string[];
  providerNPI?: string;
}

/**
 * Format date for PDF display
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generate HTML content for PDF
 */
const generatePDFHTML = (
  content: string,
  options: PDFGenerationOptions
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${options.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #333;
          padding: 40px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #10b981;
        }
        .header h1 {
          font-size: 24pt;
          color: #10b981;
          margin-bottom: 5px;
        }
        .header h2 {
          font-size: 14pt;
          color: #666;
          font-weight: normal;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 14pt;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #e5e7eb;
        }
        .field {
          margin-bottom: 8px;
        }
        .field-label {
          font-weight: bold;
          color: #666;
          display: inline-block;
          width: 150px;
        }
        .field-value {
          color: #333;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 10pt;
          font-weight: bold;
        }
        .badge-green {
          background-color: #d1fae5;
          color: #065f46;
        }
        .badge-yellow {
          background-color: #fef3c7;
          color: #92400e;
        }
        .badge-red {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .signature-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .signature-line {
          border-bottom: 1px solid #333;
          width: 250px;
          margin-top: 40px;
          margin-bottom: 5px;
        }
        .signature-label {
          font-size: 10pt;
          color: #666;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 9pt;
          color: #999;
        }
        .hipaa-notice {
          background-color: #f0fdf4;
          border: 1px solid #86efac;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
          font-size: 10pt;
        }
        .hipaa-notice strong {
          color: #166534;
        }
        ul {
          margin-left: 20px;
        }
        li {
          margin-bottom: 4px;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${options.title}</h1>
        ${options.subtitle ? `<h2>${options.subtitle}</h2>` : ''}
      </div>
      ${content}
      <div class="footer">
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>This document is confidential and intended only for the authorized recipient.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate Medical Excuse PDF
 */
export const generateMedicalExcusePDF = async (
  data: MedicalExcusePDFData
): Promise<Blob> => {
  const content = `
    <div class="section">
      <div class="section-title">Student Information</div>
      <div class="grid">
        <div class="field">
          <span class="field-label">Student Name:</span>
          <span class="field-value">${data.studentName}</span>
        </div>
        <div class="field">
          <span class="field-label">Student ID:</span>
          <span class="field-value">${data.studentId}</span>
        </div>
        <div class="field">
          <span class="field-label">School:</span>
          <span class="field-value">${data.schoolName}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Excuse Details</div>
      <div class="field">
        <span class="field-label">Type:</span>
        <span class="field-value">${data.excuseType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
      </div>
      <div class="field">
        <span class="field-label">Start Date:</span>
        <span class="field-value">${formatDate(data.startDate)}</span>
      </div>
      ${data.endDate ? `
      <div class="field">
        <span class="field-label">End Date:</span>
        <span class="field-value">${formatDate(data.endDate)}</span>
      </div>
      ` : ''}
      ${data.restrictions && data.restrictions.length > 0 ? `
      <div class="field">
        <span class="field-label">Restrictions:</span>
        <ul>
          ${data.restrictions.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      ${data.notes ? `
      <div class="field">
        <span class="field-label">Notes:</span>
        <span class="field-value">${data.notes}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">Provider Information</div>
      <div class="field">
        <span class="field-label">Provider Name:</span>
        <span class="field-value">${data.providerName}</span>
      </div>
      ${data.providerCredentials ? `
      <div class="field">
        <span class="field-label">Credentials:</span>
        <span class="field-value">${data.providerCredentials.join(', ')}</span>
      </div>
      ` : ''}
      ${data.providerNPI ? `
      <div class="field">
        <span class="field-label">NPI:</span>
        <span class="field-value">${data.providerNPI}</span>
      </div>
      ` : ''}
      <div class="field">
        <span class="field-label">Date Issued:</span>
        <span class="field-value">${formatDate(data.createdAt)}</span>
      </div>
    </div>

    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-label">Provider Signature</div>
    </div>

    <div class="hipaa-notice">
      <strong>HIPAA Notice:</strong> This document contains Protected Health Information (PHI)
      and is subject to HIPAA privacy regulations. Unauthorized disclosure is prohibited.
    </div>
  `;

  const html = generatePDFHTML(content, {
    filename: `medical-excuse-${data.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
    title: 'Medical Excuse',
    subtitle: data.schoolName,
  });

  // Create a Blob from the HTML for download
  return new Blob([html], { type: 'text/html' });
};

/**
 * Generate Sports Physical PDF
 */
export const generateSportsPhysicalPDF = async (
  data: SportsPhysicalPDFData
): Promise<Blob> => {
  const clearanceBadge = data.clearanceLevel === 'full'
    ? '<span class="badge badge-green">FULL CLEARANCE</span>'
    : data.clearanceLevel === 'limited'
    ? '<span class="badge badge-yellow">LIMITED CLEARANCE</span>'
    : '<span class="badge badge-red">NOT CLEARED</span>';

  const content = `
    <div class="section">
      <div class="section-title">Student Information</div>
      <div class="grid">
        <div class="field">
          <span class="field-label">Student Name:</span>
          <span class="field-value">${data.studentName}</span>
        </div>
        <div class="field">
          <span class="field-label">Student ID:</span>
          <span class="field-value">${data.studentId}</span>
        </div>
        <div class="field">
          <span class="field-label">Date of Birth:</span>
          <span class="field-value">${formatDate(data.dateOfBirth)}</span>
        </div>
        <div class="field">
          <span class="field-label">School:</span>
          <span class="field-value">${data.schoolName}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Clearance Status</div>
      <div class="field">
        ${clearanceBadge}
      </div>
      <div class="field">
        <span class="field-label">Sports:</span>
        <span class="field-value">${data.sports.join(', ')}</span>
      </div>
      <div class="grid">
        <div class="field">
          <span class="field-label">Exam Date:</span>
          <span class="field-value">${formatDate(data.examDate)}</span>
        </div>
        <div class="field">
          <span class="field-label">Expires:</span>
          <span class="field-value">${formatDate(data.expirationDate)}</span>
        </div>
      </div>
      ${data.limitations && data.limitations.length > 0 ? `
      <div class="field">
        <span class="field-label">Limitations:</span>
        <ul>
          ${data.limitations.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">Physical Examination</div>
      <div class="grid">
        ${data.bloodPressure ? `
        <div class="field">
          <span class="field-label">Blood Pressure:</span>
          <span class="field-value">${data.bloodPressure}</span>
        </div>
        ` : ''}
        ${data.heartRate ? `
        <div class="field">
          <span class="field-label">Heart Rate:</span>
          <span class="field-value">${data.heartRate} bpm</span>
        </div>
        ` : ''}
        ${data.height ? `
        <div class="field">
          <span class="field-label">Height:</span>
          <span class="field-value">${data.height}</span>
        </div>
        ` : ''}
        ${data.weight ? `
        <div class="field">
          <span class="field-label">Weight:</span>
          <span class="field-value">${data.weight}</span>
        </div>
        ` : ''}
        ${data.vision ? `
        <div class="field">
          <span class="field-label">Vision (L/R):</span>
          <span class="field-value">${data.vision.left} / ${data.vision.right}</span>
        </div>
        ` : ''}
      </div>
      ${data.conditions && data.conditions.length > 0 ? `
      <div class="field">
        <span class="field-label">Medical Conditions:</span>
        <ul>
          ${data.conditions.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">Provider Information</div>
      <div class="field">
        <span class="field-label">Provider Name:</span>
        <span class="field-value">${data.providerName}</span>
      </div>
      ${data.providerCredentials ? `
      <div class="field">
        <span class="field-label">Credentials:</span>
        <span class="field-value">${data.providerCredentials.join(', ')}</span>
      </div>
      ` : ''}
      ${data.providerNPI ? `
      <div class="field">
        <span class="field-label">NPI:</span>
        <span class="field-value">${data.providerNPI}</span>
      </div>
      ` : ''}
    </div>

    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-label">Provider Signature</div>
    </div>

    <div class="hipaa-notice">
      <strong>HIPAA Notice:</strong> This document contains Protected Health Information (PHI)
      and is subject to HIPAA privacy regulations. Unauthorized disclosure is prohibited.
    </div>
  `;

  const html = generatePDFHTML(content, {
    filename: `sports-physical-${data.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
    title: 'Sports Physical Examination',
    subtitle: data.schoolName,
  });

  return new Blob([html], { type: 'text/html' });
};

/**
 * Generate Dental Screening PDF
 */
export const generateDentalScreeningPDF = async (
  data: DentalScreeningPDFData
): Promise<Blob> => {
  const assessmentBadge = data.overallAssessment === 'healthy'
    ? '<span class="badge badge-green">HEALTHY</span>'
    : data.overallAssessment === 'needs_attention'
    ? '<span class="badge badge-yellow">NEEDS ATTENTION</span>'
    : '<span class="badge badge-red">URGENT CARE NEEDED</span>';

  const content = `
    <div class="section">
      <div class="section-title">Student Information</div>
      <div class="grid">
        <div class="field">
          <span class="field-label">Student Name:</span>
          <span class="field-value">${data.studentName}</span>
        </div>
        <div class="field">
          <span class="field-label">Student ID:</span>
          <span class="field-value">${data.studentId}</span>
        </div>
        <div class="field">
          <span class="field-label">Date of Birth:</span>
          <span class="field-value">${formatDate(data.dateOfBirth)}</span>
        </div>
        <div class="field">
          <span class="field-label">School:</span>
          <span class="field-value">${data.schoolName}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Screening Results</div>
      <div class="field">
        <span class="field-label">Overall Assessment:</span>
        ${assessmentBadge}
      </div>
      <div class="field">
        <span class="field-label">Screening Date:</span>
        <span class="field-value">${formatDate(data.screeningDate)}</span>
      </div>
      ${data.urgentCareNeeded ? `
      <div class="field">
        <span class="badge badge-red">URGENT DENTAL CARE REQUIRED</span>
      </div>
      ` : ''}
      ${data.findings && data.findings.length > 0 ? `
      <div class="field">
        <span class="field-label">Findings:</span>
        <ul>
          ${data.findings.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      ${data.recommendations && data.recommendations.length > 0 ? `
      <div class="field">
        <span class="field-label">Recommendations:</span>
        <ul>
          ${data.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      ${data.followUpRequired ? `
      <div class="field">
        <span class="field-label">Follow-up Required:</span>
        <span class="field-value">Yes${data.followUpDate ? ` - by ${formatDate(data.followUpDate)}` : ''}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">Provider Information</div>
      <div class="field">
        <span class="field-label">Provider Name:</span>
        <span class="field-value">${data.providerName}</span>
      </div>
      ${data.providerCredentials ? `
      <div class="field">
        <span class="field-label">Credentials:</span>
        <span class="field-value">${data.providerCredentials.join(', ')}</span>
      </div>
      ` : ''}
      ${data.providerNPI ? `
      <div class="field">
        <span class="field-label">NPI:</span>
        <span class="field-value">${data.providerNPI}</span>
      </div>
      ` : ''}
    </div>

    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-label">Provider Signature</div>
    </div>

    <div class="hipaa-notice">
      <strong>HIPAA Notice:</strong> This document contains Protected Health Information (PHI)
      and is subject to HIPAA privacy regulations. Unauthorized disclosure is prohibited.
    </div>
  `;

  const html = generatePDFHTML(content, {
    filename: `dental-screening-${data.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
    title: 'Dental Screening Report',
    subtitle: data.schoolName,
  });

  return new Blob([html], { type: 'text/html' });
};

/**
 * Download a PDF blob as a file
 */
export const downloadPDF = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Open PDF in new tab for printing
 */
export const printPDF = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
