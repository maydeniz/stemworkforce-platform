import { Link } from 'react-router-dom';
import { Cookie, Shield, Settings, Info, ExternalLink } from 'lucide-react';

const COOKIE_CATEGORIES = [
  {
    name: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.',
    required: true,
    cookies: [
      { name: 'session_id', purpose: 'Maintains your session state', duration: 'Session' },
      { name: 'csrf_token', purpose: 'Security token to prevent cross-site request forgery', duration: 'Session' },
      { name: 'auth_token', purpose: 'Authentication and authorization', duration: '30 days' },
      { name: 'cookie_consent', purpose: 'Stores your cookie preferences', duration: '1 year' },
    ],
  },
  {
    name: 'Performance Cookies',
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.',
    required: false,
    cookies: [
      { name: '_ga', purpose: 'Google Analytics - distinguishes users', duration: '2 years' },
      { name: '_gid', purpose: 'Google Analytics - distinguishes users', duration: '24 hours' },
      { name: '_gat', purpose: 'Google Analytics - throttles request rate', duration: '1 minute' },
      { name: 'performance_metrics', purpose: 'Page load performance tracking', duration: 'Session' },
    ],
  },
  {
    name: 'Functional Cookies',
    description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
    required: false,
    cookies: [
      { name: 'user_preferences', purpose: 'Stores your display preferences (theme, language)', duration: '1 year' },
      { name: 'recent_searches', purpose: 'Remembers your recent job searches', duration: '30 days' },
      { name: 'saved_jobs', purpose: 'Stores your saved job listings locally', duration: '90 days' },
      { name: 'chat_state', purpose: 'Maintains live chat session state', duration: 'Session' },
    ],
  },
  {
    name: 'Targeting Cookies',
    description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
    required: false,
    cookies: [
      { name: '_fbp', purpose: 'Facebook Pixel - tracks visits across websites', duration: '90 days' },
      { name: 'li_sugr', purpose: 'LinkedIn - advertising and analytics', duration: '90 days' },
      { name: 'IDE', purpose: 'Google DoubleClick - ad targeting', duration: '1 year' },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Cookie size={24} className="text-orange-400" />
            </div>
            <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-sm font-medium rounded-full">
              Legal
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-lg text-slate-400">
            Last updated: February 1, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
            <p>
              This Cookie Policy explains how STEM Workforce ("we," "us," or "our") uses cookies and similar technologies on our website and platform. By using our services, you consent to the use of cookies in accordance with this policy.
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Settings size={24} className="text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Manage Your Cookie Preferences</h3>
              <p className="text-sm text-slate-400 mb-4">
                You can change your cookie preferences at any time. Click the button below to update your settings.
              </p>
              <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
                Cookie Settings
              </button>
            </div>
          </div>
        </div>

        {/* Cookie Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
          <div className="space-y-6">
            {COOKIE_CATEGORIES.map((category) => (
              <div
                key={category.name}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                <div className="p-5 border-b border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    {category.required ? (
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded">
                        Always Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{category.description}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="text-left px-5 py-3 font-medium text-slate-400">Cookie Name</th>
                        <th className="text-left px-5 py-3 font-medium text-slate-400">Purpose</th>
                        <th className="text-left px-5 py-3 font-medium text-slate-400">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {category.cookies.map((cookie) => (
                        <tr key={cookie.name}>
                          <td className="px-5 py-3 font-mono text-xs text-orange-400">{cookie.name}</td>
                          <td className="px-5 py-3 text-slate-300">{cookie.purpose}</td>
                          <td className="px-5 py-3 text-slate-400">{cookie.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Control Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How to Control Cookies</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              Most web browsers allow you to control cookies through their settings. You can typically find these settings in the "Options" or "Preferences" menu of your browser. Here are links to instructions for common browsers:
            </p>
            <ul className="space-y-2">
              {[
                { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer' },
                { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' },
                { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
              ].map((browser) => (
                <li key={browser.name}>
                  <a
                    href={browser.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300"
                  >
                    {browser.name}
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400">
                  Please note that if you disable cookies, some features of our website may not function properly, and you may not be able to access certain areas or use all of our services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the platform and deliver advertisements on and through the platform.
            </p>
            <p>
              These third parties have their own privacy policies which govern how they use information they collect. We encourage you to read these policies:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Google Analytics - <a href="https://policies.google.com/privacy" className="text-orange-400 hover:underline">Privacy Policy</a></li>
              <li>Facebook Pixel - <a href="https://www.facebook.com/policy.php" className="text-orange-400 hover:underline">Privacy Policy</a></li>
              <li>LinkedIn Insight Tag - <a href="https://www.linkedin.com/legal/privacy-policy" className="text-orange-400 hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </section>

        {/* Updates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <p className="font-medium mb-2">STEM Workforce Privacy Team</p>
              <p className="text-sm text-slate-400">Email: privacy@stemworkforce.gov</p>
              <p className="text-sm text-slate-400">Address: 1200 Pennsylvania Avenue NW, Washington, DC 20460</p>
            </div>
          </div>
        </section>
      </div>

      {/* Related Links */}
      <div className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h3 className="text-lg font-semibold mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Shield size={16} />
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Shield size={16} />
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Shield size={16} />
              Accessibility Statement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
