// app/ramadan/settings/page.tsx
// ⚙️ Ramadan Settings Page

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Bell, 
  Clock, 
  Activity,
  Save,
  Moon,
  Power,
  AlertTriangle
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { useRamadanMode } from '@/hooks/useRamadanMode';
import { useFood } from '@/context/FoodContext';
import { MALAYSIAN_CITIES, DEFAULT_RAMADAN_SETTINGS } from '@/lib/types/ramadan';

export default function RamadanSettingsPage() {
  const router = useRouter();
  const { userId } = useFood();
  
  const {
    settings,
    isLoading,
    updateSettings,
    disableRamadanMode,
  } = useRamadanMode({ userId });

  // Local form state
  const [formData, setFormData] = useState({
    location_name: 'Kuala Lumpur',
    location_zone: 'WLY01',
    imsak_offset_minutes: -10,
    sahur_reminder_minutes: 30,
    iftar_reminder_minutes: 15,
    glucose_target_fasting: 5.5,
    glucose_target_post_iftar: 7.8,
    glucose_alert_low: 3.9,
    glucose_alert_high: 10.0,
    notifications_enabled: true,
    sahur_notification: true,
    iftar_notification: true,
    hydration_reminders: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  // Load settings into form
  useEffect(() => {
    if (settings) {
      setFormData({
        location_name: settings.location_name || 'Kuala Lumpur',
        location_zone: settings.location_zone || 'WLY01',
        imsak_offset_minutes: settings.imsak_offset_minutes ?? -10,
        sahur_reminder_minutes: settings.sahur_reminder_minutes ?? 30,
        iftar_reminder_minutes: settings.iftar_reminder_minutes ?? 15,
        glucose_target_fasting: settings.glucose_target_fasting ?? 5.5,
        glucose_target_post_iftar: settings.glucose_target_post_iftar ?? 7.8,
        glucose_alert_low: settings.glucose_alert_low ?? 3.9,
        glucose_alert_high: settings.glucose_alert_high ?? 10.0,
        notifications_enabled: settings.notifications_enabled ?? true,
        sahur_notification: settings.sahur_notification ?? true,
        iftar_notification: settings.iftar_notification ?? true,
        hydration_reminders: settings.hydration_reminders ?? true,
      });
    }
  }, [settings]);

  const handleLocationChange = (cityName: string) => {
    const city = MALAYSIAN_CITIES[cityName];
    if (city) {
      setFormData(prev => ({
        ...prev,
        location_name: cityName,
        location_zone: city.zone,
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const city = MALAYSIAN_CITIES[formData.location_name];
      await updateSettings({
        ...formData,
        location_lat: city?.lat,
        location_lng: city?.lng,
      });
      router.push('/ramadan');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisable = async () => {
    try {
      await disableRamadanMode();
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to disable Ramadan mode:', error);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Moon className="w-12 h-12 text-emerald-500 animate-pulse" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen p-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/ramadan')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Ramadan Settings</h1>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Location Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Location</h3>
            </div>
            
            <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
              Select your city for accurate prayer times
            </label>
            <select
              value={formData.location_name}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
            >
              {Object.keys(MALAYSIAN_CITIES).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Zone: {formData.location_zone}
            </p>
          </div>

          {/* Timing Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Timing Adjustments</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                  Imsak offset (minutes before Subuh)
                </label>
                <input
                  type="number"
                  value={Math.abs(formData.imsak_offset_minutes)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    imsak_offset_minutes: -Math.abs(parseInt(e.target.value) || 10)
                  }))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
                  min="5"
                  max="30"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                  Sahur reminder (minutes before Imsak)
                </label>
                <input
                  type="number"
                  value={formData.sahur_reminder_minutes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sahur_reminder_minutes: parseInt(e.target.value) || 30
                  }))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
                  min="10"
                  max="60"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                  Iftar reminder (minutes before Maghrib)
                </label>
                <input
                  type="number"
                  value={formData.iftar_reminder_minutes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    iftar_reminder_minutes: parseInt(e.target.value) || 15
                  }))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
                  min="5"
                  max="30"
                />
              </div>
            </div>
          </div>

          {/* Glucose Targets Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Glucose Targets (mmol/L)</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                  Fasting Target
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.glucose_target_fasting}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    glucose_target_fasting: parseFloat(e.target.value) || 5.5
                  }))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                  Post-Iftar Target
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.glucose_target_post_iftar}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    glucose_target_post_iftar: parseFloat(e.target.value) || 7.8
                  }))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                  Low Alert
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.glucose_alert_low}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    glucose_alert_low: parseFloat(e.target.value) || 3.9
                  }))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-600 dark:text-slate-400">
                  High Alert
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.glucose_alert_high}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    glucose_alert_high: parseFloat(e.target.value) || 10.0
                  }))}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-0"
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold">Notifications</h3>
            </div>

            <div className="space-y-3">
              {[
                { key: 'notifications_enabled', label: 'Enable All Notifications' },
                { key: 'sahur_notification', label: 'Sahur Reminder' },
                { key: 'iftar_notification', label: 'Iftar Reminder' },
                { key: 'hydration_reminders', label: 'Hydration Reminders' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-200">{label}</span>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      [key]: !prev[key as keyof typeof formData]
                    }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      formData[key as keyof typeof formData]
                        ? 'bg-emerald-500'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData[key as keyof typeof formData]
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>

          {/* Disable Ramadan Mode */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            {!showDisableConfirm ? (
              <button
                onClick={() => setShowDisableConfirm(true)}
                className="w-full border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Power className="w-5 h-5" />
                Disable Ramadan Mode
              </button>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="font-medium">Are you sure?</p>
                </div>
                <p className="text-sm text-red-500 mb-4">
                  This will disable Ramadan Mode. Your data will be preserved.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDisableConfirm(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-200 dark:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisable}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white"
                  >
                    Disable
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

