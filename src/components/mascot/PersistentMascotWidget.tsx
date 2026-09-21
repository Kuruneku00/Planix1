import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MascotAvatar } from './MascotAvatar';
import { MASCOT_INFO } from '../../data/mascotTourData';
import { VISUAL_TOUR_SECTIONS } from '../../data/visualTourData';
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  Compass,
  ArrowLeft,
  X,
  Plus,
  Flame,
  CheckSquare,
  Timer,
  CalendarDays,
  Target,
} from 'lucide-react';

// Practical quick actions and contextual guidance for Mamed
const VIEW_GUIDES: Record<
  string,
  {
    title: string;
    actionHint: string;
    quickActionLabel?: string;
    quickActionView?: string;
    tips: string[];
  }
> = {
  dashboard: {
    title: 'اتاق فرمان روزانه',
    actionHint: 'کارهای دارای اولویت بالا و وضعیت عادت‌های امروزت رو چک کن.',
    quickActionLabel: 'ثبت کار جدید',
    quickActionView: 'quick_add',
    tips: ['برای شروع، کارهای پرچالش رو در ۲ ساعت اول روز انجام بده.'],
  },
  tasks: {
    title: 'مدیریت و انجام کارها',
    actionHint: 'روی هر تسک کلیک کن تا جزییات یا چک‌لیست اون رو ببینی.',
    quickActionLabel: 'افزودن کار جدید',
    quickActionView: 'quick_add',
    tips: ['تسک‌های بزرگ رو به قدم‌های کوچک تقسیم کن تا زودتر تموم بشن.'],
  },
  daily_planner: {
    title: 'بلوک‌بندی زمانی روزانه',
    actionHint: 'ساعت شروع و پایان کارهات رو برای تمرکز بالا مشخص کن.',
    quickActionLabel: 'افزودن بلوک زمانی',
    quickActionView: 'daily_planner',
    tips: ['ساعت و دقیقه به تفکیک قابل تنظیم هستند. بین بلوک‌ها استراحت بگذار.'],
  },
  weekly_planner: {
    title: 'دید کلی هفته',
    actionHint: 'رویدادها و اولویت‌های کل هفته رو یکجا مدیریت کن.',
    tips: ['هر یکشنبه شب ۵ دقیقه وقت بذار و هفته پیش رو رو سازماندهی کن.'],
  },
  goals: {
    title: 'چشم‌انداز و اهداف بلندمدت',
    actionHint: 'اهدافت رو با مشخص کردن بازه زمانی و درصد پیشرفت پیگیری کن.',
    tips: ['یک هدف بدون تاریخ مشخص فقط یک آرزوست!'],
  },
  habits: {
    title: 'زنجیره عادت‌های روزانه',
    actionHint: 'تیک عادت‌های امروزت رو بزن تا زنجیره موفقیتت قطع نشه.',
    tips: ['پیوستگی مهم‌تر از شدت است؛ حتی ۲ دقیقه در روز اثرگذار است.'],
  },
  pomodoro: {
    title: 'تمرکز عمیق (پومودورو)',
    actionHint: 'تایمر ۲۵ دقیقه‌ای رو استارت بزن و گوشی رو در حالت سایلنت بذار.',
    tips: ['در طول تمرکز به هیچ اعلان یا پیام دیگری پاسخ نده.'],
  },
  notes: {
    title: 'دفترچه یادداشت‌های سریع',
    actionHint: 'ایده‌ها و نکات جلساتت رو سریع یادداشت کن.',
    tips: ['از دسته‌بندی رنگی برای سازماندهی بهتر یادداشت‌ها استفاده کن.'],
  },
  calendar: {
    title: 'تقویم هوشمند خورشیدی',
    actionHint: 'رویدادها و وظایف رو روی روزهای تقویم ببین و جابجا کن.',
    tips: ['با کلیک روی هر روز تقویم می‌تونی کارهای اون روز رو اضافه کنی.'],
  },
};

export const PersistentMascotWidget: React.FC = () => {
  const {
    activeView,
    setActiveView,
    openMascotTour,
    openQuickAdd,
    mascotTourOpen,
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If the full tour modal is currently active, hide the corner bubble to avoid collision
  if (mascotTourOpen || dismissed) return null;

  const currentGuide = VIEW_GUIDES[activeView] || VIEW_GUIDES.dashboard;

  return (
    <aside
      id="persistent-mascot-widget"
      aria-label={`دستیار هوشمند ${MASCOT_INFO.shortName}`}
      className="hidden sm:block fixed z-30 bottom-6 left-6 pointer-events-auto select-none"
      dir="rtl"
    >
      {/* Mini Companion Popover when expanded */}
      {expanded ? (
        <div className="w-72 sm:w-80 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-2xl shadow-amber-950/40 p-3 text-slate-100 backdrop-blur-xl animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MascotAvatar size="xs" animated={true} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-100">{MASCOT_INFO.shortName}</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                    راهنمای عملی
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">{currentGuide.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
                title="کوچک کردن"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
                title="پنهان کردن"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Practical Live Explanation Body */}
          <div className="py-2.5 space-y-2">
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              {currentGuide.actionHint}
            </p>

            {currentGuide.tips[0] && (
              <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-800/40 p-2 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                <span>{currentGuide.tips[0]}</span>
              </div>
            )}
          </div>

          {/* Practical Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5">
            {currentGuide.quickActionLabel && (
              <button
                type="button"
                onClick={() => {
                  if (currentGuide.quickActionView === 'quick_add') {
                    openQuickAdd();
                  } else if (currentGuide.quickActionView) {
                    setActiveView(currentGuide.quickActionView as any);
                  }
                  setExpanded(false);
                }}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>{currentGuide.quickActionLabel}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                const stepIdx = VISUAL_TOUR_SECTIONS.findIndex((s) => s.viewKey === activeView);
                openMascotTour(stepIdx >= 0 ? stepIdx : 0);
              }}
              className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer"
              title="مشاهده راهنمای تصویری تمام بخش‌ها"
            >
              <Compass className="w-3 h-3 text-purple-400" />
              <span>راهنمای تصویری</span>
            </button>
          </div>
        </div>
      ) : (
        /* Minimized floating corner character */
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="group relative flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-900/95 hover:bg-slate-850 border border-amber-500/50 shadow-xl shadow-amber-950/30 transition-all cursor-pointer active:scale-95 backdrop-blur-md"
          title={`راهنمای عملی ${MASCOT_INFO.shortName} برای این بخش`}
        >
          <MascotAvatar size="xs" animated={true} />
          <div className="text-right pl-2 hidden sm:block">
            <span className="text-[11px] font-bold text-amber-300 group-hover:text-amber-200 block leading-tight">
              {MASCOT_INFO.shortName}
            </span>
            <span className="text-[9px] text-slate-400 block leading-none">
              راهنمای بخش
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
        </button>
      )}
    </aside>
  );
};
