import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-900">
      
      {/* --- HERO SECTION --- */}
      <div className="w-full max-w-4xl px-6 py-12 md:py-20 text-center">
        
        {/* WARNING BANNER */}
        <div className="mb-8 inline-block rounded-full bg-red-100 border border-red-500 px-4 py-1.5 shadow-sm">
          <p className="text-sm font-bold text-red-700 animate-pulse">
            ⚠️ WARNING: POTONG KAKI RISK DETECTED
          </p>
        </div>

        {/* HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          BOLEH <span className="text-green-600">MAKAN</span>?
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          "Your Guardian for Malaysian Makan. Strict but loving, because I don't want you to lose a foot, okay?"
          <br />
          <span className="text-sm text-slate-400 italic mt-2 block">- Abang Jaga</span>
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/check-food"
            className="h-14 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center"
          >
            Check My Food 📸
          </a>
          
          <button className="h-14 px-8 rounded-full bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 hover:border-green-500 text-slate-700 dark:text-white font-semibold text-lg transition-all">
            Log Sugar 🩸
          </button>
        </div>

        {/* View History Link */}
        <div className="mt-6">
          <a
            href="/history"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors underline decoration-2 underline-offset-4"
          >
            View History 📋
          </a>
        </div>
      </div>

      {/* --- REALITY CHECK SECTION --- */}
      <div className="w-full bg-white dark:bg-black py-16 px-6 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
            <div className="text-4xl mb-4">🩺</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">The Reality Check</h3>
            <p className="text-slate-500 dark:text-slate-400">
              I will tell you if that Nasi Lemak is worth the insulin spike. No sugar coating.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
            <div className="text-4xl mb-4">🥗</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Local Context</h3>
            <p className="text-slate-500 dark:text-slate-400">
              I know what "Kurang Manis" actually means at a Mamak (still too sweet).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tough Love</h3>
            <p className="text-slate-500 dark:text-slate-400">
              I scold you because I care. Keep your legs, please.
            </p>
          </div>

        </div>
      </div>

    </main>
  );
}