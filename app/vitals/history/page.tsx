'use client';

// app/vitals/history/page.tsx
// 💓 Vitals History - View and filter past vitals entries

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Filter, Calendar, HeartPulse, Scale, Droplet, TestTube, Trash2, ChevronDown } from 'lucide-react';

// Hooks
import { useVitalsHistory, useDeleteVitals } from '@/hooks/useVitals';

// Types & Utils
import { VitalType, VitalsLogEntry } from '@/lib/vitals/types';
import { VITAL_TYPES } from '@/lib/vitals/constants';
import { formatRelativeTime } from '@/lib/vitals/calculations';
import { classifyBP, classifyGlucose, classifyHbA1c, classifyWeight } from '@/lib/vitals/status';

// Components
import { VitalStatusBadge } from '@/components/vitals/VitalStatusBadge';

// ============================================
// USER ID HELPER
// ============================================

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem('boleh_makan_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('boleh_makan_user_id', userId);
  }
  return userId;
}

// ============================================
// ICON MAP
// ============================================

const VITAL_ICONS = {
  bp: HeartPulse,
  weight: Scale,
  glucose: Droplet,
  labs: TestTube,
};

// ============================================
// HISTORY ITEM COMPONENT
// ============================================

interface HistoryItemProps {
  entry: VitalsLogEntry;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

function HistoryItem({ entry, onDelete, isDeleting }: HistoryItemProps) {
  const [showActions, setShowActions] = useState(false);
  
  // Determine the type and display values
  const getDisplayInfo = () => {
    if (entry.systolicBp && entry.diastolicBp) {
      const status = classifyBP(entry.systolicBp, entry.diastolicBp);
      return {
        type: 'bp' as VitalType,
        value: `${entry.systolicBp}/${entry.diastolicBp}`,
        unit: 'mmHg',
        subtext: entry.pulse ? `Pulse: ${entry.pulse} bpm` : undefined,
        status: status.status,
        statusLabel: status.label,
      };
    }
    
    if (entry.weightKg) {
      const status = classifyWeight(entry.weightKg);
      return {
        type: 'weight' as VitalType,
        value: entry.weightKg.toString(),
        unit: 'kg',
        subtext: entry.bodyFatPercent ? `Body fat: ${entry.bodyFatPercent}%` : undefined,
        status: status.status,
        statusLabel: status.label,
      };
    }
    
    if (entry.glucoseMmol) {
      const status = classifyGlucose(entry.glucoseMmol, entry.glucoseTiming || 'random');
      return {
        type: 'glucose' as VitalType,
        value: entry.glucoseMmol.toString(),
        unit: 'mmol/L',
        subtext: entry.glucoseTiming ? entry.glucoseTiming.replace('_', ' ') : undefined,
        status: status.status,
        statusLabel: status.label,
      };
    }
    
    if (entry.hba1cPercent || entry.ldlMmol || entry.egfr) {
      let mainValue = '';
      let status: any = { status: 'normal', label: 'Recorded' };
      
      if (entry.hba1cPercent) {
        mainValue = `HbA1c: ${entry.hba1cPercent}%`;
        status = classifyHbA1c(entry.hba1cPercent);
      } else if (entry.ldlMmol) {
        mainValue = `LDL: ${entry.ldlMmol} mmol/L`;
      } else if (entry.egfr) {
        mainValue = `eGFR: ${entry.egfr}`;
      }
      
      return {
        type: 'labs' as VitalType,
        value: mainValue,
        unit: '',
        subtext: entry.labProvider || undefined,
        status: status.status,
        statusLabel: status.label,
      };
    }
    
    return null;
  };
  
  const info = getDisplayInfo();
  if (!info) return null;
  
  const Icon = VITAL_ICONS[info.type];
  const typeInfo = VITAL_TYPES[info.type];
  
  return (
    <div 
      className="bg-white rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
      onClick={() => setShowActions(!showActions)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${typeInfo.color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: typeInfo.color }} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900">
                {info.value}
                {info.unit && <span className="text-sm font-normal text-slate-500 ml-1">{info.unit}</span>}
              </p>
              {info.subtext && (
                <p className="text-xs text-slate-500 capitalize">{info.subtext}</p>
              )}
            </div>
            <VitalStatusBadge status={info.status} size="sm" showDot={false} />
          </div>
          
          <p className="text-xs text-slate-400 mt-1">
            {formatRelativeTime(entry.recordedAt)}
          </p>
          
          {entry.notes && (
            <p className="text-xs text-slate-500 mt-2 bg-slate-50 rounded-lg px-2 py-1">
              {entry.notes}
            </p>
          )}
        </div>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(entry.id);
            }}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function VitalsHistoryPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as VitalType | null;
  
  const [userId, setUserId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [selectedType, setSelectedType] = useState<VitalType | 'all'>(initialType || 'all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize user ID on client
  useEffect(() => {
    setIsClient(true);
    setUserId(getUserId());
  }, []);
  
  // Fetch history
  const { entries, isLoading, error, refetch } = useVitalsHistory({
    userId,
    filter: {
      vitalType: selectedType === 'all' ? undefined : selectedType,
      limit: 50,
    },
  });
  
  // Delete mutation
  const deleteVitals = useDeleteVitals(userId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVitals.mutateAsync(id);
      refetch();
    } finally {
      setDeletingId(null);
    }
  };
  
  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: Record<string, VitalsLogEntry[]> = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.recordedAt).toLocaleDateString('en-MY', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });
    
    return groups;
  }, [entries]);
  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 animate-pulse">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="h-12 bg-slate-200 rounded-xl mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/vitals"
                className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">History</h1>
                <p className="text-xs text-slate-500">
                  {entries.length} entries
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                showFilters || selectedType !== 'all'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {selectedType !== 'all' && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 animate-in slide-in-from-top-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {(['bp', 'glucose', 'weight', 'labs'] as VitalType[]).map((type) => {
                const Icon = VITAL_ICONS[type];
                const typeInfo = VITAL_TYPES[type];
                
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {typeInfo.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>
      
      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-white rounded-xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}
        
        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{(error as Error)?.message || 'Failed to load history'}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && entries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">No entries yet</p>
            <p className="text-sm text-slate-500 mb-4">
              {selectedType !== 'all' 
                ? `No ${VITAL_TYPES[selectedType].label.toLowerCase()} entries found`
                : 'Start logging your vitals to see history'}
            </p>
            <Link
              href="/vitals"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Log Vitals
            </Link>
          </div>
        )}
        
        {/* Grouped Entries */}
        {!isLoading && !error && entries.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([date, dateEntries]) => (
              <div key={date}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
                  {date}
                </h3>
                <div className="space-y-3">
                  {dateEntries.map((entry) => (
                    <HistoryItem
                      key={entry.id}
                      entry={entry}
                      onDelete={handleDelete}
                      isDeleting={deletingId === entry.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


