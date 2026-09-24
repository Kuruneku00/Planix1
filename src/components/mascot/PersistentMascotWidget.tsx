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
export const VIEW_GUIDES: Record<
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
  projects: {
    title: 'پروژه‌ها و فازبندی',
    actionHint: 'پروژه‌هات رو به وظایف مشخص تقسیم کن و پیشرفت‌شون رو بسنج.',
    quickActionLabel: 'تعریف پروژه جدید',
    quickActionView: 'quick_add',
    tips: ['با تیک زدن وظایف داخل هر پروژه، درصد پیشرفت اون خودکار بالا میره.'],
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
    quickActionLabel: 'ثبت هدف جدید',
    quickActionView: 'quick_add',
    tips: ['یک هدف بدون تاریخ مشخص فقط یک آرزوست!'],
  },
  habits: {
    title: 'زنجیره عادت‌های روزانه',
    actionHint: 'تیک عادت‌های امروزت رو بزن تا زنجیره موفقیتت قطع نشه.',
    quickActionLabel: 'ایجاد عادت جدید',
    quickActionView: 'quick_add',
    tips: ['پیوستگی مهم‌تر از شدت است؛ حتی ۲ دقیقه در روز اثرگذار است.'],
  },
  pomodoro: {
    title: 'تمرکز عمیق (پومودورو)',
    actionHint: 'تایمر ۲۵ دقیقه‌ای رو استارت بزن و گوشی رو در حالت سایلنت بذار.',
    tips: ['در طول تمرکز به هیچ اعلان یا پیام دیگری پاسخ نده.'],
  },
  time_management: {
    title: 'مدیریت و ثبت زمان',
    actionHint: 'زمان‌های صرف‌شده روی فعالیت‌ها و پروژه‌ها رو ثبت و تحلیل کن.',
    tips: ['ثبت دقیق زمان کمک می‌کنه بفهمی وقتت کجا صرف شده.'],
  },
  notes: {
    title: 'دفترچه یادداشت‌های سریع',
    actionHint: 'ایده‌ها و نکات جلساتت رو سریع یادداشت کن.',
    quickActionLabel: 'یادداشت جدید',
    quickActionView: 'quick_add',
    tips: ['از دسته‌بندی رنگی برای سازماندهی بهتر یادداشت‌ها استفاده کن.'],
  },
  calendar: {
    title: 'تقویم هوشمند خورشیدی',
    actionHint: 'رویدادها و وظایف رو روی روزهای تقویم ببین و جابجا کن.',
    quickActionLabel: 'ثبت رویداد',
    quickActionView: 'quick_add',
    tips: ['با کلیک روی هر روز تقویم می‌تونی کارهای اون روز رو اضافه کنی.'],
  },
  reminders: {
    title: 'یادآورها و هشدارها',
    actionHint: 'برای کارهای زمان‌دار یادآور با زنگ آلارم واقعی تنظیم کن.',
    quickActionLabel: 'تنظیم یادآور',
    quickActionView: 'quick_add',
    tips: ['یادآورها دقیقاً در زمان مشخص شده از طریق اعلان گوشی هشدار می‌دهند.'],
  },
  reports: {
    title: 'آمار و گزارش‌های بهره‌وری',
    actionHint: 'نمودارهای انجام وظایف و دقایق تمرکزت در هفته رو ببین.',
    tips: ['بررسی آمار هفتگی به بهبود بهره‌وری در هفته‌های آینده کمک می‌کنه.'],
  },
  settings: {
    title: 'تنظیمات برنامه',
    actionHint: 'دسترسی اعلان‌ها، تم و زبان برنامه رو مدیریت کن.',
    tips: ['برای دریافت اعلان‌های به‌موقع در گوشی، دسترسی اعلان را فعال نگه دارید.'],
  },
};

