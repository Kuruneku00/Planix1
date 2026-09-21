import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../utils/audio';
import { User, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onComplete: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onComplete }) => {
  const { updateSettings, showToast, settings } = useApp();
  const [nameInput, setNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    });

    showToast(`خوش آمدید، ${finalName}!`, 'success');
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  const handleGuestLogin = () => {
    setIsSubmitting(true);
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }

    updateSettings({
      isLoggedIn: true,
      userName: 'کاربر گرامی',
    });

    showToast('ورود با موفقیت انجام شد.', 'info');
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      id="planix-login-screen"
      dir="rtl"
      className="fixed inset-0 z-[9998] flex flex-col justify-between bg-slate-950 text-slate-100 select-none overflow-y-auto overflow-x-hidden"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Form Center Card */}
      <main className="w-full max-w-md mx-auto px-4 sm:px-6 my-auto py-6 relative z-10 flex flex-col items-center">
        <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/30">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400 items-center justify-center mb-3.5 shadow-lg shadow-purple-900/40">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              ورود به Planix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
              نام یا نام مستعار خود را وارد کنید تا داشبورد و برنامه‌ها برای شما شخصی‌سازی شوند.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginWithName} className="space-y-4">
            <div>
              <label
                htmlFor="user-name-input"
                className="block text-xs font-bold text-slate-300 mb-2 text-right"
              >
                نام یا عنوان شما
              </label>
              <div className="relative">
                <input
                  id="user-name-input"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="مثال: علی، سارا، رضا..."
                  autoFocus
                  maxLength={30}
                  className="w-full py-3.5 px-4 pr-11 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/35 border border-purple-400/30 transition cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span>ورود و ادامه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Quick Guest Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-medium">یا</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Guest Login Button */}
            <button
              id="login-guest-btn"
              type="button"
              onClick={handleGuestLogin}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/70 transition cursor-pointer active:scale-98 disabled:opacity-50"
            >
              ورود سریع بدون نام (مهمان)
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>اطلاعات شما کاملاً امن و محلی روی دستگاه ذخیره می‌شود.</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-500 font-sans shrink-0 relative z-10">
        <span>Planix • مدیریت هوشمند زمان و برنامه‌ریزی</span>
      </footer>
    </div>
  );
};
