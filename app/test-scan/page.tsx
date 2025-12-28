// src/app/test-scan/page.tsx
'use client';

import { useState } from 'react';

export default function TestScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper: Convert file to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  // The Action: Send to our new API
  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Scan failed');
      setResult(data);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🧪 Dr. Reza Test Lab</h1>
      
      {/* 1. Upload Section */}
      <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500"
        />
      </div>

      {/* 2. Preview Section */}
      {image && (
        <div className="mb-6 text-center">
          <img src={image} alt="Preview" className="max-h-64 mx-auto rounded shadow" />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Dr. Reza is thinking...' : '🔍 Analyze Now'}
          </button>
        </div>
      )}

      {/* 3. Error Display */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Error: {error}
        </div>
      )}

      {/* 4. The Verdict Display */}
      {result && (
        <div className="space-y-4">
          {/* A. Verified Badge Check */}
          <div className={`p-4 rounded-lg border ${result.is_verified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <h2 className="font-bold flex items-center gap-2">
              {result.is_verified ? '✅ VERIFIED ANCHOR' : '⚠️ AI ESTIMATE'}
            </h2>
            <p className="text-sm opacity-75">Source: {result.source}</p>
          </div>

          {/* B. The Data */}
          <div className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>

          {/* C. Renal Guard Check */}
          {result.data.risk_analysis.is_high_sodium && (
             <div className="p-3 bg-red-600 text-white font-bold text-center rounded animate-pulse">
               🚨 HIGH SODIUM ALERT! 
             </div>
          )}
        </div>
      )}
    </div>
  );
}