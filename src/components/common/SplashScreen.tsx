import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 450,
}) => {
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDuration);

    const doneTimer = setTimeout(() => {
      setIsDone(true);
      if (onFinish) onFinish();
    }, minDuration + 200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [minDuration, onFinish]);

  if (isDone) return null;

  return (
    <div
      id="app-splash-screen"
      dir="rtl"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-slate-950 text-slate-100 select-none transition-opacity duration-200 ease-out overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 28px)',
      }}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacing - clean and minimal without clutter under phone status bar */}
      <div className="w-full" />

      {/* Center Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Animated App Icon Frame */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 opacity-60 blur-md animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl flex items-center justify-center p-3.5 overflow-hidden">
            <img
              src="/logo.png"
              alt="Planix"
              className="w-full h-full object-contain rounded-2xl drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          پلنر <span className="text-purple-400 font-light text-xl sm:text-2xl">هوشمند</span>
        </h1>

        {/* Subtitle / Tagline */}
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
          برنامه‌ریزی هوشمند، ساختن عادت‌های پایدار و مدیریت زمان
        </p>

        {/* Loading indicator bar */}
        <div className="mt-8 w-40 h-1 rounded-full bg-slate-800 overflow-hidden relative">
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-purple-500 to-indigo-400 rounded-full animate-splash-progress" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 text-center text-[11px] text-slate-500 font-sans tracking-wider pb-2">
        <span>Planixx Smart Productivity</span>
      </div>
    </div>
  );
};
