import { Link } from 'react-router-dom';
import { FileText, Shield, Users, AlertTriangle, Scale, Mail, Building, Briefcase, GraduationCap, Gavel, Clock } from 'lucide-react';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    icon: FileText,
    content: `By accessing or using the STEMWorkforce platform ("Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Service.

These Terms constitute a legally binding agreement between you and STEMWorkforce, Inc. ("Company," "we," "us," or "our"). These Terms apply to all visitors, users, and others who access or use the Service, including:

• Job seekers, students, interns, and professionals seeking employment
• Employers, hiring managers, and recruiters posting opportunities
• Educational institutions and academic partners
• Government agencies and public sector partners
• Service providers, career coaches, and training organizations
• National laboratories and research institutions

IMPORTANT: If you are entering into these Terms on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.`
  },
  {
    id: 'eligibility',
    title: '2. Eligibility and Account Requirements',
    icon: Users,
    content: `2.1 Age Requirements
You must be at least 13 years of age to use the Service. If you are between 13 and 18 years of age, you may only use the Service with the consent of a parent or legal guardian who agrees to be bound by these Terms. Users under 13 are prohibited from using the Service in compliance with the Children's Online Privacy Protection Act (COPPA).

2.2 Account Registration
When creating an account, you must provide accurate, complete, and current information. You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized access or security breach
• Keeping your account information up to date

2.3 Account Types
• Individual Accounts: For job seekers, students, and professionals
• Organizational Accounts: For employers, educational institutions, and government agencies
• Service Provider Accounts: For career coaches, recruiters, and training providers
• Administrative Accounts: For authorized organizational administrators

2.4 Account Verification
We may require identity verification, including but not limited to email verification, phone verification, and documentation for certain account types. Employers posting positions may be subject to additional verification requirements.

2.5 Account Termination
You may delete your account at any time through your account settings. We reserve the right to suspend or terminate accounts that violate these Terms.`
  },
  {
    id: 'acceptable-use',
    title: '3. Acceptable Use Policy',
    icon: Shield,
    content: `3.1 Lawful Use
You agree to use the Service only for lawful purposes and in compliance with all applicable federal, state, local, and international laws, including but not limited to:
• Title VII of the Civil Rights Act of 1964
• Americans with Disabilities Act (ADA)
• Age Discrimination in Employment Act (ADEA)
• Equal Pay Act
• Immigration Reform and Control Act (IRCA)
• Fair Credit Reporting Act (FCRA)
• State and local employment laws

3.2 Prohibited Conduct
You agree NOT to:
• Post false, misleading, fraudulent, or deceptive job listings or credentials
• Discriminate in job postings or hiring based on race, color, religion, sex, national origin, age, disability, genetic information, veteran status, or any other protected characteristic
• Impersonate any person or entity, or misrepresent your affiliation
• Post positions that violate minimum wage, overtime, or other labor laws
• Engage in unlicensed recruiting or staffing activities where licensure is required
• Use the Service for any illegal employment scheme or pyramid/MLM recruitment
• Harvest, scrape, or collect user data without authorization
• Transmit malware, viruses, or harmful code
• Attempt to gain unauthorized access to the Service or other users' accounts
• Interfere with or disrupt the Service's operation
• Use automated bots or scripts without written permission
• Circumvent any security or access controls
• Post content that is defamatory, obscene, threatening, or harassing
• Violate any third party's intellectual property or privacy rights

3.3 Employer-Specific Obligations
Employers using the Service must:
• Ensure all job postings are for legitimate, existing positions
• Provide accurate compensation, benefits, and job requirement information
• Comply with E-Verify requirements where applicable
• Maintain proper I-9 documentation for hired candidates
• For STEM OPT positions: comply with Department of Homeland Security training plan requirements
• Respond to applications in a timely and professional manner
• Not require applicants to pay fees for consideration`
  },
  {
    id: 'content',
    title: '4. User Content and Intellectual Property',
    icon: FileText,
    content: `4.1 User Content Ownership
You retain all ownership rights to content you submit to the Service ("User Content"), including resumes, cover letters, profile information, job listings, and communications. By submitting User Content, you grant STEMWorkforce a non-exclusive, worldwide, royalty-free, sublicensable license to use, reproduce, modify, display, and distribute such content solely for the purpose of operating and improving the Service.

4.2 Content Representations
You represent and warrant that:
• You own or have the necessary rights to your User Content
• Your User Content does not infringe any third party's intellectual property, privacy, or other rights
• Your User Content is accurate and not misleading
• Job listings comply with all applicable employment and labor laws
• You have obtained any necessary consents for personal information included in your content

4.3 Content Removal
We reserve the right to remove any User Content that violates these Terms, applicable laws, or our policies. We are not obligated to monitor all User Content but may do so at our discretion.

4.4 STEMWorkforce Intellectual Property
The Service, including its design, features, functionality, code, and content created by us, is owned by STEMWorkforce and protected by copyright, trademark, patent, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our written permission.

4.5 Feedback
If you provide feedback, suggestions, or ideas about the Service, you grant us the right to use such feedback without compensation or attribution to you.`
  },
  {
    id: 'employment',
    title: '5. Employment Law Compliance',
    icon: Briefcase,
    content: `5.1 No Employment Relationship
STEMWorkforce is a platform that connects job seekers with employers. We are not an employer, employment agency, or staffing company. No employment, agency, partnership, or joint venture relationship is created between you and STEMWorkforce by using the Service.

5.2 Equal Employment Opportunity
We are committed to equal employment opportunity principles. All users must comply with applicable anti-discrimination laws. Job postings must not discriminate based on:
• Race, color, or ethnicity
• Religion or creed
• Sex, gender, or gender identity
• Sexual orientation
• National origin or ancestry
• Age (40 and older)
• Disability (physical or mental)
• Genetic information
• Military or veteran status
• Citizenship or immigration status (except as required by law)
• Marital or familial status
• Political affiliation
• Any other characteristic protected by law

5.3 Background Checks and Screening
If you use the Service to conduct background checks or screening:
• You must comply with the Fair Credit Reporting Act (FCRA)
• You must provide required disclosures and obtain proper authorization
• You must follow adverse action procedures when required
• You are solely responsible for compliance with all applicable laws

5.4 International Workers
For positions involving international workers, H-1B visas, STEM OPT, or similar programs:
• Employers must comply with Department of Labor wage requirements
• Employers must maintain required public access files
• Employers must submit proper Labor Condition Applications (LCAs)
• Training plans must be filed for STEM OPT participants
• All immigration law requirements must be followed

5.5 Independent Contractor Classifications
If posting opportunities for independent contractors, you must properly classify workers according to IRS guidelines and applicable state laws. Misclassification of employees as independent contractors is prohibited.`
  },
  {
    id: 'education-partners',
    title: '6. Educational Institution Terms',
    icon: GraduationCap,
    content: `6.1 Institutional Accounts
Educational institutions using the Service must:
• Designate authorized administrators
• Ensure student data is protected in compliance with FERPA
• Obtain necessary student consent before sharing educational records
• Maintain accurate institutional information

6.2 Student Data Protection
For institutions connecting students with employers:
• Student educational records require explicit consent before sharing
• Directory information policies must be communicated to students
• Students must be able to opt out of information sharing
• Records must be maintained of all disclosures

6.3 Career Services Integration
Institutions using career services features must:
• Ensure career counselors have appropriate training
• Verify employer legitimacy before promoting opportunities
• Report suspicious job postings or potential scams
• Comply with NACE (National Association of Colleges and Employers) principles

6.4 Research and Analytics
Institutional partners may access aggregated, anonymized data for:
• Workforce trend analysis
• Program effectiveness evaluation
• Career outcome tracking
• Compliance with accreditation requirements`
  },
  {
    id: 'government',
    title: '7. Government and Public Sector Terms',
    icon: Building,
    content: `7.1 Government User Accounts
Government agencies and public sector entities using the Service are subject to additional terms:
• All applicable federal, state, and local procurement regulations
• Public records and transparency requirements
• Ethics and conflict of interest rules
• Security and privacy requirements

7.2 Federal Contractor Requirements
For federal positions or contracts:
• Compliance with FAR (Federal Acquisition Regulation) requirements
• OFCCP (Office of Federal Contract Compliance Programs) obligations
• Required EEO and affirmative action compliance
• Mandatory disability and veteran hiring goals

7.3 Security Clearance Positions
For positions requiring security clearances:
• Only individuals with proper authorization may view classified position details
• Clearance verification must comply with applicable regulations
• SF-86 and related information must be protected
• Proper handling of sensitive information is required

7.4 Grant-Funded Positions
Positions funded by federal grants must:
• Comply with grant terms and conditions
• Follow applicable OMB Uniform Guidance requirements
• Maintain required documentation
• Report as required by funding agencies`
  },
  {
    id: 'privacy',
    title: '8. Privacy and Data Protection',
    icon: Shield,
    content: `8.1 Privacy Policy
Your use of the Service is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy for information about:
• What data we collect and how we use it
• How we share information with third parties
• Your rights regarding your personal data
• How to exercise your privacy rights

8.2 Data Processing
By using the Service, you acknowledge that we may process personal data as described in our Privacy Policy, including:
• Account information (name, email, contact details)
• Profile and resume information
• Usage data and analytics
• Communications and correspondence

8.3 Compliance with Privacy Laws
We comply with applicable privacy laws, including:
• California Consumer Privacy Act (CCPA/CPRA)
• General Data Protection Regulation (GDPR) for EU users
• State privacy laws (Virginia, Colorado, Connecticut, Utah, and others)
• Sector-specific regulations (FERPA, HIPAA where applicable)

8.4 Cross-Border Data Transfers
If you are located outside the United States, your data may be transferred to and processed in the United States. By using the Service, you consent to such transfers, which are conducted with appropriate safeguards.`
  },
  {
    id: 'disclaimers',
    title: '9. Disclaimers and Limitations',
    icon: AlertTriangle,
    content: `9.1 Service Disclaimer
THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, STEMWORKFORCE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
• Implied warranties of merchantability and fitness for a particular purpose
• Warranties of non-infringement
• Warranties that the Service will be uninterrupted, secure, or error-free
• Warranties regarding the accuracy, reliability, or completeness of any content

9.2 Employment Outcomes Disclaimer
WE DO NOT GUARANTEE:
• That you will find employment or hire qualified candidates
• The accuracy of job listings, employer information, or candidate credentials
• The legitimacy, safety, or legality of any job opportunity
• The outcome of any application, interview, or hiring decision
• The qualifications, background, or conduct of any user

9.3 Third-Party Content
We are not responsible for:
• Content posted by users, employers, or third parties
• External websites linked from the Service
• Third-party services integrated with the platform
• Actions or omissions of employers, job seekers, or other users

9.4 Regulatory Compliance
While we strive to help users comply with applicable laws, we are not responsible for:
• Your compliance with employment, labor, or other laws
• Penalties resulting from your non-compliance
• Legal advice or guidance (we are not a law firm)`
  },
  {
    id: 'limitation',
    title: '10. Limitation of Liability',
    icon: Scale,
    content: `10.1 Exclusion of Damages
TO THE MAXIMUM EXTENT PERMITTED BY LAW, STEMWORKFORCE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, AND PARTNERS SHALL NOT BE LIABLE FOR ANY:
• Indirect, incidental, special, consequential, or punitive damages
• Loss of profits, revenue, data, or business opportunities
• Cost of substitute services
• Personal injury or property damage
• Damages arising from unauthorized access, use, or alteration of your data

10.2 Liability Cap
OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF:
• The amount you paid us in the twelve (12) months preceding the claim, or
• One hundred dollars ($100)

10.3 Exceptions
These limitations do not apply to:
• Liability that cannot be excluded by law
• Fraud or intentional misconduct
• Gross negligence
• Death or personal injury caused by our negligence

10.4 Basis of the Bargain
You acknowledge that the limitations of liability in this section are essential elements of the bargain between you and STEMWorkforce, and that we would not provide the Service without these limitations.`
  },
  {
    id: 'indemnification',
    title: '11. Indemnification',
    icon: Shield,
    content: `11.1 Your Indemnification Obligations
You agree to indemnify, defend, and hold harmless STEMWorkforce and its officers, directors, employees, agents, licensors, and partners from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or relating to:
• Your use of the Service
• Your User Content
• Your violation of these Terms
• Your violation of any applicable law or regulation
• Your violation of any third party's rights
• Any employment or hiring decision you make
• Your failure to comply with employment laws
• Any dispute between you and another user

11.2 Employer-Specific Indemnification
Employers additionally agree to indemnify us against claims arising from:
• Discriminatory hiring practices
• Misclassification of workers
• Wage and hour violations
• Violations of immigration laws
• Background check violations
• Any claims by applicants or employees

11.3 Defense and Settlement
We reserve the right to assume exclusive defense and control of any matter subject to indemnification. You agree to cooperate with our defense and not settle any claim without our written consent.`
  },
  {
    id: 'dispute-resolution',
    title: '12. Dispute Resolution',
    icon: Gavel,
    content: `12.1 Informal Resolution
Before filing any formal legal action, you agree to attempt to resolve disputes informally by contacting us at legal@stemworkforce.org. We will attempt to resolve disputes within 30 days.

12.2 Arbitration Agreement
PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.

You and STEMWorkforce agree that any dispute arising from these Terms or the Service shall be resolved through binding individual arbitration, rather than in court, except:
• You may assert claims in small claims court if eligible
• Either party may seek injunctive relief in court for intellectual property violations

Arbitration shall be conducted by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration will be held in Washington, D.C., or another mutually agreed location.

12.3 Class Action Waiver
YOU AND STEMWORKFORCE AGREE TO RESOLVE DISPUTES ONLY ON AN INDIVIDUAL BASIS AND NOT AS PART OF ANY CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. If this waiver is found unenforceable, the arbitration agreement shall be void.

12.4 Opt-Out
You may opt out of the arbitration agreement by sending written notice to legal@stemworkforce.org within 30 days of creating your account. The notice must include your name, email, and a clear statement of your intent to opt out.

12.5 Governing Law
These Terms shall be governed by the laws of the State of Delaware and applicable federal law, without regard to conflict of law principles.

12.6 Jurisdiction
For matters not subject to arbitration, you consent to the exclusive jurisdiction of the federal and state courts located in Delaware.`
  },
  {
    id: 'termination',
    title: '13. Term and Termination',
    icon: Clock,
    content: `13.1 Term
These Terms are effective when you first access the Service and continue until terminated.

13.2 Termination by You
You may terminate your account at any time by:
• Using the account deletion feature in your settings
• Contacting support@stemworkforce.org

13.3 Termination by Us
We may suspend or terminate your account immediately, with or without notice, if:
• You violate these Terms
• You engage in fraudulent or illegal activity
• Your account poses a security risk
• Required by law
• We discontinue the Service

13.4 Effect of Termination
Upon termination:
• Your right to use the Service ends immediately
• We may delete your account data (subject to legal retention requirements)
• Provisions that by their nature should survive will survive, including: ownership, warranty disclaimers, indemnification, limitations of liability, and dispute resolution

13.5 Data Retention After Termination
We may retain certain data after termination as required by law or for legitimate business purposes, as described in our Privacy Policy.`
  },
  {
    id: 'changes',
    title: '14. Modifications to Terms',
    icon: FileText,
    content: `14.1 Changes to Terms
We reserve the right to modify these Terms at any time. Material changes will be communicated through:
• Email notification to your registered address
• Prominent notice on the Service
• Posting on this page with updated "Last Modified" date

14.2 Notice Period
For material changes, we will provide at least 30 days' notice before the new terms take effect. For non-material changes, the new terms will be effective upon posting.

14.3 Acceptance of Changes
Your continued use of the Service after changes take effect constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service and terminate your account.

14.4 Review Recommendation
We encourage you to review these Terms periodically. You can find the current version at stemworkforce.org/terms.`
  },
  {
    id: 'general',
    title: '15. General Provisions',
    icon: Scale,
    content: `15.1 Entire Agreement
These Terms, together with our Privacy Policy and any additional terms for specific features, constitute the entire agreement between you and STEMWorkforce regarding the Service.

15.2 Severability
If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.

15.3 Waiver
Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other provision.

15.4 Assignment
You may not assign or transfer these Terms without our written consent. We may assign our rights and obligations without restriction.

15.5 No Third-Party Beneficiaries
These Terms do not create any third-party beneficiary rights, except for indemnified parties.

15.6 Force Majeure
We are not liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, government actions, or internet failures.

15.7 Headings
Section headings are for convenience only and do not affect the interpretation of these Terms.

15.8 Language
These Terms are written in English. Any translations are provided for convenience only; the English version controls.`
  },
  {
    id: 'contact',
    title: '16. Contact Information',
    icon: Mail,
    content: `For questions about these Terms of Service, please contact us:

Legal Department
Email: legal@stemworkforce.org

Privacy Inquiries
Email: privacy@stemworkforce.org

General Support
Email: support@stemworkforce.org

Mailing Address
STEMWorkforce, Inc.
Washington, DC, USA

For California residents: If you have a disability and need these Terms in an alternative format, please contact accessibility@stemworkforce.org.

For EU residents: You may contact our EU representative for GDPR inquiries at gdpr@stemworkforce.org.`
  },
];

