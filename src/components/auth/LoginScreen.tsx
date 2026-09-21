import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../utils/audio';
import { User, ArrowLeft, Sun, Moon, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onComplete: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onComplete }) => {
  const { updateSettings, showToast, settings } = useApp();
  const [nameInput, setNameInput] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>(
    settings.theme === 'light' ? 'light' : 'dark'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectTheme = (theme: 'light' | 'dark') => {
    setSelectedTheme(theme);
    updateSettings({ theme });
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }
  };

  const handleLoginWithName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playSuccessNotification();
    }

    const trimmed = nameInput.trim();
    const finalName = trimmed || 'کاربر گرامی';

    updateSettings({
      isLoggedIn: true,
      userName: finalName,
      theme: selectedTheme,
      hasCompletedPermissionSetup: true,
      hasSeenMascotTour: false,
    });

    showToast(`خوش آمدید، ${finalName}!`, 'success');
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  const handleGuestLogin = () => {
    setIsSubmitting(true);
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }

    updateSettings({
      isLoggedIn: true,
      userName: 'کاربر گرامی',
      theme: selectedTheme,
      hasCompletedPermissionSetup: true,
      hasSeenMascotTour: false,
    });

    showToast('ورود با موفقیت انجام شد.', 'info');
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  return (
    <div
      id="planix-login-screen"
      dir="rtl"
      className="fixed inset-0 z-[9998] flex flex-col justify-between bg-[#f3f5fa] dark:bg-[#060813] text-slate-800 dark:text-slate-100 select-none overflow-y-auto overflow-x-hidden transition-colors duration-300"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Form Center Card */}
      <main className="w-full max-w-md mx-auto px-4 sm:px-6 my-auto py-6 relative z-10 flex flex-col items-center">
        <div className="w-full bg-white/95 dark:bg-[#0c1020]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#171f35] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/10 dark:shadow-purple-950/40 transition-colors duration-300">
          {/* Card Header with Mascot Avatar */}
          <div className="text-center mb-6">
            <div className="relative inline-flex mb-3.5">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/80 border-2 border-purple-500/40 text-[#8B3DFF] flex items-center justify-center shadow-lg shadow-purple-500/20 overflow-hidden">
                <img
                  src="/mascot.png"
                  alt="پلنیکس"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white dark:border-[#0c1020]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              خوش آمدید به Planix
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              لطفاً تم و نام دلخواه خود را مشخص کنید تا پلنر برای شما آماده شود.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginWithName} className="space-y-4">
            {/* 1. THEME SELECTION: ASK AT THE BEGINNING */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-right">
                انتخاب ظاهر برنامه (تم)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Light Theme Option */}
                <button
                  type="button"
                  onClick={() => handleSelectTheme('light')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                    selectedTheme === 'light'
                      ? 'bg-purple-50 border-[#8B3DFF] text-[#8B3DFF] shadow-sm font-black ring-2 ring-[#8B3DFF]/20'
                      : 'bg-slate-50 dark:bg-[#12182b] border-slate-200 dark:border-[#1e273f] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Sun className={`w-4 h-4 ${selectedTheme === 'light' ? 'text-amber-500' : ''}`} />
                  <span className="text-xs font-bold">روشن (روز)</span>
                </button>

                {/* Dark Theme Option */}
                <button
                  type="button"
                  onClick={() => handleSelectTheme('dark')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                    selectedTheme === 'dark'
                      ? 'bg-purple-950/70 border-[#8B3DFF] text-purple-300 shadow-sm font-black ring-2 ring-[#8B3DFF]/30'
                      : 'bg-slate-50 dark:bg-[#12182b] border-slate-200 dark:border-[#1e273f] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Moon className={`w-4 h-4 ${selectedTheme === 'dark' ? 'text-purple-400' : ''}`} />
                  <span className="text-xs font-bold">تیره (شب)</span>
                </button>
              </div>
            </div>

            {/* 2. USER NAME INPUT */}
            <div>
              <label
                htmlFor="user-name-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-right"
              >
                نام یا نام مستعار شما
              </label>
              <div className="relative">
                <input
                  id="user-name-input"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="مثال: علی، سارا، مهدی..."
                  autoFocus
                  maxLength={30}
                  className="w-full py-3 px-4 pr-10 rounded-2xl bg-slate-50 dark:bg-[#12182b] border border-slate-200 dark:border-[#1e273f] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-[#8B3DFF] focus:ring-2 focus:ring-[#8B3DFF]/20 transition"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Submit & Start Guide Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#8B3DFF] hover:bg-[#7430D9] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span>ورود و مشاهده توضیحات برنامه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Quick Guest Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">یا</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Guest Login Button */}
            <button
              id="login-guest-btn"
              type="button"
              onClick={handleGuestLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700/70 transition cursor-pointer active:scale-98 disabled:opacity-50"
            >
              ورود سریع بدون نام (مهمان)
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>اطلاعات شما کاملاً محلی و امن در دستگاه ذخیره می‌شود.</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-400 font-sans shrink-0 relative z-10">
        <span>Planix • مدیریت هوشمند زمان و برنامه‌ریزی</span>
      </footer>
    </div>
  );
};
