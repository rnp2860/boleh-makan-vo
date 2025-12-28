// src/app/test-scan/page.tsx
'use client';

import { useState } from 'react';
import { VitalityHUD } from '@/components/VitalityHUD'; // Import the new HUD

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

  // The Action: Send to our API
  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    try {
      // Make sure this points to the correct route you created earlier
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
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🧪 Dr. Reza Test Lab</h1>
        
        {/* 1. Upload Section */}
        <div className="mb-6 p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl shadow-sm hover:border-blue-400 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* 2. Preview & Action Section */}
        {image && (
          <div className="mb-8 text-center animate-fade-in">
            <div className="relative inline-block">
              <img 
                src={image} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded-lg shadow-md border border-gray-200" 
              />
              {/* Optional: Add a 'Analyzing' overlay if you want later */}
            </div>
            
            <div className="mt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Dr. Reza is thinking...' : '🔍 Analyze Now'}
              </button>
            </div>
          </div>
        )}

        {/* 3. Error Display */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg mb-6 text-center font-medium">
            Error: {error}
          </div>
        )}

        {/* 4. The Verdict Display (New HUD) */}
        {result && (
          <div className="mt-6 animate-slide-up">
             <VitalityHUD data={result.data} isVerified={result.is_verified} />
             
             {/* Debug info (Optional - hidden for users, visible for you) */}
             <div className="mt-8 pt-8 border-t border-gray-200">
               <details className="text-xs text-gray-400 cursor-pointer">
                 <summary>View Raw JSON (Debug)</summary>
                 <pre className="mt-2 bg-gray-100 p-4 rounded overflow-auto">
                   {JSON.stringify(result, null, 2)}
                 </pre>
               </details>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}