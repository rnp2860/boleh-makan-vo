// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BM</span>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">Boleh Makan Intelligence</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
              Platform
            </a>
            <a href="#data" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
              Data
            </a>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors px-4 py-2"
            >
              Login
            </Link>
            <a 
              href="mailto:enterprise@bolehmakan.ai?subject=Enterprise Pilot Request" 
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-lg"
            >
              Request Enterprise Pilot
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              Trusted by Healthcare & F&B Leaders Across ASEAN
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
              The Cultural Food Intelligence Platform for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Southeast Asia
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              AI-powered nutrition data and health insights built specifically for the complex, diverse food landscape of Malaysia and beyond.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:enterprise@bolehmakan.ai?subject=Enterprise Pilot Request" 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-base px-8 py-4 rounded-full transition-all hover:shadow-xl hover:scale-105"
              >
                Request Enterprise Pilot
              </a>
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-base px-8 py-4 rounded-full transition-all hover:bg-slate-50"
              >
                Try Consumer App →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="platform" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Enterprise-Grade Food Intelligence
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Purpose-built for the unique challenges of Southeast Asian nutrition tracking and health management.
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Context Aware */}
            <div className="group bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-200/50 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Context Aware</h3>
              <p className="text-slate-600 leading-relaxed">
                Our AI understands that &quot;Nasi Lemak&quot; varies by region, vendor, and preparation. We capture the nuance that generic databases miss.
              </p>
            </div>
            
            {/* Card 2: Glucose Loop */}
            <div className="group bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-200/50 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Glucose Loop</h3>
              <p className="text-slate-600 leading-relaxed">
                Integrate with CGM devices for real-time glycemic response tracking. Perfect for diabetes management programs and metabolic health initiatives.
              </p>
            </div>
            
            {/* Card 3: Boleh Score */}
            <div className="group bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-200/50 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Boleh Score</h3>
              <p className="text-slate-600 leading-relaxed">
                Proprietary health scoring that factors in cultural dietary patterns, regional ingredients, and individual health conditions for personalized guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DATA SECTION */}
      <section id="data" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                Built on Real Southeast Asian Food Data
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Unlike generic nutrition databases, our platform is trained on millions of authentic meals from Malaysia, Singapore, Indonesia, Thailand, and the Philippines.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium">10,000+ Malaysian dishes mapped</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium">Regional variations accounted for</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium">Hawker stall to fine dining coverage</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-black text-slate-900">10K+</div>
                    <div className="text-sm text-slate-500 font-medium mt-1">Local Dishes</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-black text-slate-900">5</div>
                    <div className="text-sm text-slate-500 font-medium mt-1">Countries</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-black text-slate-900">95%</div>
                    <div className="text-sm text-slate-500 font-medium mt-1">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-black text-slate-900">24/7</div>
                    <div className="text-sm text-slate-500 font-medium mt-1">API Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">BM</span>
              </div>
              <span className="font-semibold text-slate-700">Boleh Makan Intelligence</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2026 Boleh Makan Intelligence. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
