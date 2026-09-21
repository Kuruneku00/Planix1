import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatToJalali, toPersianDigits } from '../../utils/jalali';
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
  X,
  Check,
  Compass,
  ArrowRight,
  HelpCircle,
  Play,
  Sun,
  Bell,
  Search,
  LayoutGrid,
  Menu,
} from 'lucide-react';

interface DashboardVisualGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onStartStepTour?: () => void;
}

export const DashboardVisualGuide: React.FC<DashboardVisualGuideProps> = ({
  isOpen,
  onClose,
  onStartStepTour,
}) => {
  const { settings, openQuickAdd, setActiveView } = useApp();
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  if (!isOpen) return null;

  const todayJalali = formatToJalali(new Date(), 'full', settings.persianDigits);

  return (
    <div
      id="dashboard-visual-guide-modal"
      className="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 text-slate-100 animate-in fade-in duration-300"
      dir="rtl"
    >
      {/* Top Header Bar for the Guide */}
      <div className="w-full max-w-5xl sticky top-2 z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-2xl shadow-purple-950/50 backdrop-blur-xl mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-950 border border-purple-400/40 shrink-0">
            <img
              src="/mascot.png"
              alt="ممد راهنما"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-purple-300">
                نقشه راهنمای تصویری Planix
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/50 font-bold hidden sm:inline">
                راهنمای جامع
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              توضیحات و عملکرد هر بخش از داشبورد را در یک نگاه بررسی کنید
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onStartStepTour && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartStepTour();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">آموزش مرحله‌به‌مرحله</span>
              <span className="sm:hidden">مرحله‌ای</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>متوجه شدم</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Area matching the exact user screenshot mockup */}
      <div className="w-full max-w-5xl relative pb-12">
        {/* Outer Frame with side annotations on desktop */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* ========================================================
              LEFT COLUMN ANNOTATIONS (on lg screens)
              1. ممد راهنما
              2. رویدادها
              3. عادت‌ها
              4. روباه انگیزشی
              ======================================================== */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-14 pt-8 text-right pr-2">
            
            {/* 1. ممد راهنما */}
            <div
              onMouseEnter={() => setActiveHighlight('mascot-guide')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'mascot-guide' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-purple-300">ممد راهنما</span>
                {/* Curved Arrow pointing to the top fox banner */}
                <svg width="32" height="28" viewBox="0 0 32 28" fill="none" className="text-purple-400">
                  <path d="M 4 8 C 16 8, 26 14, 28 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 23 21 L 28 25 L 31 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                همیشه در کنار توست و با پیام‌های انگیزشی و دوستانه، برنامه‌هات را بهتر پیش می‌برد.
              </p>
            </div>

            {/* 2. رویدادها */}
            <div
              onMouseEnter={() => setActiveHighlight('events-card')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'events-card' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-purple-300">رویدادها</span>
                {/* Curved Arrow pointing right to Events card */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 4 6 C 16 6, 24 14, 28 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 22 20 L 29 21 L 27 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                مهم‌ترین رویدادها و قرارهای شما.
              </p>
            </div>

            {/* 3. عادت‌ها */}
            <div
              onMouseEnter={() => setActiveHighlight('habits-card')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'habits-card' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-purple-300">عادت‌ها</span>
                {/* Curved Arrow pointing right to Habits card */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 4 6 C 16 6, 24 14, 28 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 22 20 L 29 21 L 27 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                عادت‌های مثبت برای سبک زندگی بهتر.
              </p>
            </div>

            {/* 4. روباه انگیزشی */}
            <div
              onMouseEnter={() => setActiveHighlight('mascot-speech')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'mascot-speech' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-purple-300">روباه انگیزشی</span>
                {/* Curved Arrow pointing down-right */}
                <svg width="32" height="28" viewBox="0 0 32 28" fill="none" className="text-purple-400">
                  <path d="M 4 6 C 14 6, 24 16, 26 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 20 22 L 27 25 L 28 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                همیشه همراهت است و بهت یادآوری می‌کنه که می‌تونی!
              </p>
            </div>

          </div>

          {/* ========================================================
              CENTER COLUMN: THE ACTUAL DASHBOARD MOCKUP SCREEN
              Styled exactly like the uploaded screenshot
              ======================================================== */}
          <div className="lg:col-span-6 w-full rounded-3xl bg-slate-950 border border-purple-500/40 shadow-2xl p-3.5 sm:p-5 space-y-4">
            
            {/* Header Preview */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <button type="button" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Sun className="w-4 h-4 text-amber-400" />
                </button>
                <button type="button" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Bell className="w-4 h-4" />
                </button>
                <button type="button" className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </button>
                <button type="button" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100">داشبورد اصلی</span>
                <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Menu className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Welcome Banner with Fox Mascot + Speech Bubble */}
            <div
              id="guide-welcome-banner"
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border p-3.5 sm:p-4.5 transition-all duration-300 ${
                activeHighlight === 'mascot-guide' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.01]' : 'border-purple-700/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                
                {/* Fox Character + Speech Bubble on Left */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-950 border-2 border-purple-500/50 shadow-md shrink-0">
                    <img
                      src="/mascot.png"
                      alt="ممد"
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Speech Bubble */}
                  <div className="relative bg-purple-950/80 border border-purple-500/40 p-2.5 rounded-2xl text-[11px] sm:text-xs text-purple-200 leading-relaxed max-w-[210px] shadow-lg">
                    سلام! به برنامه‌ات خوش اومدی! هر روز یه قدم به سمت هدف‌هات نزدیک‌تر می‌شی.
                    <span className="absolute -right-1.5 top-5 w-3 h-3 bg-purple-950 border-r border-b border-purple-500/40 rotate-45" />
                  </div>
                </div>

                {/* Right Side Info */}
                <div className="text-right w-full sm:w-auto">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 text-[10px] font-semibold mb-1 border border-purple-700/40">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span>{todayJalali}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-100">
                    سلام، {settings.userName || 'کاربر عزیز'}!
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    امروز، روز خوبی برای ساختن آینده‌ات است.
                  </p>
                </div>

              </div>
            </div>

            {/* Prominent Action Buttons Bar: "+ وظیفه جدید" and "شروع تمرکز" */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* شروع تمرکز */}
              <div
                className={`p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeHighlight === 'focus-btn' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.02]' : ''
                }`}
              >
                <Timer className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200">شروع تمرکز</span>
              </div>

              {/* + وظیفه جدید (Crisp, High-Contrast Vibrant Purple) */}
              <div
                className={`p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 text-white cursor-pointer ${
                  activeHighlight === 'new-task-btn' ? 'ring-4 ring-purple-400 scale-[1.02]' : ''
                }`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="text-xs font-black tracking-wide">وظیفه جدید</span>
              </div>
            </div>

            {/* 4 Metric Summary Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* وظایف امروز */}
              <div
                className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between transition-all ${
                  activeHighlight === 'tasks-card' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">وظایف امروز</span>
                  <div className="w-7 h-7 rounded-xl bg-purple-950/70 border border-purple-700/40 text-purple-400 flex items-center justify-center">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-lg font-black text-slate-100">
                  ۰ <span className="text-[11px] text-slate-400 font-normal">از ۰</span>
                </div>
                <span className="text-[10px] text-purple-400 font-medium mt-1">مشاهده جزئیات &gt;</span>
              </div>

              {/* رویدادها */}
              <div
                className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between transition-all ${
                  activeHighlight === 'events-card' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">رویدادها</span>
                  <div className="w-7 h-7 rounded-xl bg-indigo-950/70 border border-indigo-700/40 text-indigo-400 flex items-center justify-center">
                    <CalendarIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-300">بدون برنامه امروز</div>
                <span className="text-[10px] text-indigo-400 font-medium mt-1">مشاهده جزئیات &gt;</span>
              </div>

              {/* تمرکز امروز */}
              <div
                className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between transition-all ${
                  activeHighlight === 'focus-card' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">تمرکز امروز</span>
                  <div className="w-7 h-7 rounded-xl bg-emerald-950/70 border border-emerald-700/40 text-emerald-400 flex items-center justify-center">
                    <Timer className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-base font-black text-slate-100">
                  ۰ <span className="text-[11px] text-slate-400 font-normal">دقیقه</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium mt-1">بیشتر تمرکز &gt;</span>
              </div>

              {/* عادت‌ها */}
              <div
                className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between transition-all ${
                  activeHighlight === 'habits-card' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">عادت‌ها</span>
                  <div className="w-7 h-7 rounded-xl bg-amber-950/70 border border-amber-700/40 text-amber-400 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-lg font-black text-slate-100">
                  ۰ <span className="text-[11px] text-slate-400 font-normal">از ۰</span>
                </div>
                <span className="text-[10px] text-amber-400 font-medium mt-1">مشاهده جزئیات &gt;</span>
              </div>
            </div>

            {/* Quick Access Card */}
            <div
              className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 transition-all ${
                activeHighlight === 'quick-access' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.01]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  دسترسی و ثبت سریع
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200">
                  <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ وظیفه</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200">
                  <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>+ رویداد</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200">
                  <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
                  <span>+ پروژه</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ هدف</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ یادداشت</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>+ عادت</span>
                </div>
              </div>
            </div>

            {/* Bottom 3D Mascot Figure + Speech Bubble (as in image) */}
            <div
              className={`p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-900/50 flex items-center justify-between gap-3 transition-all ${
                activeHighlight === 'mascot-speech' ? 'border-purple-400 ring-2 ring-purple-500/40 scale-[1.01]' : ''
              }`}
            >
              <div className="relative flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-950 border-2 border-amber-500/60 shadow-lg shadow-amber-950/40 shrink-0">
                  <img
                    src="/mascot.png"
                    alt="روباه انگیزشی"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-purple-950/90 border border-purple-500/50 px-3 py-1.5 rounded-2xl text-[11px] font-bold text-purple-200 shadow-md">
                  همه چیز از اینجا شروع می‌شه! تو می‌تونی!
                </div>
              </div>
            </div>

            {/* Bottom Navigation Mockup */}
            <div
              className={`pt-2 border-t border-slate-800/80 flex items-center justify-around text-center transition-all ${
                activeHighlight === 'bottom-nav' ? 'ring-2 ring-purple-500/40 rounded-2xl p-1 bg-purple-950/30' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-0.5 text-purple-400">
                <LayoutGrid className="w-4 h-4" />
                <span className="text-[10px] font-bold">داشبورد</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 text-slate-400">
                <CheckSquare className="w-4 h-4" />
                <span className="text-[10px]">وظایف</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center -mt-2 shadow-md">
                <Plus className="w-4 h-4 font-bold" />
              </div>
              <div className="flex flex-col items-center gap-0.5 text-slate-400">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-[10px]">تقویم</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 text-slate-400">
                <Menu className="w-4 h-4" />
                <span className="text-[10px]">بیشتر</span>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN ANNOTATIONS (on lg screens)
              1. شروع تمرکز
              2. وظیفه جدید
              3. وظایف امروز
              4. تمرکز امروز
              5. دسترسی سریع
              6. نوار ناوبری
              ======================================================== */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-9 pt-12 text-right pl-2">
            
            {/* 1. شروع تمرکز */}
            <div
              onMouseEnter={() => setActiveHighlight('focus-btn')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'focus-btn' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {/* Curved Arrow pointing left */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 28 6 C 16 6, 8 14, 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 10 20 L 3 21 L 5 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-extrabold text-purple-300">شروع تمرکز</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                برای تمرکز روی کارهای مهمت و بدون حواس‌پرتی.
              </p>
            </div>

            {/* 2. وظیفه جدید */}
            <div
              onMouseEnter={() => setActiveHighlight('new-task-btn')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'new-task-btn' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {/* Curved Arrow pointing left to New Task button */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 28 6 C 16 6, 8 14, 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 10 20 L 3 21 L 5 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-extrabold text-purple-300">وظیفه جدید</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                افزودن سریع وظایف و برنامه‌های روزانه.
              </p>
            </div>

            {/* 3. وظایف امروز */}
            <div
              onMouseEnter={() => setActiveHighlight('tasks-card')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'tasks-card' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {/* Curved Arrow */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 28 6 C 16 6, 8 14, 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 10 20 L 3 21 L 5 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-extrabold text-purple-300">وظایف امروز</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                لیست کارهایی که امروز باید انجام شوند.
              </p>
            </div>

            {/* 4. تمرکز امروز */}
            <div
              onMouseEnter={() => setActiveHighlight('focus-card')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'focus-card' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {/* Curved Arrow */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 28 6 C 16 6, 8 14, 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 10 20 L 3 21 L 5 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-extrabold text-purple-300">تمرکز امروز</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                مدت زمان تمرکز روی کارهای مهم.
              </p>
            </div>

            {/* 5. دسترسی سریع */}
            <div
              onMouseEnter={() => setActiveHighlight('quick-access')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'quick-access' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {/* Curved Arrow */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 28 6 C 16 6, 8 14, 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 10 20 L 3 21 L 5 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-extrabold text-purple-300">دسترسی سریع</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                به همه بخش‌ها با یک لمس.
              </p>
            </div>

            {/* 6. نوار ناوبری */}
            <div
              onMouseEnter={() => setActiveHighlight('bottom-nav')}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`group transition-all duration-300 p-3 rounded-2xl bg-slate-900/80 border ${
                activeHighlight === 'bottom-nav' ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-900/40 scale-102' : 'border-purple-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {/* Curved Arrow */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-purple-400">
                  <path d="M 28 6 C 16 6, 8 14, 4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 10 20 L 3 21 L 5 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-extrabold text-purple-300">نوار ناوبری</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                دسترسی سریع به بخش‌های اصلی برنامه.
              </p>
            </div>

          </div>

        </div>

        {/* Mobile / Tablet Accordion of Annotations (for smaller screens) */}
        <div className="lg:hidden mt-4 space-y-2">
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-center">
            <span className="text-xs font-bold text-purple-300">
              راهنماهای بخش‌ها (روی هر بخش برای مشاهده ضربه بزنید)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'mascot-guide', title: 'ممد راهنما', desc: 'همیشه در کنار توست و با پیام‌های انگیزشی و دوستانه، برنامه‌هات را بهتر پیش می‌برد.' },
              { id: 'focus-btn', title: 'شروع تمرکز', desc: 'برای تمرکز روی کارهای مهمت و بدون حواس‌پرتی.' },
              { id: 'new-task-btn', title: 'وظیفه جدید', desc: 'افزودن سریع وظایف و برنامه‌های روزانه.' },
              { id: 'tasks-card', title: 'وظایف امروز', desc: 'لیست کارهایی که امروز باید انجام شوند.' },
              { id: 'events-card', title: 'رویدادها', desc: 'مهم‌ترین رویدادها و قرارهای شما.' },
              { id: 'focus-card', title: 'تمرکز امروز', desc: 'مدت زمان تمرکز روی کارهای مهم.' },
              { id: 'habits-card', title: 'عادت‌ها', desc: 'عادت‌های مثبت برای سبک زندگی بهتر.' },
              { id: 'quick-access', title: 'دسترسی سریع', desc: 'به همه بخش‌ها با یک لمس.' },
              { id: 'mascot-speech', title: 'روباه انگیزشی', desc: 'همیشه همراهت است و بهت یادآوری می‌کنه که می‌تونی!' },
              { id: 'bottom-nav', title: 'نوار ناوبری', desc: 'دسترسی سریع به بخش‌های اصلی برنامه.' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveHighlight(item.id)}
                className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                  activeHighlight === item.id ? 'bg-purple-950/80 border-purple-400 shadow-md' : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Done Button */}
        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-950/60 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>متوجه شدم و آماده‌ام!</span>
          </button>
        </div>

      </div>
    </div>
  );
};
