'use client';

// components/tenant/InviteCodeInput.tsx
// 🎫 Invite Code Input - Component for entering tenant invite codes during signup

import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, Loader2, Building2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface InviteCodeInputProps {
  /** Called when a valid code is entered */
  onValidCode: (tenantInfo: ValidatedTenantInfo) => void;
  /** Called when code is cleared/invalid */
  onClear?: () => void;
  /** Optional initial code value */
  initialCode?: string;
  /** Whether to auto-validate on mount if initialCode provided */
  autoValidate?: boolean;
  /** Custom placeholder text */
  placeholder?: string;
  /** Custom label text */
  label?: string;
  /** Custom help text */
  helpText?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Custom className for the container */
  className?: string;
}

interface ValidatedTenantInfo {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  tenantLogo: string | null;
  code: string;
}

interface ValidationState {
  status: 'idle' | 'validating' | 'valid' | 'invalid';
  message?: string;
  tenantInfo?: ValidatedTenantInfo;
}

// ============================================
// COMPONENT
// ============================================

export function InviteCodeInput({
  onValidCode,
  onClear,
  initialCode = '',
  autoValidate = true,
  placeholder = 'Enter invite code (e.g., IJMSTAFF)',
  label = 'Company/Organization Code',
  helpText = 'If your organization provided an invite code, enter it here',
  disabled = false,
  className = '',
}: InviteCodeInputProps) {
  const [code, setCode] = useState(initialCode);
  const [validation, setValidation] = useState<ValidationState>({ status: 'idle' });
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Validate code with API
  const validateCode = useCallback(async (inputCode: string) => {
    if (!inputCode || inputCode.length < 3) {
      setValidation({ status: 'idle' });
      return;
    }

    setValidation({ status: 'validating' });

    try {
      const response = await fetch('/api/tenant/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode.toUpperCase() }),
      });

      const data = await response.json();

      if (data.success && data.tenant) {
        const tenantInfo: ValidatedTenantInfo = {
          tenantId: data.tenant.id,
          tenantSlug: data.tenant.slug,
          tenantName: data.tenant.name,
          tenantLogo: data.tenant.logo_url,
          code: inputCode.toUpperCase(),
        };

        setValidation({
          status: 'valid',
          message: `You'll be joining ${data.tenant.name}`,
          tenantInfo,
        });

        onValidCode(tenantInfo);
      } else {
        setValidation({
          status: 'invalid',
          message: data.error || 'Invalid or expired invite code',
        });
        onClear?.();
      }
    } catch (error) {
      setValidation({
        status: 'invalid',
        message: 'Failed to validate code. Please try again.',
      });
      onClear?.();
    }
  }, [onValidCode, onClear]);

  // Handle input change with debounce
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(value);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Reset validation if code is cleared
    if (!value) {
      setValidation({ status: 'idle' });
      onClear?.();
      return;
    }

    // Debounce validation
    const timer = setTimeout(() => {
      validateCode(value);
    }, 500);

    setDebounceTimer(timer);
  }, [debounceTimer, validateCode, onClear]);

  // Handle clear button
  const handleClear = useCallback(() => {
    setCode('');
    setValidation({ status: 'idle' });
    onClear?.();
  }, [onClear]);

  // Auto-validate on mount if initialCode provided
  React.useEffect(() => {
    if (autoValidate && initialCode) {
      validateCode(initialCode);
    }
  }, [autoValidate, initialCode, validateCode]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          <span className="text-gray-400 font-normal ml-1">(Optional)</span>
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Building2 className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={code}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={20}
          className={`
            block w-full pl-10 pr-10 py-2.5
            border rounded-lg
            text-sm font-mono uppercase
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${validation.status === 'valid'
              ? 'border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20'
              : validation.status === 'invalid'
              ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-800'
            }
            text-gray-900 dark:text-white
            placeholder:text-gray-400
          `}
        />
        
        {/* Status indicator */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {validation.status === 'validating' && (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          )}
          {validation.status === 'valid' && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validation.status === 'invalid' && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <XCircle className="h-5 w-5 text-red-500" />
            </button>
          )}
        </div>
      </div>
      
      {/* Validation message */}
      {validation.message && (
        <p className={`text-sm ${
          validation.status === 'valid' 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {validation.message}
        </p>
      )}
      
      {/* Tenant preview card */}
      {validation.status === 'valid' && validation.tenantInfo && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {validation.tenantInfo.tenantLogo ? (
              <img
                src={validation.tenantInfo.tenantLogo}
                alt={validation.tenantInfo.tenantName}
                className="h-10 w-10 rounded object-contain bg-white p-1"
              />
            ) : (
              <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-500" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {validation.tenantInfo.tenantName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your account will be linked to this organization
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Help text */}
      {helpText && validation.status === 'idle' && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}

// ============================================
// COMPACT VERSION
// ============================================

interface CompactInviteCodeInputProps {
  onValidCode: (tenantInfo: ValidatedTenantInfo) => void;
  onClear?: () => void;
  disabled?: boolean;
  className?: string;
}

export function CompactInviteCodeInput({
  onValidCode,
  onClear,
  disabled = false,
  className = '',
}: CompactInviteCodeInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className={`
          text-sm text-blue-600 dark:text-blue-400 
          hover:text-blue-700 dark:hover:text-blue-300
          font-medium flex items-center space-x-1
          ${className}
        `}
      >
        <Building2 className="h-4 w-4" />
        <span>Have an organization code?</span>
      </button>
    );
  }

  return (
    <InviteCodeInput
      onValidCode={onValidCode}
      onClear={() => {
        onClear?.();
        setIsExpanded(false);
      }}
      className={className}
      label=""
      helpText=""
      disabled={disabled}
    />
  );
}

export type { ValidatedTenantInfo };


