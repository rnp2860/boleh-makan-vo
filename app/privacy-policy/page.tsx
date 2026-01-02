// app/privacy-policy/page.tsx
// 📜 Privacy Policy Page - PDPA Compliance

import Link from 'next/link';
import Logo from '@/components/Logo';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-slate-900 text-lg tracking-tight">Boleh Makan</span>
          </Link>
          
          <Link 
            href="/"
            className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
              <p className="text-slate-500 text-sm mt-1">Last updated: January 2, 2026</p>
            </div>
          </div>
          <p className="text-slate-600">
            <span className="font-semibold">Boleh Makan Sdn Bhd</span> ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our Boleh Makan application.
          </p>
        </div>

        {/* Policy Sections */}
        <article className="prose prose-slate max-w-none">
          
          {/* Section 1: Information We Collect */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
              Information We Collect
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Account Information</h3>
                <p className="text-slate-600 text-sm">Name, email address (if provided), and profile preferences you choose to share with us.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Health Data</h3>
                <p className="text-slate-600 text-sm">Meals logged, nutritional information, food photos, vital readings (glucose, blood pressure, weight), and health goals you track in the app.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Device Information</h3>
                <p className="text-slate-600 text-sm">Device type, operating system, and technical information necessary for app functionality.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Usage Data</h3>
                <p className="text-slate-600 text-sm">How you interact with the app, features used, and app performance data to improve our service.</p>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">2</span>
              How We Use Your Information
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 mt-0.5">✓</span>
                  <span className="text-slate-600 text-sm"><strong>Personalized Nutrition Tracking:</strong> Provide accurate calorie counting, macro tracking, and meal analysis tailored to Malaysian foods.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 mt-0.5">✓</span>
                  <span className="text-slate-600 text-sm"><strong>Health Insights:</strong> Generate personalized recommendations and correlate your meals with vital readings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 mt-0.5">✓</span>
                  <span className="text-slate-600 text-sm"><strong>AI Improvement:</strong> Use anonymized food corrections to improve our AI food recognition accuracy for Malaysian cuisine.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 mt-0.5">✓</span>
                  <span className="text-slate-600 text-sm"><strong>Service Updates:</strong> Send important notifications about app updates, security alerts, and service changes.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Data Storage & Security */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm font-bold">3</span>
              Data Storage & Security
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Secure Cloud Storage</h3>
                  <p className="text-slate-600 text-sm">Your data is stored securely on Supabase, a trusted cloud infrastructure provider with enterprise-grade security.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Encryption</h3>
                  <p className="text-slate-600 text-sm">All data is encrypted in transit (TLS/SSL) and at rest (AES-256) to protect against unauthorized access.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Limited Access</h3>
                  <p className="text-slate-600 text-sm">Access to personal data is strictly limited to authorized personnel who need it to provide our services.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Your Rights (PDPA Malaysia) */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-sm font-bold">4</span>
              Your Rights Under PDPA Malaysia
            </h2>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <p className="text-slate-700 text-sm mb-4">
                Under the <strong>Personal Data Protection Act 2010 (PDPA)</strong> of Malaysia, you have the following rights:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <span className="text-red-500">📋</span> Right to Access
                  </h3>
                  <p className="text-slate-600 text-xs">Request a copy of all personal data we hold about you.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <span className="text-red-500">✏️</span> Right to Correct
                  </h3>
                  <p className="text-slate-600 text-xs">Request correction of inaccurate or incomplete data.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <span className="text-red-500">🗑️</span> Right to Delete
                  </h3>
                  <p className="text-slate-600 text-xs">Request permanent deletion of your personal data.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <span className="text-red-500">🚫</span> Right to Withdraw
                  </h3>
                  <p className="text-slate-600 text-xs">Withdraw consent for data processing at any time.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-100 md:col-span-2">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <span className="text-red-500">📦</span> Right to Data Portability
                  </h3>
                  <p className="text-slate-600 text-xs">Export your data in a portable, machine-readable format (JSON).</p>
                </div>
              </div>
              <p className="text-slate-600 text-xs mt-4 pt-4 border-t border-red-100">
                To exercise any of these rights, visit the <strong>Profile</strong> section in the app or contact us at the email below.
              </p>
            </div>
          </section>

          {/* Section 5: Data Sharing */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-sm font-bold">5</span>
              Data Sharing
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <p className="text-slate-600 text-sm"><strong>We do NOT sell your personal data</strong> to third parties for marketing or advertising purposes.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-500 text-xl">⚠</span>
                <p className="text-slate-600 text-sm"><strong>Anonymized, aggregated data</strong> may be used for research purposes to improve Malaysian food nutrition databases.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">ℹ</span>
                <p className="text-slate-600 text-sm"><strong>Service Providers:</strong> Food images are processed by OpenAI for AI-powered food recognition. Images are not stored by OpenAI after processing.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Data Retention */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-sm font-bold">6</span>
              Data Retention
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span className="text-slate-600 text-sm">Your data is retained for as long as your account is active.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span className="text-slate-600 text-sm">Upon account deletion request, all personal data is permanently deleted within <strong>30 days</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span className="text-slate-600 text-sm">Anonymized, aggregated data (not personally identifiable) may be retained for analytics.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Contact Us */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">7</span>
              Contact Us
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
              <p className="text-slate-700 text-sm mb-4">
                If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
              </p>
              <div className="bg-white rounded-xl p-4 border border-green-100">
                <p className="font-semibold text-slate-800">Boleh Makan Sdn Bhd</p>
                <p className="text-slate-600 text-sm mt-1">Data Protection Officer</p>
                <a href="mailto:privacy@bolehmakan.my" className="text-teal-600 font-medium text-sm hover:underline mt-2 inline-block">
                  📧 privacy@bolehmakan.my
                </a>
              </div>
            </div>
          </section>

          {/* Section 8: Changes to This Policy */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 text-sm font-bold">8</span>
              Changes to This Policy
            </h2>
            <div className="bg-slate-50 rounded-2xl p-6">
              <p className="text-slate-600 text-sm">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                When we make significant changes, we will notify you through the app or via email. 
                We encourage you to review this policy periodically.
              </p>
              <p className="text-slate-500 text-xs mt-4 pt-4 border-t border-slate-200">
                The "Last updated" date at the top of this policy indicates when it was most recently revised.
              </p>
            </div>
          </section>

        </article>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100 text-center">
            <p className="text-slate-700 font-medium mb-4">
              Ready to take control of your health journey?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href="/dashboard"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors"
              >
                Open App
              </Link>
              <Link 
                href="/"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-100 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-semibold text-slate-700 text-sm">Boleh Makan Intelligence</span>
            </div>
            <p className="text-slate-500 text-xs">
              © 2026 Boleh Makan Sdn Bhd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

