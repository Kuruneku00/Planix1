import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Volume2,
  Bell,
  Timer,
  Hash,
  Save,
  CheckCircle2,
  Sparkles,
  Check,
  CheckSquare,
  Repeat,
  Calendar,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';
import { systemPermissions, SystemPermissionsStatus } from '../../services/systemPermissions';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, showToast, openMascotTour } = useApp();

  const [userName, setUserName] = useState(settings.userName || '');
  const [theme, setTheme] = useState(settings.theme || 'dark');

  React.useEffect(() => {
    setTheme(settings.theme || 'dark');
  }, [settings.theme]);
  const [persianDigits, setPersianDigits] = useState(settings.persianDigits ?? false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(settings.soundEffectsEnabled ?? true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled ?? true);

  // Notification Specific Preferences
  const [remindersEnabled, setRemindersEnabled] = useState(settings.notificationPreferences?.reminders ?? true);
  const [habitsEnabled, setHabitsEnabled] = useState(settings.notificationPreferences?.habits ?? true);
  const [tasksEnabled, setTasksEnabled] = useState(settings.notificationPreferences?.tasks ?? true);
  const [calendarEnabled, setCalendarEnabled] = useState(settings.notificationPreferences?.calendar ?? true);

  const [pomodoroFocusMinutes, setPomodoroFocusMinutes] = useState(settings.pomodoroFocusMinutes || 25);
  const [pomodoroShortBreakMinutes, setPomodoroShortBreakMinutes] = useState(settings.pomodoroShortBreakMinutes || 5);
  const [pomodoroLongBreakMinutes, setPomodoroLongBreakMinutes] = useState(settings.pomodoroLongBreakMinutes || 15);

  const [liveStatus, setLiveStatus] = useState<SystemPermissionsStatus>({
    notification: 'unsupported',
    alarmExact: 'unsupported',
    calendar: 'available',
    backgroundSync: 'unsupported',
    wakeLock: 'unsupported',
    batteryOptimization: { supported: false },
  });

  useEffect(() => {
    systemPermissions.getLivePermissionsStatus().then(setLiveStatus);
    const unsub = systemPermissions.subscribe(setLiveStatus);
    return () => unsub();
  }, []);

  const handleRequestSystemNotification = async () => {
    const res = await systemPermissions.requestNotificationPermission();
    const updated = await systemPermissions.getLivePermissionsStatus();
    setLiveStatus(updated);
    if (res === 'granted') {
      showToast('اعلان‌های گوشی با موفقیت متصل شدند.', 'success');
    } else {
      showToast('لطفاً در پیام بالای صفحه یا تنظیمات گوشی گزینه Allow را بزنید.', 'warning');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName,
      theme,
      persianDigits,
      soundEffectsEnabled,
      notificationsEnabled,
      notificationPreferences: {
        enabled: notificationsEnabled,
        reminders: remindersEnabled,
        habits: habitsEnabled,
        tasks: tasksEnabled,
        calendar: calendarEnabled,
        goals: true,
      },
      pomodoroFocusMinutes: Number(pomodoroFocusMinutes),
      pomodoroShortBreakMinutes: Number(pomodoroShortBreakMinutes),
      pomodoroLongBreakMinutes: Number(pomodoroLongBreakMinutes),
    });
    showToast('تنظیمات با موفقیت ذخیره شد.', 'success');
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[#8B3DFF]" />
          <span>تنظیمات و شخصی‌سازی Planix</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          تنظیم مشخصات کاربری، اتصال اعلان‌های گوشی، صداها و تایمر تمرکز
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Guide & Explanations Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <img src="/mascot.png" alt="راهنما" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">راهنما و توضیحات برنامه (تور آموزشی)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">مرور توضیحات تصویری بخش‌های مختلف برای استفاده حرفه‌ای از Planix</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50">
            <div className="text-right">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                توضیحات و آموزش گام‌به‌گام برنامه
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed block mt-0.5">
                با زدن این دکمه، راهنمای مصور تمام قسمت‌ها (داشبورد، وظایف، تقویم، پومودورو و عادت‌ها) مجدداً برای شما باز می‌شود.
              </span>
            </div>
            <button
              type="button"
              onClick={() => openMascotTour(0)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#8B3DFF] hover:bg-[#7430D9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            >
              <span>مشاهده راهنما و توضیحات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Theme & Appearance Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">تم و حالت نمایشی (تاریک و روشن)</h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            تم مورد نظر خود را انتخاب کنید. تغییرات بلافاصله در تمام بخش‌های برنامه اعمال می‌شوند.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Dark Theme Option */}
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                updateSettings({ theme: 'dark' });
              }}
              className={`p-4 rounded-xl border flex items-center gap-3.5 text-right transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-purple-950/70 border-purple-500 ring-2 ring-purple-500/50'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">تم تاریک (Dark Mode)</span>
                  {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  پس‌زمینه تیره مناسب برای شب، استراحت چشم‌ها و مصرف بهینه باتری
                </p>
              </div>
            </button>

            {/* Light Theme Option */}
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                updateSettings({ theme: 'light' });
              }}
              className={`p-4 rounded-xl border flex items-center gap-3.5 text-right transition cursor-pointer ${
                theme === 'light'
                  ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/50'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 flex-shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">تم روشن (Light Mode)</span>
                  {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#8B3DFF]" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  طراحی شفاف، خوانایی بالا در محیط‌های پرنور و کنتراست شفاف
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <User className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">مشخصات کاربری</h3>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              نام یا عنوان نمایشی شما
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="مثلاً: علی رضایی"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Display & Localization Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <Hash className="w-5 h-5 text-[#8B3DFF]" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">بومی‌سازی و صداها</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">نمایش ارقام به صورت فارسی</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">تبدیل خودکار تمامی اعداد، تاریخ‌ها و ساعت‌ها به حروف فارسی (۱۲۳۴۵۶۷۸۹۰)</span>
              </div>
              <input
                type="checkbox"
                checked={persianDigits}
                onChange={(e) => setPersianDigits(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B3DFF] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">پخش افکت‌های صوتی</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">پخش صدا هنگام اتمام تایمر پومودورو یا انجام تسک</span>
              </div>
              <input
                type="checkbox"
                checked={soundEffectsEnabled}
                onChange={(e) => setSoundEffectsEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B3DFF] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Phone Notifications (اتصال اعلان‌ها به گوشی) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#8B3DFF]" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">اتصال اعلان‌ها به گوشی</h3>
            </div>
            {liveStatus.notification === 'granted' ? (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" />
                متصل به اعلان‌های گوشی
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30">
                نیاز به اتصال
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            تمامی هشدارهای مهم (موعد وظایف، رویدادهای تقویم، یادآور عادات و اتمام تایمر تمرکز) مستقیماً به نوار اعلان و صفحه قفل گوشی شما ارسال می‌شوند و هیچ اعلان مزاحمی داخل محیط برنامه ظاهر نخواهد شد.
          </p>

          {/* Connect button if not granted */}
          {liveStatus.notification !== 'granted' && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-right">
                <div className="flex items-center gap-2 text-[#8B3DFF] dark:text-purple-300 font-bold text-xs sm:text-sm">
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>اتصال مستقیم اعلان‌ها به نوار وضعیت گوشی</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  جهت دریافت پیام‌های هشدار در نوار بالای گوشی، دکمه اتصال را بزنید.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRequestSystemNotification}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#8B3DFF] hover:bg-[#7430D9] text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>اتصال اعلان به گوشی</span>
              </button>
            </div>
          )}

          {/* Notification Toggles */}
          <div className="space-y-3 pt-2">
            {/* Master Notification Switch */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">ارسال اعلان‌ها به گوشی</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">کلید اصلی فعال بودن ارسال اعلان‌های مهم به گوشی</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B3DFF] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500"
              />
            </label>

            {/* Reminder notifications */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-purple-500" />
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">اعلان‌های یادآورها در گوشی</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">هشدار یادآوری‌های مستقل در نوار اعلان گوشی</span>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!notificationsEnabled}
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B3DFF] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500 disabled:opacity-40"
              />
            </label>

            {/* Task reminders */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">اعلان موعد وظایف در گوشی</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">هشدار سررسید کارهای مهم در نوار وضعیت گوشی</span>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!notificationsEnabled}
                checked={tasksEnabled}
                onChange={(e) => setTasksEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B3DFF] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500 disabled:opacity-40"
              />
            </label>

            {/* Habit reminders */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Repeat className="w-4 h-4 text-violet-500" />
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">اعلان عادات روزانه در گوشی</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">یادآوری انجام عادات در ساعت مقرر روی گوشی</span>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!notificationsEnabled}
                checked={habitsEnabled}
                onChange={(e) => setHabitsEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B3DFF] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500 disabled:opacity-40"
              />
            </label>

            {/* Calendar reminders */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-500" />
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">اعلان تقویم و جلسات در گوشی</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">هشدار شروع رویدادها و جلسات در گوشی</span>
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!notificationsEnabled}
                checked={calendarEnabled}
                onChange={(e) => setCalendarEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B3DFF] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-purple-500 disabled:opacity-40"
              />
            </label>
          </div>
        </div>

        {/* Pomodoro Timer Configuration */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <Timer className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">پیکربندی زمان‌های پومودورو (دقیقه)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                مدت زمان تمرکز (دقیقه)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={pomodoroFocusMinutes}
                onChange={(e) => setPomodoroFocusMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                استراحت کوتاه (دقیقه)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={pomodoroShortBreakMinutes}
                onChange={(e) => setPomodoroShortBreakMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                استراحت بلند (دقیقه)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={pomodoroLongBreakMinutes}
                onChange={(e) => setPomodoroLongBreakMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* App Info & Logo Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-500/10 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 shadow-lg shadow-purple-500/10 dark:shadow-purple-900/30 flex items-center justify-center p-2.5 shrink-0">
              <img
                src="/logo.png"
                alt="لوگوی Planix"
                className="w-full h-full object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center sm:text-right space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">اپلیکیشن مدیریت زمان و برنامه‌ریزی Planix</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-mono font-bold">
                  v1.2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                سامانه هوشمند و آفلاین برای دستیابی به اهداف، مدیریت وظایف، برنامه‌ریزی روزانه، عادت‌ها و تمرکز عمیق.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                openMascotTour(0);
                showToast('راهنمای مرحله‌به‌مرحله تصویری باز شد.', 'info');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              مشاهده مجدد راهنما و Onboarding
            </button>
            <button
              type="button"
              onClick={() => {
                updateSettings({ isLoggedIn: false });
                showToast('خروج از حساب انجام شد.', 'info');
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-300 text-xs font-bold transition border border-rose-200 dark:border-rose-800/60 cursor-pointer"
            >
              خروج از حساب
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B3DFF] hover:bg-[#7430D9] text-white font-bold text-sm shadow-md shadow-purple-600/30 transition cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تنظیمات</span>
          </button>
        </div>

        {/* Creator Attribution */}
        <div className="pt-8 pb-4 text-center border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            ساخته شده در <span className="text-[#8B3DFF] font-extrabold">رومی لند</span> توسط <span className="text-[#8B3DFF] font-extrabold">یگانه بابایی</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Planix Smart System • تمامی حقوق محفوظ است
          </p>
        </div>
      </form>
    </div>
  );
};

