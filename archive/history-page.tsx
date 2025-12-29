'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// 1. Define the NEW Data Structure (Dr. Reza Style)
interface Macro {
  value: string;
  status: 'Good' | 'Moderate' | 'High';
}

interface ScanRecord {
  id: string;
  created_at: string;
  image_url: string | null;
  health_score: number;
  // JSONB columns come back as objects/arrays
  ingredients: string[] | null;
  macros: {
    calories: Macro;
    carbs: Macro;
    protein: Macro;
    fat: Macro;
  } | null;
  analysis_content: string[] | null;
  actionable_advice: string[] | null;
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      setLoading(true);
      // Select all columns. Supabase automatically parses JSONB into JS objects.
      const { data, error: fetchError } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      setScans(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError('Failed to load consultation history.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get Color based on Status (High/Moderate/Good)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
      case 'Low': // Handle legacy
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Moderate':
      case 'Medium': // Handle legacy
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High':
      case 'Bad':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Consultation <span className="text-teal-600">History</span>
          </h1>
          <p className="text-slate-500">
            Your previous scans and metabolic insights.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Retrieving medical records...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center mb-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scans.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-5xl mb-4 opacity-50">📋</div>
            <h3 className="text-lg font-semibold text-slate-900">No records found</h3>
            <p className="text-slate-500 mb-6">You haven't scanned any food yet.</p>
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              Start New Consult
            </a>
          </div>
        )}

        {/* List of Scans */}
        <div className="space-y-6">
          {scans.map((scan) => (
            <div 
              key={scan.id} 
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200"
            >
              {/* Top Row: Date & Score */}
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  {/* Small Thumbnail if available */}
                  {scan.image_url && (
                    <img 
                      src={scan.image_url} 
                      alt="Scan" 
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                      Processed
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDate(scan.created_at)}
                    </p>
                  </div>
                </div>
                
                {/* Health Score Badge */}
                <div className="flex flex-col items-end">
                  <div className={`text-2xl font-bold ${
                    scan.health_score > 70 ? 'text-green-600' : 
                    scan.health_score > 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {scan.health_score}
                    <span className="text-sm text-slate-400 font-normal">/100</span>
                  </div>
                  <span className="text-xs text-slate-400">Health Score</span>
                </div>
              </div>

              {/* Middle Row: Ingredients Tags */}
              {scan.ingredients && scan.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {scan.ingredients.map((ing, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              )}

              {/* Middle Row: The "Vitals" Grid */}
              {scan.macros && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {Object.entries(scan.macros).map(([key, data]) => (
                    <div key={key} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">
                        {key}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-700">
                          {data.value}
                        </span>
                        {/* Only show badge if not 'Good'/'Moderate' to keep it clean, or show dot? Let's show mini text */}
                        {data.status === 'High' && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                            HIGH
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Row: Dr. Reza's Insight (First Point Only) */}
              {scan.analysis_content && scan.analysis_content.length > 0 && (
                <div className="flex items-start gap-3 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                  <span className="text-lg">🩺</span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold text-teal-800">Dr. Reza: </span>
                    {scan.analysis_content[0]}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-slate-500 hover:text-teal-600 text-sm font-medium transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>

      </div>
    </main>
  );
}