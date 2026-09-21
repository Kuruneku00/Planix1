import React from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import { formatToJalali, toPersianDigits } from '../../utils/jalali';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Menu,
  Timer,
  LayoutDashboard,
  Calendar as CalendarIcon,
  CalendarDays,
  Columns3,
  CheckSquare,
  FolderKanban,
  Target,
  Flame,
  FileText,
  Clock,
  BarChart3,
  Paperclip,
  BookmarkPlus,
  RefreshCw,
  Database,
  Settings as SettingsIcon,
} from 'lucide-react';

import { MascotHelpButton } from '../mascot/MascotHelpButton';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const {
    activeView,
    openGlobalSearch,
    openQuickAdd,
    openMascotTour,
    settings,
    updateSettings,
    pomodoroIsRunning,
    pomodoroSecondsLeft,
    pomodoroMode,
    setActiveView,
  } = useApp();

  const viewTitles: Record<string, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
    dashboard: { title: 'داشبورد اصلی', icon: LayoutDashboard },
    tasks: { title: 'مدیریت وظایف', icon: CheckSquare },
    projects: { title: 'پروژه‌ها', icon: FolderKanban },
    calendar: { title: 'تقویم خورشیدی', icon: CalendarIcon },
    daily_planner: { title: 'برنامه روزانه', icon: CalendarDays },
    weekly_planner: { title: 'برنامه هفتگی', icon: Columns3 },
    goals: { title: 'اهداف و چشم‌انداز', icon: Target },
    habits: { title: 'عادت‌ها و پیگیری روزانه', icon: Flame },
    notes: { title: 'دفترچه یادداشت‌ها', icon: FileText },
    reminders: { title: 'یادآورها و هشدارها', icon: Bell },
    pomodoro: { title: 'تایمر تمرکز پومودورو', icon: Timer },
    time_management: { title: 'مدیریت زمان', icon: Clock },
    reports: { title: 'آمار و گزارش‌های بهره‌وری', icon: BarChart3 },
    files: { title: 'مدیریت فایل‌ها و پیوست‌ها', icon: Paperclip },
    templates: { title: 'قالب‌های آماده برنامه‌ریزی', icon: BookmarkPlus },
    sync: { title: 'همگام‌سازی بین دستگاه‌ها', icon: RefreshCw },
    backup: { title: 'پشتیبان‌گیری و بازیابی', icon: Database },
    settings: { title: 'تنظیمات برنامه', icon: SettingsIcon },
  };

  const currentViewInfo = viewTitles[activeView] || { title: 'Planix', icon: LayoutDashboard };
  const CurrentIcon = currentViewInfo.icon;

  const todayJalaliFormatted = formatToJalali(new Date(), 'full', settings.persianDigits);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const minutesLeft = Math.floor(pomodoroSecondsLeft / 60);
  const secondsLeft = pomodoroSecondsLeft % 60;
  const timeFormatted = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;

  return (
    <header
      id="main-header"
      className="bg-white/95 dark:bg-[#060813]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-[#161c2e] flex items-center justify-between shrink-0 z-20 px-3 sm:px-6 transition-colors duration-200"
      style={{
        minHeight: '3.5rem',
      }}
      dir="rtl"
    >
      {/* Right side: Mobile Menu + View Title & Date */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-0.5">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer shrink-0"
          title="منوی اصلی"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/40 text-[#8B3DFF] flex items-center justify-center shrink-0">
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
              {currentViewInfo.title}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block truncate">{todayJalaliFormatted}</p>
          </div>
        </div>
      </div>

      {/* Left side (In RTL: Search -> Mascot Fox Guide -> Quick Add (+) -> Notifications -> Theme Toggle) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Active Pomodoro Pill (if running) */}
        {pomodoroIsRunning && (
          <button
            type="button"
            onClick={() => setActiveView('pomodoro')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700/60 text-purple-700 dark:text-purple-300 text-[11px] sm:text-xs font-mono font-bold animate-pulse hover:bg-purple-200 dark:hover:bg-purple-900 transition cursor-pointer shadow-sm shrink-0"
            title="تایمر تمرکز فعال"
          >
            <Timer className="w-3.5 h-3.5 text-[#8B3DFF] shrink-0" />
            <span className="whitespace-nowrap">
              {settings.persianDigits ? toPersianDigits(timeFormatted) : timeFormatted}
            </span>
          </button>
        )}

        {/* Search Icon / Button */}
        <button
          type="button"
          onClick={openGlobalSearch}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer shrink-0"
          title="جستجو"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Mascot Avatar Guide Button: Exactly like screenshots */}
        <button
          id="header-mascot-guide-btn"
          type="button"
          onClick={() => openMascotTour(0)}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 border border-orange-400/60 shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
          title="راهنمای جامع برنامه (ممد راهنما)"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center">
            <img
              src="/mascot.png"
              alt="راهنمای برنامه"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Orange alert dot matching screenshot */}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white dark:border-[#060813]" />
        </button>

        {/* Circular Quick Add (+) Button */}
        <button
          id="quick-add-btn"
          type="button"
          onClick={() => openQuickAdd('task')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8B3DFF] hover:bg-[#7430D9] text-white flex items-center justify-center shadow-md shadow-purple-600/30 transition cursor-pointer active:scale-95 shrink-0"
          title="ایجاد جدید"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Theme Toggle (Far left in RTL) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer shrink-0"
          title={settings.theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-[#8B3DFF]" />
          )}
        </button>
      </div>
    </header>
  );
};
