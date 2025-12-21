'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AnalysisResult {
  healthScore: number;
  sugarLevel: 'Low' | 'Medium' | 'High';
  riskAssessment: string;
  feedback: string;
}

export default function CheckFoodPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze food');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSugarLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'High':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskColor = (risk: string) => {
    if (risk.includes('High') || risk.includes('Very High')) {
      return 'text-red-600 dark:text-red-400';
    }
    if (risk.includes('Medium')) {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-900 py-12 px-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Check My <span className="text-green-600">Food</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Upload a photo and let Abang Jaga analyze it for you
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
          <div className="flex flex-col items-center">
            {/* Image Display - Always show if image exists */}
            {selectedImage ? (
              <div className="w-full max-w-2xl mb-6">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-zinc-700">
                  <Image
                    src={selectedImage}
                    alt="Selected food"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              /* Upload Placeholder - Only show when no image */
              <label className="cursor-pointer w-full max-w-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="w-full h-64 border-2 border-dashed border-slate-300 dark:border-zinc-600 rounded-xl flex items-center justify-center hover:border-green-500 dark:hover:border-green-500 transition-colors">
                  <div className="text-center p-6">
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Click to upload food image
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                      PNG, JPG, or WEBP
                    </p>
                  </div>
                </div>
              </label>
            )}

            {/* Analyze Button - Show if image exists and no results, or change to "Analyze Another" if results exist */}
            {selectedImage && !result && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="h-12 px-8 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:transform-none"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Food 🔍'}
              </button>
            )}

            {/* Change Image Button - Show when results exist */}
            {result && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  className="h-12 px-8 rounded-full bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 text-slate-700 dark:text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Analyze Another Image 📸
                </button>
              </label>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-700 dark:text-red-400">
            <p className="font-semibold">⚠️ Error: {error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Health Score */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Health Score
              </h3>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-extrabold ${getHealthScoreColor(result.healthScore)}`}>
                  {result.healthScore}
                </span>
                <span className="text-2xl text-slate-500 dark:text-slate-400">/ 100</span>
              </div>
              <div className="mt-4 w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    result.healthScore >= 70
                      ? 'bg-green-500'
                      : result.healthScore >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${result.healthScore}%` }}
                />
              </div>
            </div>

            {/* Sugar Level */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Sugar Level
              </h3>
              <p className={`text-3xl font-bold ${getSugarLevelColor(result.sugarLevel)}`}>
                {result.sugarLevel}
              </p>
            </div>

            {/* Risk Assessment */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Risk Assessment
              </h3>
              <p className={`text-xl font-semibold ${getRiskColor(result.riskAssessment)}`}>
                {result.riskAssessment}
              </p>
            </div>

            {/* Feedback from Abang Jaga */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="text-3xl">👨‍⚕️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Abang Jaga Says:
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{result.feedback}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-full bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 hover:border-green-500 text-slate-700 dark:text-white font-semibold transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}

