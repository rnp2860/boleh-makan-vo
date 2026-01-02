'use client';

// components/cgm/DeviceSelector.tsx
// 📊 Device Selector - Visual CGM device selection component

import React from 'react';
import { Check, CircleDot, ShoppingBag, HelpCircle } from 'lucide-react';
import { CGMDeviceType, CGMDeviceInfo } from '@/lib/cgm/types';
import { CGM_DEVICES, CGM_DEVICE_CATEGORIES, POPULAR_DEVICES_MY } from '@/lib/cgm/devices';

// ============================================
// TYPES
// ============================================

interface DeviceSelectorProps {
  selectedDevice: CGMDeviceType | null;
  onSelect: (device: CGMDeviceType) => void;
  showOtherInput?: boolean;
  otherDeviceName?: string;
  onOtherNameChange?: (name: string) => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function DeviceSelector({
  selectedDevice,
  onSelect,
  showOtherInput = true,
  otherDeviceName = '',
  onOtherNameChange,
  className = '',
}: DeviceSelectorProps) {
  const ownedDevices = CGM_DEVICE_CATEGORIES.owned.map(id => CGM_DEVICES[id]);
  const noDeviceOptions = CGM_DEVICE_CATEGORIES.none.map(id => CGM_DEVICES[id]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Popular in Malaysia */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <span className="mr-2">🇲🇾</span>
          Popular in Malaysia
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {POPULAR_DEVICES_MY.map((deviceId) => {
            const device = CGM_DEVICES[deviceId];
            return (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice === device.id}
                onSelect={() => onSelect(device.id)}
                isPopular
              />
            );
          })}
        </div>
      </div>

      {/* Other CGM Devices */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Other CGM Devices
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ownedDevices
            .filter(d => !POPULAR_DEVICES_MY.includes(d.id))
            .map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice === device.id}
                onSelect={() => onSelect(device.id)}
                compact
              />
            ))}
        </div>
      </div>

      {/* Show other device name input */}
      {showOtherInput && selectedDevice === 'other' && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What device do you use?
          </label>
          <input
            type="text"
            value={otherDeviceName}
            onChange={(e) => onOtherNameChange?.(e.target.value)}
            placeholder="e.g., Guardian Connect, Medtrum"
            className="
              w-full px-4 py-2.5 rounded-lg
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              focus:ring-2 focus:ring-violet-500 focus:border-transparent
            "
          />
        </div>
      )}

      {/* Don't have a CGM */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Don't have a CGM yet?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {noDeviceOptions.map((device) => (
            <NoDeviceCard
              key={device.id}
              device={device}
              isSelected={selectedDevice === device.id}
              onSelect={() => onSelect(device.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEVICE CARD
// ============================================

interface DeviceCardProps {
  device: CGMDeviceInfo;
  isSelected: boolean;
  onSelect: () => void;
  isPopular?: boolean;
  compact?: boolean;
}

function DeviceCard({
  device,
  isSelected,
  onSelect,
  isPopular = false,
  compact = false,
}: DeviceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        relative flex flex-col items-center p-4 rounded-xl border-2 transition-all
        ${isSelected
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 ring-2 ring-violet-500/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-300 dark:hover:border-violet-700'
        }
        ${compact ? 'p-3' : ''}
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
        </div>
      )}

      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full">
            Popular
          </span>
        </div>
      )}

      {/* Device icon/image placeholder */}
      <div className={`
        ${compact ? 'w-12 h-12 mb-2' : 'w-16 h-16 mb-3'}
        rounded-xl flex items-center justify-center
        ${device.manufacturer === 'Abbott' 
          ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30'
          : device.manufacturer === 'Dexcom'
          ? 'bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30'
          : 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800'
        }
      `}>
        <CircleDot className={`
          ${compact ? 'h-6 w-6' : 'h-8 w-8'}
          ${device.manufacturer === 'Abbott' 
            ? 'text-amber-600 dark:text-amber-400'
            : device.manufacturer === 'Dexcom'
            ? 'text-teal-600 dark:text-teal-400'
            : 'text-gray-500 dark:text-gray-400'
          }
        `} />
      </div>

      {/* Device name */}
      <span className={`
        font-medium text-center
        ${compact ? 'text-xs' : 'text-sm'}
        ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-white'}
      `}>
        {device.name}
      </span>

      {/* Manufacturer */}
      {!compact && device.manufacturer && (
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {device.manufacturer}
        </span>
      )}

      {/* Price */}
      {!compact && device.approxPriceMYR && (
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          ~RM{device.approxPriceMYR}/sensor
        </span>
      )}

      {/* Not available in MY */}
      {!compact && !device.availableInMalaysia && device.manufacturer && (
        <span className="text-xs text-orange-600 dark:text-orange-400 mt-1">
          Grey market only
        </span>
      )}
    </button>
  );
}

// ============================================
// NO DEVICE CARD
// ============================================

interface NoDeviceCardProps {
  device: CGMDeviceInfo;
  isSelected: boolean;
  onSelect: () => void;
}

function NoDeviceCard({ device, isSelected, onSelect }: NoDeviceCardProps) {
  const isPlanningToBuy = device.id === 'none_planning_to_buy';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        relative flex items-center p-4 rounded-xl border-2 transition-all
        ${isSelected
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 ring-2 ring-violet-500/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-300 dark:hover:border-violet-700'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
        </div>
      )}

      {/* Icon */}
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center mr-4
        ${isPlanningToBuy
          ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
          : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'
        }
      `}>
        {isPlanningToBuy ? (
          <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
        ) : (
          <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        )}
      </div>

      {/* Text */}
      <div className="text-left">
        <span className={`
          font-medium text-sm block
          ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-white'}
        `}>
          {device.name}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {device.description}
        </span>
      </div>
    </button>
  );
}


