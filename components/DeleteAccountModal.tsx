// components/DeleteAccountModal.tsx
// 🗑️ PDPA Compliance: Account Deletion Modal

'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  userName?: string;
}

export default function DeleteAccountModal({ 
  isOpen, 
  onClose, 
  onConfirmDelete,
  userName 
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConfirmValid = confirmText.toUpperCase() === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmValid) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      await onConfirmDelete();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing during deletion
    setConfirmText('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header - Red Warning */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Delete Account</h2>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              disabled={isDeleting}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-5">
            <p className="text-red-800 text-sm font-medium leading-relaxed">
              {userName && <span className="font-bold">{userName}, </span>}
              This will <span className="font-bold">permanently delete</span> your account and ALL associated data including:
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                '🍽️ All meal logs and food photos',
                '🩸 All vital readings (glucose, BP, weight)',
                '🎯 Health goals and prescriptions',
                '👤 Profile information and preferences',
                '📊 Weekly reports and insights'
              ].map((item, i) => (
                <li key={i} className="text-red-700 text-sm flex items-center gap-2">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-red-800 text-sm font-bold mt-4 pt-3 border-t border-red-200">
              ⚠️ This action is IRREVERSIBLE and cannot be undone.
            </p>
          </div>

          {/* PDPA Notice */}
          <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-200">
            <p className="text-slate-600 text-xs">
              <span className="font-bold">🇲🇾 PDPA Compliance:</span> Under the Personal Data Protection Act 2010, 
              you have the right to request deletion of your personal data. This action fulfills that right.
            </p>
          </div>

          {/* Confirmation Input */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Type <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded font-mono">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isDeleting}
              placeholder="Type DELETE here"
              className={`w-full px-4 py-3 border-2 rounded-xl font-mono text-lg transition-colors disabled:opacity-50 ${
                confirmText.length > 0 
                  ? isConfirmValid 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-700'
              } outline-none focus:ring-4 focus:ring-red-100`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {confirmText.length > 0 && !isConfirmValid && (
              <p className="text-amber-600 text-xs mt-1.5">
                Type exactly "DELETE" (case insensitive) to enable the button
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-xl p-3 mb-5">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 py-3.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!isConfirmValid || isDeleting}
              className={`flex-1 py-3.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isConfirmValid && !isDeleting
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Forever</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

