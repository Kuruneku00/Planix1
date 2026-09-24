import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDuration = 1200,
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDuration);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, minDuration + 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration, onComplete]);

  return (
    <div
      id="planix-splash-screen"
      dir="rtl"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-slate-950 text-slate-100 select-none transition-all duration-500 ease-out overflow-hidden ${
        isFading ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 28px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 32px)',
      }}
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="w-full flex justify-center pt-2 opacity-80">
        <span className="text-[11px] text-purple-400 font-semibold tracking-wider">
          نسخه اختصاصی برنامه‌ریزی
        </span>
      </div>

      {/* Center Branding - Clean, perfectly sized and proportioned */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* App Logo Frame */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-600/40 to-indigo-500/30 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl flex items-center justify-center p-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="Planix Logo"
              className="w-full h-full object-contain drop-shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          Planix
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
          برنامه‌ریزی هوشمند، زندگی بهتر
        </p>

        {/* Sleek Loading progress line */}
        <div className="mt-8 w-36 h-1 rounded-full bg-slate-800/80 overflow-hidden relative">
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-purple-500 to-indigo-400 rounded-full animate-splash-progress" />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 text-center flex flex-col items-center gap-1 pb-1">
        <span className="text-[10px] text-slate-500 font-sans tracking-widest">PLANIX SYSTEM</span>
        <span className="text-[11px] text-slate-400 font-medium">
          ساخته شده در <span className="text-purple-400 font-bold">رومی لند</span> توسط <span className="text-purple-400 font-bold">یگانه بابایی</span>
        </span>
      </div>
    </div>
  );
};
