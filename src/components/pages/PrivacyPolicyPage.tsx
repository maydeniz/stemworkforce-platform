import { Link } from 'react-router-dom';
import { Shield, Eye, Database, Lock, Globe, Users, Bell, Mail, Trash2, FileText, Scale, Building, CheckCircle, XCircle } from 'lucide-react';

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction and Scope',
    icon: Shield,
    content: `STEMWorkforce, Inc. ("STEMWorkforce," "we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, mobile applications, and related services (collectively, the "Service").

This Privacy Policy applies to:
• Job seekers, students, and professionals creating accounts
• Employers, recruiters, and hiring managers
• Educational institutions and their administrators
• Government agencies and public sector partners
• Service providers and career coaches
• All visitors to our website and applications

By using the Service, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our practices, please do not use the Service.

IMPORTANT NOTICES:
• California Residents: See Section 13 for your specific CCPA/CPRA rights
• EU/EEA Residents: See Section 14 for your specific GDPR rights
• Other State Residents: See Section 15 for state-specific privacy rights`
  },
  {
    id: 'information-collected',
    title: '2. Information We Collect',
    icon: Database,
    content: `We collect information in several ways:

2.1 Information You Provide Directly:

Account Information:
• Name, email address, phone number
• Password (encrypted and hashed)
• Profile photo (optional)
• Account preferences and settings

Professional Information:
• Resume/CV and cover letters
• Work history and employment dates
• Education history, degrees, and certifications
• Skills, qualifications, and competencies
• Professional licenses and credentials
• Security clearance status (if applicable)
• Work authorization status
• Salary expectations and requirements

Job Search Activity:
• Job applications submitted
• Saved jobs and searches
• Employer interactions
• Interview schedules and feedback

Payment Information (for premium services):
• Credit/debit card information (processed by secure third-party processors)
• Billing address
• Transaction history

2.2 Information Collected Automatically:

Technical Data:
• IP address and geolocation (approximate)
• Browser type and version
• Operating system and device type
• Device identifiers
• Screen resolution

Usage Data:
• Pages viewed and time spent
• Features used and interactions
• Search queries and filters
• Click patterns and navigation
• Referral sources

2.3 Information from Third Parties:

• Social login providers (Google, GitHub, Apple, LinkedIn)
• Background check providers (with your consent)
• Educational institutions (transcript verification, with consent)
• Professional credential verification services
• Publicly available professional information
• Partner organizations (with appropriate consent)`
  },
  {
    id: 'legal-basis',
    title: '3. Legal Basis for Processing',
    icon: Scale,
    content: `We process your personal information based on the following legal grounds:

3.1 Contractual Necessity
Processing necessary to perform our contract with you, including:
• Creating and managing your account
• Processing job applications
• Facilitating communication with employers
• Providing customer support

3.2 Legitimate Interests
Processing based on our legitimate business interests, including:
• Improving and developing our services
• Preventing fraud and abuse
• Marketing similar services to existing users
• Conducting analytics and research

3.3 Consent
Processing based on your explicit consent, including:
• Marketing communications
• Sharing your profile with third parties
• Using non-essential cookies
• Processing sensitive personal data

3.4 Legal Obligations
Processing required to comply with applicable laws, including:
• Responding to legal requests and court orders
• Meeting tax and accounting requirements
• Complying with employment regulations
• Maintaining required records

3.5 Vital Interests
In rare cases, processing necessary to protect someone's life or safety.`
  },
  {
    id: 'how-we-use',
    title: '4. How We Use Your Information',
    icon: Eye,
    content: `We use your information for the following purposes:

4.1 Service Operations:
• Creating and managing your account
• Processing job applications and matching you with opportunities
• Facilitating communication between job seekers and employers
• Verifying credentials and qualifications
• Processing payments for premium services
• Providing career guidance and resources

4.2 Personalization and Recommendations:
• Customizing job recommendations based on your profile
• Tailoring content and features to your interests
• Remembering your preferences and settings

4.3 Communication:
• Sending service-related notifications (applications, messages, updates)
• Providing customer support and responding to inquiries
• Sending marketing communications (with consent)
• Notifying you of relevant job opportunities
• Sending security alerts and account notifications

4.4 Analytics and Improvements:
• Analyzing usage patterns to improve the Service
• Conducting A/B testing for new features
• Generating aggregated, anonymized reports
• Research on workforce trends (using anonymized data)

4.5 Security and Compliance:
• Detecting, preventing, and addressing fraud or security issues
• Monitoring for Terms of Service violations
• Complying with legal obligations
• Enforcing our policies and agreements

4.6 Employment Verification (for Employers):
• Verifying candidate information and credentials
• Facilitating background checks (with candidate consent)
• Supporting I-9 and E-Verify processes`
  },
  {
    id: 'information-sharing',
    title: '5. How We Share Your Information',
    icon: Users,
    content: `We share your information only as described in this Policy:

5.1 With Employers and Partners (with your consent):
• When you apply for a job, your application materials are shared with the employer
• Profile information visible to recruiters based on your privacy settings
• Your resume may be searchable by employers (if you opt in)
• Organizational partners may receive relevant candidate information

5.2 Service Providers (under contract):
• Cloud hosting and infrastructure (AWS, Google Cloud)
• Email and communication services
• Analytics and monitoring tools
• Payment processors (Stripe, etc.)
• Customer support platforms
• Identity verification services
• Background check providers

All service providers are contractually obligated to protect your data and use it only for specified purposes.

5.3 Legal and Safety Requirements:
• To comply with applicable laws, regulations, or legal processes
• To respond to lawful requests from law enforcement or government authorities
• To protect our rights, privacy, safety, or property
• To investigate potential violations of our Terms
• To protect the safety of users or the public

5.4 Business Transfers:
In connection with a merger, acquisition, reorganization, or sale of assets, your information may be transferred. We will notify you of any such change and your choices.

5.5 With Your Consent:
For any other purpose disclosed at the time of collection or with your explicit consent.

WE DO NOT SELL YOUR PERSONAL INFORMATION.
Under CCPA, "sale" has a specific meaning. We do not sell, rent, or trade your personal information for monetary consideration to third parties for their own marketing purposes.`
  },
  {
    id: 'data-security',
    title: '6. Data Security',
    icon: Lock,
    content: `We implement comprehensive security measures to protect your information:

6.1 Technical Safeguards:
• TLS 1.3 encryption for data in transit
• AES-256 encryption for data at rest
• Secure password hashing (bcrypt)
• Multi-factor authentication available
• Regular security assessments and penetration testing
• Web Application Firewall (WAF) protection
• DDoS protection and mitigation

6.2 Organizational Measures:
• Role-based access controls (least privilege principle)
• Employee security training and awareness programs
• Background checks for employees with data access
• Confidentiality agreements for all personnel
• Incident response procedures and team
• Regular security audits by third parties

6.3 Compliance Certifications:
• SOC 2 Type II certification
• Regular third-party security audits
• Compliance with industry security standards
• Annual risk assessments

6.4 Incident Response:
In the event of a data breach, we will:
• Investigate and contain the incident promptly
• Notify affected users as required by law
• Report to relevant authorities within required timeframes
• Take steps to prevent future incidents

While we implement robust security measures, no system is 100% secure. We cannot guarantee absolute security of your data.`
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    icon: Database,
    content: `We retain your information only as long as necessary for the purposes described in this Policy:

7.1 Account Data:
• Active accounts: Retained while your account is active
• Inactive accounts: May be deleted after 24 months of inactivity (with prior notice)
• Deleted accounts: Data removed within 30 days, except as required by law

7.2 Application Data:
• Job applications: Retained for 2 years after submission
• Interview records and feedback: Retained for 1 year
• Communication history: Retained for 3 years

7.3 Financial Records:
• Transaction records: Retained for 7 years (tax/legal requirements)
• Payment method details: Deleted upon account closure (except tokenized records)

7.4 Legal and Compliance:
• Data subject to legal holds: Retained as required
• Dispute-related data: Retained until resolution plus statute of limitations
• Audit logs: Retained for 3 years

7.5 Aggregated Data:
• Anonymized, aggregated data may be retained indefinitely for research and analytics

7.6 Employer Records:
• Employer posting history: Retained for 3 years
• Applicant tracking data: Retained per employer's data retention settings
• Compliance records (EEO, OFCCP): Retained as required by law`
  },
  {
    id: 'your-rights',
    title: '8. Your Privacy Rights',
    icon: Shield,
    content: `You have the following rights regarding your personal information:

8.1 Right to Access:
• Request a copy of the personal data we hold about you
• Receive information about how your data is processed
• Obtain your data in a portable, machine-readable format

8.2 Right to Correction:
• Update or correct inaccurate information
• Complete incomplete personal data
• Request we update information shared with third parties

8.3 Right to Deletion:
• Request deletion of your personal data
• Delete your account at any time
• Exceptions apply for legal/compliance requirements

8.4 Right to Restrict Processing:
• Request limitation of processing in certain circumstances
• Object to processing based on legitimate interests
• Opt out of automated decision-making

8.5 Right to Data Portability:
• Receive your data in a structured, machine-readable format
• Request transfer of your data to another service

8.6 Right to Withdraw Consent:
• Withdraw consent for consent-based processing at any time
• Opt out of marketing communications
• Manage cookie preferences

8.7 How to Exercise Your Rights:
• Account Settings: Use the privacy controls in your dashboard
• Email: privacy@stemworkforce.org
• Online Form: stemworkforce.org/privacy-request
• Response Time: Within 45 days (may extend to 90 days for complex requests)

We will not discriminate against you for exercising your privacy rights.`
  },
  {
    id: 'cookies',
    title: '9. Cookies and Tracking Technologies',
    icon: Eye,
    content: `9.1 Types of Cookies We Use:

Strictly Necessary Cookies:
• Authentication and session management
• Security features (CSRF protection)
• Load balancing
• Cannot be disabled

Functional Cookies:
• Language and region preferences
• Accessibility settings
• User interface customization

Analytics Cookies:
• Usage analytics (with IP anonymization)
• Performance monitoring
• Error tracking
• A/B testing

Marketing Cookies (with consent):
• Advertising effectiveness measurement
• Remarketing and retargeting
• Conversion tracking

9.2 Third-Party Cookies:
• Google Analytics (analytics)
• Stripe (payment processing)
• Social media plugins (if enabled)

9.3 Cookie Management:
• Cookie Preference Center: Manage preferences at any time
• Browser Settings: Block or delete cookies in your browser
• Do Not Track: We honor DNT signals
• Global Privacy Control (GPC): We honor GPC signals

9.4 Other Tracking Technologies:
• Pixel tags and web beacons
• Local storage and session storage
• Device fingerprinting (limited use for fraud prevention)`
  },
  {
    id: 'automated-decisions',
    title: '10. Automated Decision-Making',
    icon: Eye,
    content: `10.1 Job Matching and Recommendations:
We use automated systems to match job seekers with opportunities based on:
• Skills and qualifications
• Experience and education
• Location preferences
• Stated job preferences

These recommendations are suggestions only; humans make final hiring decisions.

10.2 Fraud Detection:
We use automated systems to detect potentially fraudulent or abusive activity, including:
• Suspicious login attempts
• Bot or scraping activity
• Fake account detection
• Spam and abuse patterns

10.3 Your Rights Regarding Automated Decisions:
• Request human review of significant automated decisions
• Receive explanation of logic involved
• Contest decisions and provide additional information
• Opt out of purely automated decisions with legal effects

10.4 No Automated Hiring Decisions:
We do not make automated hiring decisions. All employment decisions are made by human employers using our platform as a tool.`
  },
  {
    id: 'international',
    title: '11. International Data Transfers',
    icon: Globe,
    content: `11.1 Data Location:
Your information is primarily stored and processed in the United States. Some processing may occur in other countries where our service providers operate.

11.2 Transfer Mechanisms:
For international transfers, we use appropriate safeguards:

EU/EEA and UK Transfers:
• Standard Contractual Clauses (SCCs) approved by the European Commission
• Supplementary measures as required
• Data Processing Agreements with all processors

Other International Transfers:
• Contractual protections with service providers
• Privacy Shield principles (where applicable)
• Adequacy decisions where available

11.3 Your Consent:
By using the Service, you consent to the transfer of your information to the United States and other countries that may have different data protection laws than your country of residence.

11.4 Additional Safeguards:
• Encryption of data in transit and at rest
• Access controls and security measures
• Regular audits of international processors`
  },
  {
    id: 'children',
    title: '12. Children\'s Privacy',
    icon: Users,
    content: `12.1 Age Requirements:
Our Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13 in compliance with the Children's Online Privacy Protection Act (COPPA).

12.2 Teens (13-18):
For users between 13 and 18 years of age:
• Parental consent may be required for certain features
• We implement age-appropriate privacy protections
• Educational institution accounts have additional safeguards
• Marketing to minors is restricted

12.3 School and Education Partners:
When working with educational institutions:
• We comply with FERPA requirements
• Student data receives additional protection
• Schools control how student data is used
• Parental rights are respected

12.4 Discovery of Child Data:
If we learn that we have collected personal information from a child under 13 without proper consent, we will:
• Promptly delete that information
• Notify the parent/guardian if possible
• Take steps to prevent future collection

If you believe we have collected information from a child under 13, please contact us immediately at privacy@stemworkforce.org.`
  },
  {
    id: 'california',
    title: '13. California Privacy Rights (CCPA/CPRA)',
    icon: Scale,
    content: `This section applies to California residents under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA).

13.1 Categories of Personal Information Collected:
• Identifiers (name, email, IP address, etc.)
• Professional/employment information
• Education information
• Commercial information (transactions, purchase history)
• Internet/network activity
• Geolocation data (approximate)
• Inferences drawn from above categories

13.2 Your CCPA Rights:
• Right to Know: What personal information we collect and how we use it
• Right to Delete: Request deletion of your personal information
• Right to Correct: Request correction of inaccurate information
• Right to Opt-Out: Opt out of "sales" or "sharing" of personal information
• Right to Limit: Limit use of sensitive personal information
• Right to Non-Discrimination: Equal service regardless of rights exercised

13.3 Sensitive Personal Information:
We may collect the following sensitive categories (with consent):
• Social Security number (for certain employment verifications)
• Account login credentials
• Precise geolocation (optional)
• Racial/ethnic origin (optional, for EEO reporting)
• Citizenship/immigration status (for work authorization)

You may limit our use of sensitive information to what is necessary for the Service.

13.4 Do Not Sell or Share:
We DO NOT sell your personal information for monetary consideration.
We DO NOT share your personal information for cross-context behavioral advertising.

13.5 How to Exercise Rights:
• Online: stemworkforce.org/privacy-request
• Email: privacy@stemworkforce.org
• Toll-Free: 1-800-783-6967

13.6 Authorized Agents:
You may designate an authorized agent to make requests on your behalf with proper verification.

13.7 Verification:
We verify requests using account authentication or identity verification for non-account holders.

13.8 Financial Incentives:
We do not offer financial incentives for personal information.

13.9 Metrics:
California law requires annual disclosure of privacy request metrics. These are available at stemworkforce.org/privacy-metrics.`
  },
  {
    id: 'gdpr',
    title: '14. European Privacy Rights (GDPR)',
    icon: Globe,
    content: `This section applies to individuals in the European Union, European Economic Area, and United Kingdom under the General Data Protection Regulation (GDPR) and UK GDPR.

14.1 Data Controller:
STEMWorkforce, Inc. is the data controller for personal data collected through the Service.

14.2 EU Representative:
For GDPR inquiries, contact our EU representative at:
Email: gdpr@stemworkforce.org

14.3 Your GDPR Rights:
• Right of Access (Article 15): Obtain a copy of your personal data
• Right to Rectification (Article 16): Correct inaccurate data
• Right to Erasure (Article 17): Delete your data ("right to be forgotten")
• Right to Restriction (Article 18): Limit processing in certain cases
• Right to Data Portability (Article 20): Receive data in machine-readable format
• Right to Object (Article 21): Object to processing based on legitimate interests
• Rights Related to Automated Decisions (Article 22): Contest automated decisions

14.4 Legal Bases for Processing:
See Section 3 for the legal bases we rely on for processing.

14.5 Data Retention:
See Section 7 for our data retention practices.

14.6 International Transfers:
See Section 11 for information about international data transfers and safeguards.

14.7 Supervisory Authority:
You have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.

14.8 How to Exercise Rights:
• Email: gdpr@stemworkforce.org
• Response Time: Within 30 days (may extend to 60 days for complex requests)`
  },
  {
    id: 'state-laws',
    title: '15. Other State Privacy Laws',
    icon: Building,
    content: `15.1 Virginia (VCDPA):
Virginia residents have rights similar to CCPA, including access, correction, deletion, portability, and opt-out rights. Contact: privacy@stemworkforce.org

15.2 Colorado (CPA):
Colorado residents may access, correct, delete, and port their data, and opt out of targeted advertising, profiling, and sales. Contact: privacy@stemworkforce.org

15.3 Connecticut (CTDPA):
Connecticut residents have rights to access, correct, delete, and port data, plus opt-out rights. Contact: privacy@stemworkforce.org

15.4 Utah (UCPA):
Utah residents may access, delete, and port their data, and opt out of sales and targeted advertising. Contact: privacy@stemworkforce.org

15.5 Other States:
We monitor and comply with emerging state privacy laws including those in:
• Oregon, Texas, Montana, Delaware, Iowa, Tennessee, Indiana
• New Jersey, New Hampshire, and other states

As new laws take effect, we update our practices accordingly.

15.6 Exercising Rights:
Residents of any U.S. state may contact us to exercise applicable privacy rights:
• Email: privacy@stemworkforce.org
• Online: stemworkforce.org/privacy-request`
  },
  {
    id: 'employer-data',
    title: '16. Employee and Applicant Data',
    icon: Users,
    content: `16.1 Job Applicant Data:
When you apply for jobs through our platform:
• Your application data is shared with the employer you applied to
• Employers become independent data controllers for the data they receive
• Each employer has their own privacy practices
• We encourage you to review employer privacy policies

16.2 Employer Responsibilities:
Employers using our platform must:
• Comply with applicable employment and privacy laws
• Protect applicant data appropriately
• Use data only for legitimate employment purposes
• Honor applicant privacy requests
• Comply with data retention requirements

16.3 Background Checks:
If you consent to a background check:
• We facilitate but do not conduct background checks
• Third-party background check providers have their own privacy policies
• FCRA protections apply to consumer reports
• You have rights to dispute inaccurate information

16.4 Employment Eligibility:
Work authorization data (I-9, E-Verify) is:
• Collected only when necessary
• Used only for employment eligibility verification
• Protected with enhanced security measures
• Retained only as required by law

16.5 HR Analytics:
For employer analytics features:
• Data is aggregated and anonymized where possible
• Individual data is not shared without consent
• Employers access only their own applicant data`
  },
  {
    id: 'changes',
    title: '17. Changes to This Policy',
    icon: Bell,
    content: `17.1 Policy Updates:
We may update this Privacy Policy to reflect changes in our practices, technologies, legal requirements, or other factors. We will notify you of material changes through:

• Email notification to your registered address
• Prominent notice on the Service
• Update to the "Last Modified" date on this page
• In-app notifications

17.2 Notice Period:
• Material Changes: At least 30 days' notice before the changes take effect
• Non-Material Changes: Effective upon posting

17.3 Acceptance:
Your continued use of the Service after changes take effect constitutes acceptance of the revised Policy. If you do not agree, you should stop using the Service.

17.4 Version History:
Previous versions of this Privacy Policy are available upon request.

17.5 Review Recommendation:
We encourage you to review this Privacy Policy periodically. The current version is always available at stemworkforce.org/privacy.`
  },
  {
    id: 'contact',
    title: '18. Contact Us',
    icon: Mail,
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices:

Privacy Officer / Data Protection Officer:
Email: privacy@stemworkforce.org

GDPR / EU Inquiries:
Email: gdpr@stemworkforce.org

CCPA / California Inquiries:
Email: ccpa@stemworkforce.org
Toll-Free: 1-800-XXX-XXXX

General Support:
Email: support@stemworkforce.org

Mailing Address:
STEMWorkforce, Inc.
Attn: Privacy Team
Washington, DC, USA

Response Times:
• General inquiries: 5 business days
• Privacy rights requests: 45 days (CCPA) / 30 days (GDPR)
• Urgent security matters: 24 hours

Regulatory Contacts:
• California residents: California Attorney General's Office
• EU residents: Your local Data Protection Authority
• UK residents: Information Commissioner's Office (ICO)`
  },
];

