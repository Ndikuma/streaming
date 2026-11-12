import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useViewLoading } from '../../hooks/useViewLoading';
import { FormSkeleton } from '../common/Skeletons';
import {
  Settings,
  Shield,
  Video,
  Bell,
  Key,
  Check,
  Moon,
  Sun,
  Volume2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { isLoading } = useViewLoading(400);
  const { currentUser } = usePlatform();
  const [defaultQuality, setDefaultQuality] = useState('1080p');
  const [enableE2ee, setEnableE2ee] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [chatSounds, setChatSounds] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto px-4 md:px-8 pt-4">
        {/* Header Shimmer */}
        <div className="space-y-2 animate-pulse">
          <div className="h-6 bg-slate-800 rounded w-48" />
          <div className="h-3 bg-slate-800/60 rounded w-80" />
        </div>
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto px-4 md:px-8 pt-4">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-rose-500" />
          <h1 className="text-xl font-bold text-white tracking-tight">Platform Settings</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure video streaming presets, hardware defaults, security protocols, and interface theme
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Settings saved and applied successfully.</span>
        </div>
      )}

      {/* Section 1: Streaming & Video Preferences */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Video className="w-4 h-4 text-rose-400" />
          Default Streaming & Playback
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <p className="font-semibold text-white">Default Video Resolution</p>
              <p className="text-slate-400 text-[11px]">
                Applied when launching Live Studio or loading VOD content
              </p>
            </div>
            <select
              value={defaultQuality}
              onChange={(e) => setDefaultQuality(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p SD</option>
            </select>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <p className="font-semibold text-white">Gift Notification Sounds</p>
              <p className="text-slate-400 text-[11px]">Play audio chimes when virtual gifts are sent</p>
            </div>
            <input
              type="checkbox"
              checked={chatSounds}
              onChange={(e) => setChatSounds(e.target.checked)}
              className="w-4 h-4 accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Security & Encryption */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          Security & Media Encryption
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <p className="font-semibold text-white">End-to-End Media Encryption (E2EE)</p>
              <p className="text-slate-400 text-[11px]">
                Encrypt WebRTC video frames directly on device before transmission to SFU
              </p>
            </div>
            <input
              type="checkbox"
              checked={enableE2ee}
              onChange={(e) => setEnableE2ee(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Reset Broadcaster Stream Key</p>
              <p className="text-slate-400 text-[11px]">
                Instantly revoke current RTMP OBS stream key and issue a new one
              </p>
            </div>
            <button
              onClick={() => alert('New stream key generated: live_omni_' + Math.random().toString(36).substring(2, 12))}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold cursor-pointer"
            >
              Reset Key
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Appearance & Theme */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Moon className="w-4 h-4 text-amber-400" />
          Appearance & Theme
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleTheme('dark')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-rose-500/10 border-rose-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Theme (Default)</span>
          </button>

          <button
            onClick={() => toggleTheme('light')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-rose-500/10 border-rose-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light Theme</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-900/30 cursor-pointer"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};
