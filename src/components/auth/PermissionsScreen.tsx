import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { systemPermissions } from '../../services/systemPermissions';
import { soundEffects } from '../../utils/audio';
import { Bell, Volume2, ShieldCheck, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface PermissionsScreenProps {
  onComplete: () => void;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onComplete }) => {
  const { updateSettings, showToast, settings } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGrantPermissions = async () => {
    setIsProcessing(true);
    try {
      if (settings.soundEnabled || settings.soundEffectsEnabled) {
        soundEffects.playSuccessNotification();
      }

      // Request browser / OS notification permission safely
      await systemPermissions.requestNotificationPermission();

      updateSettings({
        hasCompletedPermissionSetup: true,
        notificationsEnabled: true,
      });

      showToast('تنظیمات دسترسی با موفقیت اعمال شد.', 'success');
      onComplete();
    } catch {
      // Gracefully continue even on error
      updateSettings({
        hasCompletedPermissionSetup: true,
      });
      onComplete();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipPermissions = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }

    updateSettings({
      hasCompletedPermissionSetup: true,
    });

    showToast('می‌توانید بعداً دسترسی‌ها را از بخش تنظیمات فعال کنید.', 'info');
    onComplete();
  };

  return (
    <div
      id="planix-permissions-screen"
      dir="rtl"
      className="fixed inset-0 z-[9998] flex flex-col justify-between bg-slate-950 text-slate-100 select-none overflow-y-auto overflow-x-hidden"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <main className="w-full max-w-lg mx-auto px-4 sm:px-6 my-auto py-4 relative z-10 flex flex-col items-center">
        <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/30">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400 items-center justify-center mb-3.5 shadow-lg shadow-purple-900/40">
              <Bell className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              دسترسی‌های لازم برای کارایی هوشمند
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              برای یادآوری به موقع کارهای روزانه و اجرای بدون نقص تایمر تمرکز، لطفاً دسترسی‌های زیر را تایید فرمایید.
            </p>
          </div>

          {/* Permissions List */}
          <div className="space-y-3 mb-6">
            {/* Permission 1: Notifications */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">اعلان‌ها و یادآورها</h4>
                  <span className="text-[10px] text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded-full">
                    پیشنهادی
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  ارسال اعلان یادآوری وظایف سررسید شده، هشدارهای تقویم و پیگیری عادت‌های روزانه.
                </p>
              </div>
            </div>

            {/* Permission 2: Audio & Chimes */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/50 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">صدا و زنگ هشدار</h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    فعال
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  پخش زنگ ملایم پایان سشن‌های تمرکز پومودورو و زنگ بیدارباش هشدارها.
                </p>
              </div>
            </div>

            {/* Permission 3: Offline Storage */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">ذخیره‌سازی آفلاین و حریم خصوصی</h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    تضمین شده
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  اطلاعات شما ۱۰۰٪ به صورت محلی در دستگاه ذخیره می‌شود و به هیچ سرور خارجی ارسال نمی‌گردد.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              id="permissions-grant-btn"
              type="button"
              onClick={handleGrantPermissions}
              disabled={isProcessing}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/35 border border-purple-400/30 transition cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <span>اعطای دسترسی‌ها و ادامه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              id="permissions-skip-btn"
              type="button"
              onClick={handleSkipPermissions}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-700/60 transition cursor-pointer active:scale-98 disabled:opacity-50"
            >
              فعلاً نه / بعداً تنظیم می‌کنم (رد کردن)
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-500 font-sans shrink-0 relative z-10">
        <span>می‌توانید در هر زمان از منوی تنظیمات این دسترسی‌ها را تغییر دهید.</span>
      </footer>
    </div>
  );
};
