'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AnalysisResult {
  ingredients: string[];
  macros: {
    carbs: { value: string; status: string };
    protein: { value: string; status: string };
    fat: { value: string; status: string };
    calories: { value: string; status: string };
  };
  glycemic_index: 'Low' | 'Medium' | 'High';
  health_score: number;
  analysis_points: string[];
  actionable_advice: string[];
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

  const handleAnalyzeNew = () => {
    setResult(null);
    setSelectedImage(null);
    setImageFile(null);
    setError(null);
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

  const getGlycemicIndexColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-teal-600 dark:text-teal-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'High':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-teal-600 dark:text-teal-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusColor = (status: string, macroType: string) => {
    // For carbs and calories, "High" is bad; for protein, "Good" is good
    if (status === 'High' && (macroType === 'carbs' || macroType === 'calories')) {
      return 'text-red-600 dark:text-red-400';
    }
    if (status === 'Bad') {
      return 'text-red-600 dark:text-red-400';
    }
    if (status === 'Moderate') {
      return 'text-amber-600 dark:text-amber-400';
    }
    if (status === 'Good' || status === 'Low') {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white dark:bg-black py-12 px-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
            Boleh Makan <span className="text-[#008080]">Intelligence</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered nutritional assessment for diabetic management
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="mb-8 p-6 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center">
            {/* Image Display - Always show if image exists */}
            {selectedImage ? (
              <div className="w-full max-w-2xl mb-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
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
                <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center hover:border-[#008080] dark:hover:border-[#008080] transition-colors">
                  <div className="text-center p-6">
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Click to upload food image
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      PNG, JPG, or WEBP
                    </p>
                  </div>
                </div>
              </label>
            )}

            {/* Analyze Button - Show if image exists and no results */}
            {selectedImage && !result && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="h-12 px-8 rounded-lg bg-[#008080] hover:bg-[#006666] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
              </button>
            )}

            {/* Analyze New Image Button - Show when results exist */}
            {result && (
              <button
                onClick={handleAnalyzeNew}
                className="h-12 px-8 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
              >
                Analyze New Image
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
            <p className="font-semibold">⚠️ Error: {error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Health Score */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Health Score
              </h3>
              <div className="flex items-baseline gap-3 mb-4">
                <span className={`text-5xl font-bold ${getHealthScoreColor(result.health_score)}`}>
                  {result.health_score}
                </span>
                <span className="text-2xl text-gray-500 dark:text-gray-400">/ 100</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    result.health_score >= 70
                      ? 'bg-[#008080]'
                      : result.health_score >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${result.health_score}%` }}
                />
              </div>
            </div>

            {/* Detected Inventory - Ingredients as Pill Tags */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Detected Inventory
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-normal"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* The "So What?" Grid - Macros with Status Badges */}
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Nutritional Analysis
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Carbs</div>
                  <div className="text-lg font-semibold text-black dark:text-white mb-1">
                    {result.macros.carbs.value}
                  </div>
                  <div className={`text-xs font-medium ${getStatusColor(result.macros.carbs.status, 'carbs')}`}>
                    {result.macros.carbs.status}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Protein</div>
                  <div className="text-lg font-semibold text-black dark:text-white mb-1">
                    {result.macros.protein.value}
                  </div>
                  <div className={`text-xs font-medium ${getStatusColor(result.macros.protein.status, 'protein')}`}>
                    {result.macros.protein.status}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Fat</div>
                  <div className="text-lg font-semibold text-black dark:text-white mb-1">
                    {result.macros.fat.value}
                  </div>
                  <div className={`text-xs font-medium ${getStatusColor(result.macros.fat.status, 'fat')}`}>
                    {result.macros.fat.status}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Calories</div>
                  <div className="text-lg font-semibold text-black dark:text-white mb-1">
                    {result.macros.calories.value}
                  </div>
                  <div className={`text-xs font-medium ${getStatusColor(result.macros.calories.status, 'calories')}`}>
                    {result.macros.calories.status}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Glycemic Index:</span>
                  <span className={`text-sm font-semibold ${getGlycemicIndexColor(result.glycemic_index)}`}>
                    {result.glycemic_index}
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis Points - Bullet List with Stethoscope Icon */}
            <div className="p-6 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Clinical Analysis
              </h3>
              <ul className="space-y-2">
                {result.analysis_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#008080] dark:text-teal-400 mt-0.5">🩺</span>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Advice - Bullet List with Lightning Icon */}
            <div className="p-6 rounded-lg bg-[#008080]/5 dark:bg-[#008080]/10 border border-[#008080]/20 dark:border-[#008080]/30">
              <h3 className="text-lg font-semibold text-[#008080] dark:text-teal-400 mb-4">
                Actionable Advice
              </h3>
              <ul className="space-y-2">
                {result.actionable_advice.map((advice, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#008080] dark:text-teal-400 mt-0.5">⚡</span>
                    <span className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                      {advice}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Disclaimer Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Estimates based on visual data. Not a medical diagnosis.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#008080] text-gray-700 dark:text-gray-300 font-medium transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}

