import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white dark:bg-black">
      
      {/* --- HERO SECTION --- */}
      <div className="w-full max-w-4xl px-6 py-12 md:py-20 text-center">
        
        {/* HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white mb-6">
          Clinical Food <span className="text-[#008080]">Analysis</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          AI-powered nutritional assessment for diabetic management
          <br />
          <span className="text-sm text-gray-400 mt-2 block">Precision. Empathy. Data-driven insights.</span>
        </p>

        {/* ACTION BUTTON */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/check-food"
            className="h-14 px-8 rounded-lg bg-[#008080] hover:bg-[#006666] text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
          >
            Analyze Food Image
          </a>
        </div>

        {/* View History Link */}
        <div className="mt-6">
          <a
            href="/history"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#008080] dark:hover:text-teal-400 font-medium transition-colors underline decoration-2 underline-offset-4"
          >
            View History
          </a>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="w-full bg-gray-50 dark:bg-gray-900 py-16 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Clinical Precision</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Evidence-based nutritional analysis powered by advanced AI vision models.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive macro analysis with glycemic index assessment for informed decisions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Actionable Advice</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Specific, practical recommendations tailored for diabetic management.
            </p>
          </div>

        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="w-full py-8 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Estimates based on visual data. Not a medical diagnosis.
          </p>
        </div>
      </div>

    </main>
  );
}