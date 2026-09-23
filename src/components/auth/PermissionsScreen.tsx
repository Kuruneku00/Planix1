import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { systemPermissions } from '../../services/systemPermissions';
import { soundEffects } from '../../utils/audio';
import { Bell, Clock, Volume2, ShieldCheck, ArrowLeft, Check, Sparkles, Zap } from 'lucide-react';

interface PermissionsScreenProps {
  onComplete: () => void;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onComplete }) => {
  const { updateSettings, showToast, settings } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const isLight = settings.theme === 'light';

  const handleGrantPermissions = async () => {
    setIsProcessing(true);
    try {
      if (settings.soundEnabled || settings.soundEffectsEnabled) {
        soundEffects.playSuccessNotification();
      }

      // 1. Request real OS / Phone Notification permission
      await systemPermissions.requestNotificationPermission();

      // 2. Request Alarm & Clock capability
      await systemPermissions.requestAlarmCapability();

      // 3. Request WakeLock & audio unlock
      await systemPermissions.acquireWakeLock();

      updateSettings({
        hasCompletedPermissionSetup: true,
        hasCompletedOnboarding: true,
        isFirstLaunch: false,
        notificationsEnabled: true,
      });

      showToast('دسترسی‌ها با موفقیت فعال شدند 🚀', 'success');
      onComplete();
    } catch {
      // Gracefully continue even on error
      updateSettings({
        hasCompletedPermissionSetup: true,
        hasCompletedOnboarding: true,
        isFirstLaunch: false,
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
      hasCompletedOnboarding: true,
      isFirstLaunch: false,
    });

    showToast('می‌توانید بعداً دسترسی‌ها را از بخش تنظیمات فعال کنید.', 'info');
    onComplete();
  };

  return (
    <div
      id="planix-permissions-screen"
      dir="rtl"
      className={`fixed inset-0 z-[9998] flex flex-col justify-between select-none overflow-y-auto overflow-x-hidden transition-colors duration-300 ${
        isLight ? 'bg-[#f3f5fa] text-slate-800' : 'bg-[#060813] text-slate-100'
      }`}
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
        <div
          className={`w-full backdrop-blur-xl border rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors duration-300 ${
            isLight
              ? 'bg-white/95 border-slate-200/90 shadow-purple-950/10 text-slate-800'
              : 'bg-[#0c1020]/95 border-[#171f35] shadow-purple-950/40 text-slate-100'
          }`}
        >
          {/* Card Header with Mascot Badge */}
          <div className="text-center mb-6">
            <div className="relative inline-flex mb-3.5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${
                  isLight
                    ? 'bg-purple-50 border-purple-200 text-[#8B3DFF] shadow-purple-500/15'
                    : 'bg-purple-950/80 border-purple-500/40 text-purple-400 shadow-purple-900/40'
                }`}
              >
                <Bell className="w-7 h-7" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1020]" />
            </div>

            <h2
              className={`text-xl sm:text-2xl font-black mb-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              اجازه دسترسی به ساعت و اعلان‌ها
            </h2>
            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-sm mx-auto ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              برای اجرای دقیق زنگ هشدار رأس ساعت و ارسال یادآورهای مهم به گوشی، لطفاً دسترسی‌های زیر را تایید کنید.
            </p>
          </div>

          {/* Permissions List */}
          <div className="space-y-3 mb-6">
            {/* Permission 1: Notifications */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                isLight
                  ? 'bg-[#f8faff] border-[#e2e7f6]'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                  isLight
                    ? 'bg-purple-100 text-[#8B3DFF] border-purple-200'
                    : 'bg-purple-950/80 text-purple-400 border-purple-800/50'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    اعلان‌ها و یادآورهای گوشی
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLight
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-purple-950/60 text-purple-400'
                    }`}
                  >
                    ضروری
                  </span>
                </div>
                <p
                  className={`text-[11px] sm:text-xs leading-relaxed ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  ارسال پیام یادآوری موعد وظایف، جلسات تقویم و عادات روزانه مستقیماً به نوار اعلان گوشی.
                </p>
              </div>
            </div>

            {/* Permission 2: Clock & Exact Alarm */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                isLight
                  ? 'bg-[#f8faff] border-[#e2e7f6]'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                  isLight
                    ? 'bg-blue-100 text-blue-600 border-blue-200'
                    : 'bg-blue-950/80 text-blue-400 border-blue-800/50'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    ساعت و آلارم دقیق
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLight
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-blue-950/60 text-blue-400'
                    }`}
                  >
                    دقیق
                  </span>
                </div>
                <p
                  className={`text-[11px] sm:text-xs leading-relaxed ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  زمان‌بندی دقیق در سیستم برای به صدا درآوردن زنگ هشدار رأس دقیقه بدون تاخیر.
                </p>
              </div>
            </div>

            {/* Permission 3: Background & WakeLock */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                isLight
                  ? 'bg-[#f8faff] border-[#e2e7f6]'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    کارکرد در پس‌زمینه و بیدارباش
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isLight
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-emerald-950/60 text-emerald-400'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    پایدار
                  </span>
                </div>
                <p
                  className={`text-[11px] sm:text-xs leading-relaxed ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  اجرای پایدار تایمر تمرکز پومودورو و هشدارها حتی زمانی که صفحه نمایش گوشی خاموش است.
                </p>
              </div>
            </div>

            {/* Permission 4: Audio & Chimes */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                isLight
                  ? 'bg-[#f8faff] border-[#e2e7f6]'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                  isLight
                    ? 'bg-amber-100 text-amber-600 border-amber-200'
                    : 'bg-amber-950/80 text-amber-400 border-amber-800/50'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    صدا و زنگ‌های هشدار
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLight
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-amber-950/60 text-amber-400'
                    }`}
                  >
                    فعال
                  </span>
                </div>
                <p
                  className={`text-[11px] sm:text-xs leading-relaxed ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  پخش زنگ پایان سشن‌های تمرکز پومودورو و زنگ بیدارباش هشدارها با قابلیت توقف و تعویق.
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
              <span>تایید دسترسی‌ها و ورود به برنامه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              id="permissions-skip-btn"
              type="button"
              onClick={handleSkipPermissions}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-bold border transition cursor-pointer active:scale-98 disabled:opacity-50 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60'
              }`}
            >
              فعلاً نه / بعداً تنظیم می‌کنم (رد کردن)
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer
        className={`w-full text-center py-2 text-[11px] font-sans shrink-0 relative z-10 ${
          isLight ? 'text-slate-500' : 'text-slate-500'
        }`}
      >
        <span>می‌توانید در هر زمان از منوی تنظیمات این دسترسی‌ها را تغییر دهید.</span>
      </footer>
    </div>
  );
};
