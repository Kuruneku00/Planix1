import React from 'react';
import { ActiveView } from '../../types';
import {
  Sparkles,
  CheckSquare,
  Calendar as CalendarIcon,
  Timer,
  Flame,
  Plus,
  Zap,
  FolderKanban,
  Target,
  FileText,
  Search,
  Bell,
  Clock,
  Play,
  Check,
  Tag,
  Lock,
  Compass,
} from 'lucide-react';

interface SectionDiagramMockupProps {
  viewKey: ActiveView;
  activeCalloutId?: string | null;
  onSelectCallout?: (calloutId: string) => void;
  isLight?: boolean;
}

export const SectionDiagramMockup: React.FC<SectionDiagramMockupProps> = ({
  viewKey,
  activeCalloutId,
  onSelectCallout,
  isLight = false,
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl p-3 sm:p-3.5 select-none mx-auto transition-colors ${
        isLight
          ? 'bg-white border border-[#e2e7f6] text-slate-800 shadow-sm'
          : 'bg-[#131722]/90 border border-slate-800/80 text-slate-100'
      }`}
      dir="rtl"
    >
      
      {/* Visual Window Bar */}
      <div
        className={`flex items-center justify-between pb-1 mb-1.5 border-b text-[10px] ${
          isLight ? 'border-[#e2e7f6] text-slate-500' : 'border-slate-800/80 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          <span className={`mr-1.5 font-mono text-[9px] ${isLight ? 'text-[#7059f6]' : 'text-purple-300'}`}>
            planix://{viewKey}
          </span>
        </div>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border ${
            isLight
              ? 'bg-[#edf0ff] text-[#4f3ff5] border-[#dce2fc]'
              : 'bg-purple-950/80 text-purple-300 border-purple-800/50'
          }`}
        >
          نمای شماتیک بخش
        </span>
      </div>

      {/* SVG Overlay for Curved Glowing Purple Arrows and Connection Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="purple-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="purple-arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill="#c084fc" />
          </marker>
        </defs>
      </svg>

      {/* 1. DASHBOARD MOCKUP */}
      {viewKey === 'dashboard' && (
        <div className="space-y-2.5 relative text-xs">
          {/* Row 1: Header with date, greeting and mascot */}
          <div className="flex items-center justify-between pb-1">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] cursor-pointer border ${
                isLight
                  ? 'bg-[#edf0ff] border-[#dce2fc] text-[#4f3ff5]'
                  : 'bg-[#1e2333] border-slate-700/60 text-slate-300 hover:border-purple-500/40'
              }`}
            >
              <span className="text-xs">🦊</span>
              <span>ممد راهنما</span>
              <span className={`text-[10px] mr-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>‹</span>
            </div>
            <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>سه شنبه ۲۴ شهریور ۱۴۰۵</span>
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User greeting */}
          <div className="text-right">
            <h4 className={`text-sm sm:text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
              سلام کاربر گرامی، روزت بخیر!
            </h4>
          </div>

          {/* Action Buttons: 2 large buttons (Start Focus & New Task) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Primary button: + وظیفه جدید */}
            <div
              className={`py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                isLight
                  ? 'bg-[#7059f6] text-white shadow-[#7059f6]/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/30'
              }`}
            >
              <span>+ وظیفه جدید</span>
            </div>
            {/* Secondary button: شروع تمرکز */}
            <div
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between px-3 cursor-pointer ${
                isLight
                  ? 'bg-white border-[#dce2fc] text-[#4f3ff5]'
                  : 'bg-[#1e2333] border-slate-700/80 text-slate-200'
              }`}
            >
              <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>‹</span>
              <div className="flex items-center gap-1.5">
                <span>شروع تمرکز</span>
                <Timer className={`w-3.5 h-3.5 ${isLight ? 'text-[#7059f6]' : 'text-slate-300'}`} />
              </div>
            </div>
          </div>

          {/* Two Sub-buttons: وظایف امروز / رویدادها */}
          <div className="grid grid-cols-2 gap-2.5">
            <div
              className={`py-2 px-3 rounded-xl border text-[11px] font-semibold flex items-center justify-between cursor-pointer ${
                isLight
                  ? 'bg-[#f8f9fe] border-[#e2e6f4] text-slate-700'
                  : 'bg-[#181c28] border-slate-800/80 text-slate-300'
              }`}
            >
              <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>‹</span>
              <div className="flex items-center gap-1.5">
                <span>وظایف امروز</span>
                <CheckSquare className={`w-3.5 h-3.5 ${isLight ? 'text-[#7059f6]' : 'text-purple-400'}`} />
              </div>
            </div>
            <div
              className={`py-2 px-3 rounded-xl border text-[11px] font-semibold flex items-center justify-between cursor-pointer ${
                isLight
                  ? 'bg-[#f8f9fe] border-[#e2e6f4] text-slate-700'
                  : 'bg-[#181c28] border-slate-800/80 text-slate-300'
              }`}
            >
              <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>‹</span>
              <div className="flex items-center gap-1.5">
                <span>رویدادها</span>
                <CalendarIcon className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-500' : 'text-indigo-400'}`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DAILY PLANNER MOCKUP */}
      {viewKey === 'daily_planner' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          {/* Day Selector & Progress with Badge 1 */}
          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-200">امروز: سه شنبه ۲۴ شهریور</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold">۷۵٪ پیشرفت</span>
            </div>
            <div className="text-[10px] text-slate-400">۶ بازه کاری</div>

            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          {/* Timeline Blocks with Badge 2 & 3 */}
          <div className="relative space-y-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            {/* Block 1 */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-950/50 border border-purple-700/40">
              <span className="text-[10px] font-mono text-purple-300 w-16">۰۸:۰۰ - ۰۹:۳۰</span>
              <div className="flex-1 text-right">
                <span className="text-xs font-bold text-slate-100 block">بررسی ایمیل‌ها و برنامه‌ریزی روزانه</span>
                <span className="text-[9px] text-purple-400">کارهای اولیه • اولویت بالا</span>
              </div>
              <CheckSquare className="w-4 h-4 text-purple-400" />
            </div>

            {/* Block 2 (Current Hour Active) */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-950/60 border-2 border-indigo-500/60 shadow-md">
              <span className="text-[10px] font-mono text-indigo-300 w-16">۱۰:۰۰ - ۱۲:۰۰</span>
              <div className="flex-1 text-right">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-slate-100">کار عمیق: طراحی گزارش مالی فصلی</span>
                </div>
                <span className="text-[9px] text-indigo-300">تمرکز بدون وقفه • پروژه الف</span>
              </div>
              <Timer className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Block 3 */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-[10px] font-mono text-slate-400 w-16">۱۳:۳۰ - ۱۴:۳۰</span>
              <div className="flex-1 text-right">
                <span className="text-xs font-bold text-slate-200 block">جلسه آنلاین با تیم فنی</span>
                <span className="text-[9px] text-slate-400">جلسات و هماهنگی</span>
              </div>
              <CalendarIcon className="w-4 h-4 text-slate-400" />
            </div>

            <div className="absolute top-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute top-1/2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
          </div>

          {/* Add block button with Badge 4 */}
          <div className="relative">
            <button className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن بازه زمانی جدید</span>
            </button>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 3. WEEKLY PLANNER MOCKUP */}
      {viewKey === 'weekly_planner' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          {/* Week Header with Badge 1 */}
          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-200">هفته چهارم شهریور ۱۴۰۵</span>
            <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full">۲۱ وظیفه برنامه‌ریزی‌شده</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          {/* Weekly Priority Box with Badge 3 */}
          <div className="relative p-2 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <span className="text-[10px] font-bold text-amber-300 block mb-1">🎯 اولویت‌های اصلی این هفته:</span>
            <div className="text-[10px] text-slate-300 space-y-0.5">
              <div>• نهایی‌سازی پروپوزال پروژه الف</div>
              <div>• ۳ جلسه تمرین ورزشی</div>
            </div>
            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
          </div>

          {/* 7 Column Preview with Badge 2 & 4 */}
          <div className="relative grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'].map((day, idx) => (
              <div key={day} className={`p-1.5 rounded-lg border text-center ${idx === 3 ? 'bg-purple-950/60 border-purple-500' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[9px] font-bold text-slate-300 block">{day}</span>
                <span className="text-[10px] font-black text-purple-300">{idx + 21}</span>
                <div className="mt-1 space-y-1">
                  <div className="w-full bg-purple-800/40 h-1.5 rounded-sm" />
                  <div className="w-2/3 mx-auto bg-slate-700 h-1 rounded-sm" />
                </div>
              </div>
            ))}
            <div className="absolute top-1/2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 4. TASKS MOCKUP */}
      {viewKey === 'tasks' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          {/* Filters Bar with Badge 1 */}
          <div className="relative flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold">همه (۸)</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">امروز (۳)</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-rose-300 text-[10px]">فوری (۲)</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 text-[10px]">انجام‌شده</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          {/* Task Cards with Badges 2 & 3 */}
          <div className="relative space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-rose-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-rose-500 flex items-center justify-center text-transparent">✓</div>
                <div>
                  <span className="text-xs font-bold text-slate-100 block">ارسال نسخه نهایی قرارداد به مشتری</span>
                  <span className="text-[9px] text-slate-400">موعد: امروز ۱۸:۰۰ • پروژه حقوقی</span>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-800/50">
                فوری ⚡
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center text-xs">✓</div>
                <div>
                  <span className="text-xs font-bold text-slate-400 line-through block">مطالعه ۲۰ صفحه از کتاب رهبری</span>
                  <span className="text-[9px] text-slate-500">تکمیل شده ساعت ۰۹:۱۵</span>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold">
                عادی
              </span>
            </div>

            <div className="absolute top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
          </div>

          {/* Add Task Button with Badge 4 */}
          <div className="relative">
            <button className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>+ ایجاد وظیفه جدید</span>
            </button>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 5. PROJECTS MOCKUP */}
      {viewKey === 'projects' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-3 rounded-xl bg-slate-900 border border-blue-500/30">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-100">بازطراحی اپلیکیشن و وب‌سایت</h4>
                <span className="text-[10px] text-slate-400">۵ وظیفه از ۸ وظیفه تکمیل شده</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-800">
                در حال انجام
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[65%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>پیشرفت: ۶۵٪</span>
              <span>ددلاین: ۲۵ مهر</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-300 block">وظایف زیرمجموعه پروژه:</span>
            <div className="text-[10px] text-slate-300 flex items-center justify-between p-1.5 rounded bg-slate-800/60">
              <span>• طراحی وایرفریم‌ها</span>
              <span className="text-emerald-400 font-bold">✓ انجام شد</span>
            </div>
            <div className="text-[10px] text-slate-300 flex items-center justify-between p-1.5 rounded bg-slate-800/60">
              <span>• کدنویسی پنل داشبورد</span>
              <span className="text-amber-400 font-bold">در حال اجرا</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 6. CALENDAR MOCKUP */}
      {viewKey === 'calendar' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-200">شهریور ۱۴۰۵ (سپتامبر ۲۰۲۶)</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full font-bold">امروز</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          <div className="relative grid grid-cols-7 gap-1 text-center text-[10px] p-2 rounded-xl bg-slate-900 border border-slate-800">
            {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((d) => (
              <span key={d} className="font-bold text-slate-500">{d}</span>
            ))}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => (
              <div key={day} className={`p-1 rounded ${day === 24 ? 'bg-purple-600 text-white font-bold ring-1 ring-purple-300' : 'text-slate-300'}`}>
                {day}
                {day % 5 === 0 && <span className="w-1 h-1 rounded-full bg-amber-400 block mx-auto mt-0.5" />}
              </div>
            ))}
            <div className="absolute top-1/2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-300 block mb-1">برنامه روز ۲۴ شهریور:</span>
            <div className="text-[10px] text-slate-200 flex justify-between p-1.5 rounded bg-indigo-950/50 border border-indigo-800/40">
              <span>جلسه استراتژی محتوا</span>
              <span className="font-mono text-indigo-300">۱۴:۰۰ - ۱۵:۰۰</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 7. TIME MANAGEMENT MOCKUP */}
      {viewKey === 'time_management' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-800/40">
              <span className="text-[10px] text-slate-400 block">ساعات کار عمیق</span>
              <span className="text-base font-black text-purple-300">۴ ساعت و ۲۰ دقیقه</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-800/40">
              <span className="text-[10px] text-slate-400 block">شاخص بهره‌وری</span>
              <span className="text-base font-black text-emerald-400">۸۸٪ عالی</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          <div className="relative p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-around">
            <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-indigo-500 border-r-emerald-500 flex items-center justify-center text-[10px] font-bold">
              توزیع زمان
            </div>
            <div className="text-[10px] space-y-1">
              <div className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>کار فنی: ۵۰٪</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>جلسات: ۳۰٪</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>مطالعه: ۲۰٪</span>
              </div>
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 8. GOALS MOCKUP */}
      {viewKey === 'goals' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-3 rounded-xl bg-slate-900 border border-emerald-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-100">تسلط به زبان تخصصی و آیلتس</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-bold">تارگت فصلی</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[70%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>۷۰ از ۱۰۰ درس گذرانده‌شده</span>
              <span>۷۰٪ تحقق</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 9. HABITS MOCKUP */}
      {viewKey === 'habits' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-3 rounded-xl bg-slate-900 border border-amber-500/30">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-100">ورزش صبحگاهی ۲۰ دقیقه</span>
              </div>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full font-bold">🔥 ۷ روز پیاپی</span>
            </div>
            {/* 7 circles */}
            <div className="grid grid-cols-7 gap-1.5 text-center mt-2">
              {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((d, i) => (
                <div key={d} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400">{d}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    {i < 5 ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 10. POMODORO MOCKUP */}
      {viewKey === 'pomodoro' && (
        <div className="space-y-1.5 sm:space-y-2 relative text-center">
          <div className="relative p-4 rounded-xl bg-slate-900 border border-purple-500/40 flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full border-4 border-purple-500/30 border-t-purple-500 flex flex-col items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-2xl font-black font-mono text-purple-200">۲۵:۰۰</span>
              <span className="text-[9px] text-purple-400">تمرکز عمیق</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-black text-xs shadow-md">
                شروع تمرکز ▶
              </button>
              <button className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                ریست
              </button>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 11. NOTES MOCKUP */}
      {viewKey === 'notes' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-500">جستجو در یادداشت‌ها و برچسب‌ها...</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-amber-500/50">
              <span className="text-[10px] text-amber-300 font-bold block">📌 ایده‌های نوآورانه محصول</span>
              <p className="text-[9px] text-slate-300 mt-1 line-clamp-2">اضافه کردن هوش مصنوعی برای دسته‌بندی خودکار کارهای روزمره...</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-200 font-bold block">خلاصه کتاب اثر مرکب</span>
              <p className="text-[9px] text-slate-400 mt-1 line-clamp-2">موفقیت حاصل تصمیم‌های کوچک و هوشمندانه‌ای است که...</p>
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 12. REMINDERS MOCKUP */}
      {viewKey === 'reminders' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-xs font-bold text-slate-100 block">مصرف مکمل‌های غذایی و آب</span>
                <span className="text-[9px] text-slate-400">تکرار هر روز ساعت ۰۸:۳۰ صبح</span>
              </div>
            </div>
            <div className="w-8 h-4 rounded-full bg-purple-600 p-0.5 flex items-center justify-end">
              <span className="w-3 h-3 rounded-full bg-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 13. REPORTS MOCKUP */}
      {viewKey === 'reports' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-700/50 text-center">
              <span className="text-[9px] text-purple-300 block">وظایف تکمیل‌شده</span>
              <span className="text-sm font-black text-white">۱۴</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-400 block">نرخ بهره‌وری</span>
              <span className="text-sm font-black text-emerald-400">۸۵٪</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-400 block">دقایق تمرکز</span>
              <span className="text-sm font-black text-indigo-400">۳۲۰</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          <div className="relative p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-300 block mb-2">توزیع تمرکز در ۷ روز هفته (دقیقه)</span>
            <div className="flex items-end justify-between h-14 pt-2 gap-1.5 px-1">
              <div className="flex-1 bg-purple-500/80 rounded-t h-[70%]" title="ش" />
              <div className="flex-1 bg-purple-500/80 rounded-t h-[90%]" title="ی" />
              <div className="flex-1 bg-purple-500/80 rounded-t h-[60%]" title="د" />
              <div className="flex-1 bg-purple-500/80 rounded-t h-[100%]" title="س" />
              <div className="flex-1 bg-purple-500/80 rounded-t h-[80%]" title="چ" />
              <div className="flex-1 bg-purple-500/80 rounded-t h-[40%]" title="پ" />
              <div className="flex-1 bg-indigo-500/80 rounded-t h-[50%]" title="ج" />
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-300">سهم پروژه‌ها: کار (۶۰٪) • شخصی (۴۰٪)</span>
            <span className="text-[9px] text-purple-400 font-bold bg-purple-950/80 px-2 py-0.5 rounded-full">۷ روز اخیر</span>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 14. FILES MOCKUP */}
      {viewKey === 'files' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-500">جستجوی اسناد، PDF و فایل‌های پیوست...</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          <div className="relative p-3 rounded-xl border border-dashed border-purple-500/50 bg-purple-950/20 text-center">
            <span className="text-[10px] text-purple-300 font-bold block">برای بارگذاری، فایل را اینجا رها کنید</span>
            <span className="text-[8px] text-slate-400">یا برای انتخاب کلیک نمایید</span>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold">PDF</div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-200 block truncate">طرح_پروژه.pdf</span>
                <span className="text-[8px] text-slate-400">۱.۴ مگابایت</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">PNG</div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-200 block truncate">نمودار_جریان.png</span>
                <span className="text-[8px] text-slate-400">۴۲۰ کیلوبایت</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 15. TEMPLATES MOCKUP */}
      {viewKey === 'templates' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-2.5 rounded-xl bg-purple-950/60 border border-purple-600/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">روتین صبحگاهی پربازده</span>
              <span className="text-[9px] text-purple-300">۴ وظیفه زمان‌بندی‌شده • ۱۲۰ دقیقه</span>
            </div>
            <button className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold">
              اعمال روی امروز
            </button>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
          </div>

          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200 block">چک‌لیست پایان هفته</span>
              <span className="text-[9px] text-slate-400">مرور اهداف و تنظیم برنامه شنبه</span>
            </div>
            <button className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px]">
              پیش‌نمایش
            </button>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">ذخیره روزهای طلایی کاری به عنوان الگو</span>
            <button className="px-3 py-1.5 rounded-xl bg-slate-800 text-purple-400 text-xs font-bold border border-purple-500/30">
              + ساخت قالب جدید
            </button>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 16. SYNC MOCKUP */}
      {viewKey === 'sync' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-xs font-bold text-slate-100 block">وضعیت: کاملاً متصل و همگام</span>
                <span className="text-[9px] text-emerald-400">آخرین همگام‌سازی: ۲ دقیقه پیش</span>
              </div>
            </div>
            <button className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold">
              سینک فوری
            </button>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span>همگام‌سازی وظایف و تقویم</span>
              <span className="text-emerald-400 font-bold">فعال</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-300">
              <span>همگام‌سازی فایل‌های پیوست</span>
              <span className="text-emerald-400 font-bold">فعال</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 17. BACKUP MOCKUP */}
      {viewKey === 'backup' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative grid grid-cols-2 gap-2">
            <button className="p-3 rounded-xl bg-purple-950/60 border border-purple-600/50 text-center hover:bg-purple-900/60 transition">
              <span className="text-xs font-bold text-white block">دانلود بکاپ کامل (JSON)</span>
              <span className="text-[8px] text-purple-300 mt-0.5 block">خروجی ۱۰۰٪ آفلاین و امن</span>
            </button>
            <button className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center hover:bg-slate-800 transition">
              <span className="text-xs font-bold text-slate-200 block">بازگردانی فایل (Restore)</span>
              <span className="text-[8px] text-slate-400 mt-0.5 block">بارگذاری فایل بکاپ قبلی</span>
            </button>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-200 block">آخرین پشتیبان: ۱۴۰۳/۰۶/۲۸</span>
              <span className="text-[8px] text-slate-400">شامل ۶۴ وظیفه، ۸ پروژه و ۱۲ عادت</span>
            </div>
            <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full font-bold">موفق</span>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

      {/* 18. SETTINGS MOCKUP */}
      {viewKey === 'settings' && (
        <div className="space-y-1.5 sm:space-y-2 relative">
          <div className="relative grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-500 text-right">
              <span className="text-xs font-bold text-white block">تم تاریک (Dark)</span>
              <span className="text-[8px] text-purple-300">مخصوص شب و استراحت چشم</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-right opacity-80">
              <span className="text-xs font-bold text-slate-200 block">تم روشن (Light)</span>
              <span className="text-[8px] text-slate-400">کنتراست بالا در محیط پرنور</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۱
            </div>
            <div className="absolute top-1/2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۲
            </div>
          </div>

          <div className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200 block">ارقام فارسی و اعلان‌های صوتی</span>
              <span className="text-[9px] text-slate-400">۱۲۳۴۵۶۷۸۹۰ • زنگ ملایم پایان تمرکز</span>
            </div>
            <span className="text-[9px] text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full font-bold">فعال</span>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۳
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border border-purple-300 animate-pulse">
              ۴
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
