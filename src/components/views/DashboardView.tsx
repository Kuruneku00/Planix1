import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import { formatToJalali, toPersianDigits, toGregorianIsoDate } from '../../utils/jalali';
import { HabitCreateModal } from '../habits/HabitCreateModal';
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Timer,
  Flame,
  Plus,
  FolderKanban,
  Target,
  FileText,
  Sparkles,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { openQuickAdd, setActiveView, refreshTrigger, settings, openMascotTour } = useApp();
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const todayIso = toGregorianIsoDate();
  const todayJalali = formatToJalali(new Date(), 'full', settings.persianDigits);

  // Real Database Queries for Today
  const allTasks = useMemo(() => db.getTasks(), [refreshTrigger]);
  const allEvents = useMemo(() => db.getEvents(), [refreshTrigger]);
  const allHabits = useMemo(() => db.getHabits(), [refreshTrigger]);
  const allHabitLogs = useMemo(() => db.getHabitLogs(), [refreshTrigger]);
  const allPomodoro = useMemo(() => db.getPomodoroSessions(), [refreshTrigger]);

  // Today's specific data
  const todayTasks = useMemo(() => {
    return allTasks.filter((t) => !t.dueDate || t.dueDate === todayIso);
  }, [allTasks, todayIso]);

  const completedTodayTasks = useMemo(() => {
    return todayTasks.filter((t) => t.status === 'completed');
  }, [todayTasks]);

  const todayEvents = useMemo(() => {
    return allEvents.filter((e) => e.startDate === todayIso);
  }, [allEvents, todayIso]);

  const todayPomodoros = useMemo(() => {
    return allPomodoro.filter((p) => {
      if (!p.completedAt) return false;
      const datePart = p.completedAt.split('T')[0];
      const matchesDate =
        datePart === todayIso ||
        p.completedAt.startsWith(todayIso) ||
        (() => {
          try {
            return toGregorianIsoDate(new Date(p.completedAt)) === todayIso;
          } catch {
            return false;
          }
        })();
      return matchesDate && (p.mode === 'focus' || !p.mode);
    });
  }, [allPomodoro, todayIso]);

  const todayFocusMinutes = useMemo(() => {
    return todayPomodoros.reduce((acc, p) => acc + (Number(p.durationMinutes) || 0), 0);
  }, [todayPomodoros]);

  const todayHabitsDoneCount = useMemo(() => {
    return allHabitLogs.filter((l) => l.date === todayIso && l.completed).length;
  }, [allHabitLogs, todayIso]);

  const focusHours = Math.floor(todayFocusMinutes / 60);
  const focusRemMinutes = todayFocusMinutes % 60;
  const focusTimeDisplay =
    todayFocusMinutes === 0
      ? '0 دقیقه'
      : focusHours > 0
      ? `${focusHours} ساعت ${focusRemMinutes > 0 ? `و ${focusRemMinutes} د` : ''}`
      : `${todayFocusMinutes} دقیقه`;

  return (
    <div id="dashboard-view" className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-24 sm:pb-8" dir="rtl">
      
      {/* 1. TOP GREETING & ACTION BANNER (Matching IMG_20260919_172418_396.jpg exactly in dark theme) */}
      <div
        id="dashboard-top-welcome-card"
        className="p-4 sm:p-5 rounded-2xl transition-all shadow-sm bg-white border border-[#e2e7f6] dark:bg-[#120d24] dark:border-[#2b1a50] dark:shadow-xl dark:shadow-purple-950/20"
      >
        {/* Top Header Row: Date badge on right (RTL) */}
        <div className="flex items-center justify-end mb-2">
          {/* Date Badge with Sparkles: exactly like screenshot */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#edf0ff] text-[#4f3ff5] border border-[#dce2fc] dark:bg-[#2b1752] dark:text-[#e9d5ff] dark:border-[#4c278c]">
            <Sparkles className="w-3.5 h-3.5 text-[#7059f6] dark:text-[#d8b4fe]" />
            <span>{todayJalali}</span>
          </div>
        </div>

        {/* Greeting Headline: Display user's name */}
        <div className="text-right mb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {settings.userName && settings.userName.trim() && settings.userName !== 'کاربر گرامی'
              ? `سلام ${settings.userName}، روزت بخیر!`
              : 'سلام کاربر گرامی، روزت بخیر!'}
          </h2>
        </div>

        {/* 2 Action Buttons: Right = "+ وظیفه جدید" (solid vibrant purple), Left = "شروع تمرکز ⏱" (dark translucent with border) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Right Button (First in RTL): + وظیفه جدید */}
          <button
            id="dashboard-primary-add-btn"
            type="button"
            onClick={() => openQuickAdd('task')}
            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer bg-[#8B3DFF] hover:bg-[#7430D9] text-white shadow-md shadow-purple-500/25 dark:bg-[#a855f7] dark:hover:bg-[#9333ea] dark:shadow-lg dark:shadow-purple-600/40"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>وظیفه جدید</span>
          </button>

          {/* Left Button (Second in RTL): شروع تمرکز */}
          <button
            id="dashboard-secondary-focus-btn"
            type="button"
            onClick={() => setActiveView('pomodoro')}
            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm dark:bg-[#161a2e] dark:hover:bg-[#1e233d] dark:text-slate-200 dark:border-[#2a3456]"
          >
            <Timer className="w-4 h-4 text-[#8B3DFF] dark:text-slate-300" />
            <span>شروع تمرکز</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 4 SUMMARY METRIC CARDS (2x2 Grid strictly matching screenshot colors and layout) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {/* Card 1 (Top-Right in RTL): وظایف امروز */}
        <div
          onClick={() => setActiveView('tasks')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0d1222] border border-[#e2e7f6] dark:border-[#182238] hover:border-purple-500/40 dark:hover:border-purple-500/40 transition cursor-pointer group flex flex-col justify-between shadow-sm min-h-[110px]"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-300 mb-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">وظایف امروز</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#F0E8FF] border border-[#E2E8F0] text-[#8B3DFF] dark:bg-purple-950/70 dark:border-purple-800/50 dark:text-[#c084fc] flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 my-1 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold">
            <span className="text-purple-400">•</span>
            <span>
              {settings.persianDigits ? toPersianDigits(completedTodayTasks.length) : completedTodayTasks.length} از {settings.persianDigits ? toPersianDigits(todayTasks.length) : todayTasks.length}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-[#182035] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#7059f6] dark:bg-[#a855f7] h-full rounded-full transition-all duration-500"
              style={{
                width: `${todayTasks.length > 0 ? (completedTodayTasks.length / todayTasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card 2 (Top-Left in RTL): رویدادها */}
        <div
          onClick={() => setActiveView('calendar')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0d1222] border border-[#e2e7f6] dark:border-[#182238] hover:border-blue-500/40 dark:hover:border-indigo-500/40 transition cursor-pointer group flex flex-col justify-between shadow-sm min-h-[110px]"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-300 mb-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">رویدادها</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#3B82F6] dark:bg-indigo-950/70 dark:border-indigo-800/50 dark:text-[#818cf8] flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold truncate">
              <span className="text-indigo-400">•</span>
              <span>
                {todayEvents.length > 0
                  ? `${settings.persianDigits ? toPersianDigits(todayEvents.length) : todayEvents.length} برنامه امروز`
                  : `${settings.persianDigits ? toPersianDigits(0) : '0'} برنامه امروز`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {todayEvents.length > 0 ? `اولین: ${todayEvents[0].startTime}` : 'بدون جلسه کاری'}
            </p>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-[#182035] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#3B82F6] dark:bg-[#3b82f6] h-full rounded-full transition-all duration-500"
              style={{
                width: `${todayEvents.length > 0 ? 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3 (Bottom-Right in RTL): تمرکز امروز */}
        <div
          onClick={() => setActiveView('pomodoro')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0d1222] border border-[#e2e7f6] dark:border-[#182238] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition cursor-pointer group flex flex-col justify-between shadow-sm min-h-[110px]"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-300 mb-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">تمرکز امروز</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#10B981] dark:bg-emerald-950/70 dark:border-emerald-800/50 dark:text-[#34d399] flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block">
              {settings.persianDigits ? toPersianDigits(focusTimeDisplay) : focusTimeDisplay}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              • {settings.persianDigits ? toPersianDigits(todayPomodoros.length) : todayPomodoros.length} سشن تمرکز
            </p>
          </div>
        </div>

        {/* Card 4 (Bottom-Left in RTL): عادت‌ها */}
        <div
          onClick={() => setActiveView('habits')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0d1222] border border-[#e2e7f6] dark:border-[#182238] hover:border-amber-500/40 dark:hover:border-amber-500/40 transition cursor-pointer group flex flex-col justify-between shadow-sm min-h-[110px]"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-300 mb-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">عادت‌ها</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#F59E0B] dark:bg-amber-950/70 dark:border-amber-800/50 dark:text-[#fb923c] flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 my-1 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold">
            <span className="text-amber-400">•</span>
            <span>
              {settings.persianDigits ? toPersianDigits(todayHabitsDoneCount) : todayHabitsDoneCount} از {settings.persianDigits ? toPersianDigits(allHabits.length) : allHabits.length}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-[#182035] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#F59E0B] dark:bg-[#f59e0b] h-full rounded-full transition-all duration-500"
              style={{
                width: `${allHabits.length > 0 ? (todayHabitsDoneCount / allHabits.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS BAR (دسترسی و ثبت سریع - matching screenshot layout) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0d1222] border border-[#e2e7f6] dark:border-[#182238] shadow-sm">
        <div className="flex items-center justify-end mb-3">
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>دسترسی و ثبت سریع</span>
            <Zap className="w-4 h-4 text-[#7059f6] dark:text-[#c084fc]" />
          </span>
        </div>

        {/* 6 Grid items in 2 rows of 3 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {/* Row 1, Col 1 (Right in RTL): + وظیفه */}
          <button
            type="button"
            onClick={() => openQuickAdd('task')}
            className="p-2 sm:p-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E9D5FF]/80 hover:border-purple-400 dark:bg-[#12182b] dark:hover:bg-[#182039] dark:border-[#1e2844] dark:hover:border-purple-500/50 flex items-center justify-between gap-1.5 transition cursor-pointer group active:scale-95"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">+ وظیفه</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#F0E8FF] border border-[#DDD6FE] text-[#8B3DFF] dark:bg-purple-950/60 dark:border-purple-800/40 dark:text-[#c084fc] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Row 1, Col 2 (Middle in RTL): + رویداد */}
          <button
            type="button"
            onClick={() => openQuickAdd('event')}
            className="p-2 sm:p-2.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE]/80 hover:border-blue-400 dark:bg-[#12182b] dark:hover:bg-[#182039] dark:border-[#1e2844] dark:hover:border-blue-500/50 flex items-center justify-between gap-1.5 transition cursor-pointer group active:scale-95"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">+ رویداد</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#DBEAFE] border border-[#BFDBFE] text-[#3B82F6] dark:bg-indigo-950/60 dark:border-indigo-800/40 dark:text-[#818cf8] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Row 1, Col 3 (Left in RTL): + پروژه */}
          <button
            type="button"
            onClick={() => openQuickAdd('project')}
            className="p-2 sm:p-2.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE]/80 hover:border-blue-400 dark:bg-[#12182b] dark:hover:bg-[#182039] dark:border-[#1e2844] dark:hover:border-blue-500/50 flex items-center justify-between gap-1.5 transition cursor-pointer group active:scale-95"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">+ پروژه</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#DBEAFE] border border-[#BFDBFE] text-[#3B82F6] dark:bg-blue-950/60 dark:border-blue-800/40 dark:text-[#60a5fa] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Row 2, Col 1 (Right in RTL): + هدف */}
          <button
            type="button"
            onClick={() => openQuickAdd('goal')}
            className="p-2 sm:p-2.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0]/80 hover:border-emerald-400 dark:bg-[#12182b] dark:hover:bg-[#182039] dark:border-[#1e2844] dark:hover:border-emerald-500/50 flex items-center justify-between gap-1.5 transition cursor-pointer group active:scale-95"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">+ هدف</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#D1FAE5] border border-[#A7F3D0] text-[#10B981] dark:bg-emerald-950/60 dark:border-emerald-800/40 dark:text-[#34d399] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Target className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Row 2, Col 2 (Middle in RTL): + یادداشت */}
          <button
            type="button"
            onClick={() => openQuickAdd('note')}
            className="p-2 sm:p-2.5 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A]/80 hover:border-amber-400 dark:bg-[#12182b] dark:hover:bg-[#182039] dark:border-[#1e2844] dark:hover:border-amber-500/50 flex items-center justify-between gap-1.5 transition cursor-pointer group active:scale-95"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">+ یادداشت</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#F59E0B] dark:bg-amber-950/60 dark:border-amber-800/40 dark:text-[#fbbf24] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Row 2, Col 3 (Left in RTL): + عادت */}
          <button
            type="button"
            onClick={() => setIsHabitModalOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3]/80 hover:border-rose-400 dark:bg-[#12182b] dark:hover:bg-[#182039] dark:border-[#1e2844] dark:hover:border-rose-500/50 flex items-center justify-between gap-1.5 transition cursor-pointer group active:scale-95"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">+ عادت</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FFE4E6] border border-[#FECDD3] text-[#F43F5E] dark:bg-rose-950/60 dark:border-rose-800/40 dark:text-[#f43f5e] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Dedicated Clean Habit Create Modal */}
      <HabitCreateModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
      />
    </div>
  );
};