export const PersistentMascotWidget: React.FC = () => {
  const {
    activeView,
    setActiveView,
    openMascotTour,
    openQuickAdd,
    mascotTourOpen,
    mascotGuideOpen,
    setMascotGuideOpen,
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Sync with global openMascotGuide
  React.useEffect(() => {
    if (mascotGuideOpen) {
      setDismissed(false);
      setExpanded(true);
    }
  }, [mascotGuideOpen]);

  const handleCloseGuide = () => {
    setExpanded(false);
    setMascotGuideOpen(false);
  };

  // If the full tour modal is currently active, hide the corner bubble to avoid collision
  if (mascotTourOpen || (dismissed && !mascotGuideOpen)) return null;

  const currentGuide = VIEW_GUIDES[activeView] || VIEW_GUIDES.dashboard;

  return (
    <>
      {/* Invisible backdrop to dismiss card when tapping outside */}
      {expanded && (
        <div
          className="fixed inset-0 z-35 bg-black/20 sm:bg-transparent pointer-events-auto"
          onClick={handleCloseGuide}
        />
      )}

      {/* Floating Circular Widget & Popover Card: strictly above mobile bottom nav on phones, and bottom corner on desktop */}
      <aside
        id="persistent-mascot-widget"
        aria-label={`دستیار هوشمند ${MASCOT_INFO.shortName}`}
        className={`fixed pointer-events-auto select-none transition-all duration-200 right-3.5 sm:right-4 lg:right-auto lg:left-6 ${
          expanded ? 'z-50' : 'z-35'
        }`}
        style={{
          bottom: 'calc(4rem + var(--safe-bottom, 0px) + 0.875rem)',
        }}
        dir="rtl"
      >
        {/* The Card (کادر بازشو دقیقاً بالای آیکون دایره‌ای) */}
        {expanded && (
          <div className="absolute bottom-14 right-0 lg:right-auto lg:left-0 w-[calc(100vw-2rem)] max-w-sm sm:w-85 rounded-2xl bg-slate-900/98 dark:bg-[#0c1020]/98 border-2 border-amber-500/60 shadow-2xl shadow-black/80 p-3.5 sm:p-4 text-slate-100 backdrop-blur-xl animate-in zoom-in-95 fade-in slide-in-from-bottom-3 duration-200 mb-1 z-50">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MascotAvatar size="xs" animated={true} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-100">{MASCOT_INFO.shortName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      راهنمای عملی
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{currentGuide.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCloseGuide}
                  className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="بستن کادر"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Practical Live Explanation Body */}
            <div className="py-2.5 space-y-2">
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-850/80 p-2.5 rounded-xl border border-slate-800/80">
                {currentGuide.actionHint}
              </p>

              {currentGuide.tips[0] && (
                <div className="flex items-start gap-1.5 text-xs text-amber-300/95 bg-amber-950/40 border border-amber-800/50 p-2 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                  <span>{currentGuide.tips[0]}</span>
                </div>
              )}
            </div>

            {/* Practical Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              {currentGuide.quickActionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    handleCloseGuide();
                    if (currentGuide.quickActionView === 'quick_add') {
                      openQuickAdd();
                    } else if (currentGuide.quickActionView) {
                      setActiveView(currentGuide.quickActionView as any);
                    }
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{currentGuide.quickActionLabel}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  handleCloseGuide();
                  const stepIdx = VISUAL_TOUR_SECTIONS.findIndex((s) => s.viewKey === activeView);
                  openMascotTour(stepIdx >= 0 ? stepIdx : 0);
                }}
                className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="مشاهده راهنمای تصویری تمام بخش‌ها"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>راهنمای تصویری</span>
              </button>
            </div>
          </div>
        )}

        {/* Circular Avatar Button */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`group relative flex items-center justify-center w-12 h-12 lg:w-auto lg:h-auto lg:p-1.5 lg:pr-3 lg:pl-3.5 rounded-full bg-slate-900/95 hover:bg-slate-800 border-2 transition-all transform active:scale-90 cursor-pointer backdrop-blur-md ${
            expanded ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-amber-500/70 shadow-xl shadow-amber-950/50'
          }`}
          title={`راهنمای عملی ${MASCOT_INFO.shortName} برای این بخش`}
        >
          <MascotAvatar size="xs" animated={true} />
          <div className="text-right hidden lg:block mr-2">
            <span className="text-[11px] font-bold text-amber-300 group-hover:text-amber-200 block leading-tight">
              {MASCOT_INFO.shortName}
            </span>
            <span className="text-[9px] text-slate-400 block leading-none">
              {expanded ? 'بستن کادر' : 'راهنمای بخش'}
            </span>
          </div>

          {/* Glowing indicator dot */}
          {!expanded && (
            <>
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-slate-900 absolute -top-0.5 -right-0.5" />
            </>
          )}
        </button>
      </aside>
    </>
  );
};