const DATA_RIGHTS_QUICK_ACTIONS = [
  { label: 'Download My Data', icon: Database, href: '/dashboard/settings/data' },
  { label: 'Delete My Account', icon: Trash2, href: '/dashboard/settings/account' },
  { label: 'Privacy Settings', icon: Lock, href: '/dashboard/settings/privacy' },
  { label: 'Cookie Preferences', icon: Eye, href: '#cookies' },
  { label: 'Do Not Sell', icon: XCircle, href: '/dashboard/settings/privacy#do-not-sell' },
  { label: 'Data Request', icon: FileText, href: '/privacy-request' },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = 'February 8, 2026';
  const effectiveDate = 'February 8, 2026';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <Shield size={16} />
            Your Privacy Matters
          </div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-slate-400 mt-4">
            Last updated: {lastUpdated} | Effective: {effectiveDate}
          </p>
        </div>
      </div>

      {/* Important Privacy Notice */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-emerald-400 mb-1">Privacy Commitment</h3>
              <p className="text-slate-300 text-sm">
                We do NOT sell your personal information. We are committed to transparency about our data practices and providing you control over your information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jurisdiction Quick Links */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-slate-400">Your rights:</span>
          <a href="#california" className="text-emerald-400 hover:text-emerald-300">California (CCPA/CPRA)</a>
          <span className="text-slate-600">•</span>
          <a href="#gdpr" className="text-emerald-400 hover:text-emerald-300">EU/UK (GDPR)</a>
          <span className="text-slate-600">•</span>
          <a href="#state-laws" className="text-emerald-400 hover:text-emerald-300">Other U.S. States</a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto px-6 py-8 border-b border-slate-800">
        <h2 className="text-sm font-medium text-slate-400 mb-4">Manage Your Privacy</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DATA_RIGHTS_QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              <action.icon size={16} className="text-emerald-400" />
              {action.label}
            </Link>
          ))}
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
            At STEMWorkforce, protecting your privacy is fundamental to our mission. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our platform. We comply with applicable privacy laws including CCPA/CPRA, GDPR, and state privacy regulations.
          </p>

          {/* Key Points Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-12">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-emerald-400" />
              Key Points
            </h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>We DO NOT sell your personal information</strong> to third parties for monetary consideration</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>We collect information you provide (profile, resume, applications) and usage data to operate and improve our services</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>We share your information with employers only when you apply for jobs or opt-in to be discoverable</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>You have rights to access, correct, delete, and port your data under applicable laws</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>We use industry-standard security measures including encryption and SOC 2 Type II certification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>California, EU, and other state residents have additional rights (see Sections 13-15)</span>
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
          {/* Contact Information */}
          <div className="bg-slate-900 rounded-xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Privacy Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-slate-400 mb-1">General Privacy</p>
                <a href="mailto:privacy@stemworkforce.org" className="text-emerald-400 hover:text-emerald-300">
                  privacy@stemworkforce.org
                </a>
              </div>
              <div>
                <p className="text-slate-400 mb-1">California (CCPA)</p>
                <a href="mailto:ccpa@stemworkforce.org" className="text-emerald-400 hover:text-emerald-300">
                  ccpa@stemworkforce.org
                </a>
              </div>
              <div>
                <p className="text-slate-400 mb-1">EU/UK (GDPR)</p>
                <a href="mailto:gdpr@stemworkforce.org" className="text-emerald-400 hover:text-emerald-300">
                  gdpr@stemworkforce.org
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-slate-400 text-sm">
              Submit a privacy request at{' '}
              <Link to="/privacy-request" className="text-emerald-400 hover:text-emerald-300">
                stemworkforce.org/privacy-request
              </Link>
            </p>
            <div className="flex gap-4">
              <Link
                to="/terms"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Terms of Service
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
