import { Link } from 'react-router-dom';
import {
  Accessibility,
  CheckCircle,
  Eye,
  Ear,
  Hand,
  Brain,
  Monitor,
  Smartphone,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';

const ACCESSIBILITY_FEATURES = [
  {
    icon: Eye,
    title: 'Visual Accessibility',
    features: [
      'High contrast color schemes available',
      'Scalable text up to 200% without loss of content',
      'All images include alternative text descriptions',
      'Color is not used as the sole means of conveying information',
      'Focus indicators visible on all interactive elements',
    ],
  },
  {
    icon: Ear,
    title: 'Auditory Accessibility',
    features: [
      'No audio content plays automatically',
      'Video content includes closed captions',
      'Transcripts available for audio content',
      'Visual alternatives for audio alerts',
    ],
  },
  {
    icon: Hand,
    title: 'Motor Accessibility',
    features: [
      'All functionality accessible via keyboard',
      'No time limits on user interactions',
      'Skip navigation links available',
      'Large click/tap targets (minimum 44x44 pixels)',
      'Form inputs include clear labels and error messages',
    ],
  },
  {
    icon: Brain,
    title: 'Cognitive Accessibility',
    features: [
      'Consistent navigation throughout the site',
      'Clear, simple language used where possible',
      'Important information highlighted visually',
      'Error messages provide clear guidance',
      'Multi-step processes include progress indicators',
    ],
  },
];

const ASSISTIVE_TECHNOLOGIES = [
  { name: 'Screen Readers', examples: 'JAWS, NVDA, VoiceOver, TalkBack' },
  { name: 'Screen Magnification', examples: 'ZoomText, Windows Magnifier, macOS Zoom' },
  { name: 'Voice Recognition', examples: 'Dragon NaturallySpeaking, Voice Control' },
  { name: 'Alternative Input Devices', examples: 'Switch devices, eye-tracking systems' },
  { name: 'Browser Extensions', examples: 'High contrast themes, reading tools' },
];

const WCAG_PRINCIPLES = [
  {
    letter: 'P',
    principle: 'Perceivable',
    description: 'Information and user interface components must be presentable to users in ways they can perceive.',
  },
  {
    letter: 'O',
    principle: 'Operable',
    description: 'User interface components and navigation must be operable by all users.',
  },
  {
    letter: 'U',
    principle: 'Understandable',
    description: 'Information and the operation of user interface must be understandable.',
  },
  {
    letter: 'R',
    principle: 'Robust',
    description: 'Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.',
  },
];

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Accessibility size={24} className="text-blue-400" />
            </div>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full">
              Accessibility
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
          <p className="text-lg text-slate-400">
            Last updated: February 1, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Commitment */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              STEM Workforce is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
            <p>
              We strive to conform to Level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
            </p>
          </div>
        </section>

        {/* WCAG Principles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">WCAG 2.1 Guidelines (POUR)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WCAG_PRINCIPLES.map((item) => (
              <div
                key={item.principle}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-lg">
                    {item.letter}
                  </div>
                  <h3 className="font-semibold">{item.principle}</h3>
                </div>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Accessibility Features</h2>
          <div className="space-y-6">
            {ACCESSIBILITY_FEATURES.map((category) => (
              <div
                key={category.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <category.icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard Navigation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Keyboard Navigation</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              Our website is fully navigable using a keyboard. Here are the main keyboard shortcuts:
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-slate-400">Key</th>
                    <th className="text-left px-5 py-3 font-medium text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="px-5 py-3"><kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Tab</kbd></td>
                    <td className="px-5 py-3 text-slate-300">Move to next interactive element</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3"><kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Shift + Tab</kbd></td>
                    <td className="px-5 py-3 text-slate-300">Move to previous interactive element</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3"><kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Enter / Space</kbd></td>
                    <td className="px-5 py-3 text-slate-300">Activate buttons and links</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3"><kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Escape</kbd></td>
                    <td className="px-5 py-3 text-slate-300">Close modals and menus</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3"><kbd className="px-2 py-1 bg-slate-800 rounded text-xs">Arrow Keys</kbd></td>
                    <td className="px-5 py-3 text-slate-300">Navigate within menus and lists</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Assistive Technologies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Supported Assistive Technologies</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              Our website is designed to work with the following assistive technologies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ASSISTIVE_TECHNOLOGIES.map((tech) => (
                <div
                  key={tech.name}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-4"
                >
                  <h4 className="font-medium mb-1">{tech.name}</h4>
                  <p className="text-sm text-slate-400">{tech.examples}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browser & Device Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Browser & Device Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Monitor size={20} className="text-blue-400" />
                <h3 className="font-semibold">Desktop Browsers</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  Chrome (latest 2 versions)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  Firefox (latest 2 versions)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  Safari (latest 2 versions)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  Microsoft Edge (latest 2 versions)
                </li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone size={20} className="text-blue-400" />
                <h3 className="font-semibold">Mobile Devices</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  iOS Safari (latest 2 versions)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  Android Chrome (latest 2 versions)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  VoiceOver on iOS
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  TalkBack on Android
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Known Limitations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Known Limitations</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              While we strive for full accessibility, some content may have limitations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Some third-party content or applications may not meet all accessibility requirements</li>
              <li>Older PDF documents may not be fully accessible; we are working to remediate these</li>
              <li>Some interactive map features may have limited accessibility; text alternatives are provided</li>
              <li>Live chat functionality may have limited screen reader support</li>
            </ul>
            <p>
              We are actively working to address these limitations. If you encounter any accessibility barriers, please contact us.
            </p>
          </div>
        </section>

        {/* Feedback */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility Feedback</h2>
          <div className="text-slate-300 space-y-4">
            <p>
              We welcome your feedback on the accessibility of the STEM Workforce platform. If you encounter accessibility barriers or have suggestions for improvement, please let us know:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                <Mail size={24} className="mx-auto text-blue-400 mb-3" />
                <h4 className="font-medium mb-1">Email</h4>
                <p className="text-sm text-slate-400">accessibility@stemworkforce.gov</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                <Phone size={24} className="mx-auto text-blue-400 mb-3" />
                <h4 className="font-medium mb-1">Phone</h4>
                <p className="text-sm text-slate-400">1-800-STEM-ADA</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                <MessageCircle size={24} className="mx-auto text-blue-400 mb-3" />
                <h4 className="font-medium mb-1">TTY</h4>
                <p className="text-sm text-slate-400">1-800-STEM-TTY</p>
              </div>
            </div>
            <p>
              When contacting us about accessibility, please include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>The web address (URL) of the content</li>
              <li>The problem you encountered</li>
              <li>The assistive technology you were using (if applicable)</li>
            </ul>
          </div>
        </section>

        {/* Compliance Status */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Compliance Status</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">WCAG 2.1 Level AA Conformance</h3>
                <p className="text-sm text-slate-400 mb-4">
                  The STEM Workforce platform partially conforms to WCAG 2.1 Level AA. "Partially conforms" means that some parts of the content do not fully conform to the accessibility standard. We conduct regular audits and are working to achieve full conformance.
                </p>
                <div className="text-sm text-slate-400">
                  <strong>Last accessibility audit:</strong> January 15, 2026
                </div>
                <div className="text-sm text-slate-400">
                  <strong>Assessment approach:</strong> External audit by certified accessibility specialists
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
          <div className="space-y-3">
            {[
              { label: 'Web Accessibility Initiative (WAI)', url: 'https://www.w3.org/WAI/' },
              { label: 'WCAG 2.1 Guidelines', url: 'https://www.w3.org/TR/WCAG21/' },
              { label: 'Section 508 (U.S. Federal)', url: 'https://www.section508.gov/' },
              { label: 'ADA.gov', url: 'https://www.ada.gov/' },
            ].map((resource) => (
              <a
                key={resource.label}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                {resource.label}
                <ExternalLink size={14} />
              </a>
            ))}
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
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