export default function TermsOfServicePage() {
  const lastUpdated = 'February 8, 2026';
  const effectiveDate = 'February 8, 2026';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-sm font-medium mb-6">
            <Gavel size={16} />
            Legal Agreement
          </div>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-slate-400 mt-4">
            Last updated: {lastUpdated} | Effective: {effectiveDate}
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">Important Legal Notice</h3>
              <p className="text-slate-300 text-sm">
                These Terms contain an arbitration agreement and class action waiver (Section 12). Please read carefully before using the Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-8 border-b border-slate-800">
        <h2 className="text-sm font-medium text-slate-400 mb-4">Quick Navigation</h2>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              {section.title.split('. ')[1]}
            </a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 mb-8 text-lg">
            Welcome to STEMWorkforce. These Terms of Service ("Terms") govern your access to and use of the STEMWorkforce platform and services. By using our Service, you agree to comply with and be bound by these Terms. This is a legally binding agreement between you and STEMWorkforce, Inc.
          </p>

          {/* Key Points Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-12">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-400" />
              Key Points
            </h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                You must be at least 13 years old to use the Service (18+ for certain features)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                You are responsible for maintaining the confidentiality of your account
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Employers must comply with all applicable employment and labor laws
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                We are a platform, not an employer—we do not guarantee employment outcomes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Disputes are resolved through binding arbitration (you may opt out within 30 days)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                These Terms may be updated; continued use constitutes acceptance
              </li>
            </ul>
          </div>

          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <section.icon size={20} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="text-slate-300 whitespace-pre-line leading-relaxed pl-12">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          {/* Legal Contact Information */}
          <div className="bg-slate-900 rounded-xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Legal Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Legal Department</p>
                <a href="mailto:legal@stemworkforce.org" className="text-blue-400 hover:text-blue-300">
                  legal@stemworkforce.org
                </a>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Arbitration Opt-Out</p>
                <p className="text-slate-300 text-xs">Within 30 days of account creation</p>
                <a href="mailto:legal@stemworkforce.org?subject=Arbitration%20Opt-Out" className="text-blue-400 hover:text-blue-300">
                  legal@stemworkforce.org
                </a>
              </div>
              <div>
                <p className="text-slate-400 mb-1">General Support</p>
                <a href="mailto:support@stemworkforce.org" className="text-blue-400 hover:text-blue-300">
                  support@stemworkforce.org
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-slate-400 text-sm">
              By using STEMWorkforce, you agree to these Terms of Service and our Privacy Policy.
            </p>
            <div className="flex gap-4">
              <Link
                to="/privacy"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/security"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Security
              </Link>
              <Link
                to="/contact"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
