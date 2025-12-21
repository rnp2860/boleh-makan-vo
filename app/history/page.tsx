'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ScanRecord {
  id: string;
  health_score: number;
  sugar_level: 'Low' | 'Medium' | 'High';
  risk_assessment: string;
  feedback: string;
  created_at: string;
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
      const { data, error: fetchError } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) {
        throw fetchError;
      }

      setScans(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const getSugarLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'High':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-900 py-12 px-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Scan <span className="text-green-600">History</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Your recent food analysis results from Abang Jaga
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-slate-600 dark:text-slate-400">Loading your history...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-8 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-700 dark:text-red-400">
            <p className="font-semibold">⚠️ Error: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scans.length === 0 && (
          <div className="text-center py-12 p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              No scans yet
            </p>
            <p className="text-slate-500 dark:text-slate-500 mt-2">
              Start analyzing food to see your history here!
            </p>
            <a
              href="/check-food"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold transition-all"
            >
              Check My Food 📸
            </a>
          </div>
        )}

        {/* Scans List */}
        {!loading && !error && scans.length > 0 && (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {/* Health Score */}
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-extrabold ${getHealthScoreColor(scan.health_score)}`}>
                        {scan.health_score}
                      </span>
                      <span className="text-lg text-slate-500 dark:text-slate-400">/ 100</span>
                    </div>

                    {/* Sugar Level Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getSugarLevelColor(scan.sugar_level)}`}
                    >
                      {scan.sugar_level} Sugar
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(scan.created_at)}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {scan.risk_assessment}
                  </p>
                </div>

                {/* Feedback */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700">
                  <div className="flex items-start gap-3">
                    <div className="text-xl">👨‍⚕️</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Abang Jaga Says:
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                        "{scan.feedback}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

