import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VISUAL_TOUR_SECTIONS } from '../../data/visualTourData';
import { SectionDiagramMockup } from '../mascot/SectionDiagramMockup';
import { toPersianDigits } from '../../utils/jalali';
import { soundEffects } from '../../utils/audio';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Compass,
  LayoutGrid,
  CheckSquare,
  FolderKanban,
  Calendar as CalendarIcon,
  Clock,
  Flame,
  Timer,
  FileText,
  Bell,
  BarChart3,
  Paperclip,
  Bookmark,
  RefreshCw,
  Database,
  Settings as SettingsIcon,
} from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

// Icon mapper for the 18 sections
const getSectionIcon = (viewKey: string) => {
  switch (viewKey) {
    case 'dashboard':
      return LayoutGrid;
    case 'tasks':
      return CheckSquare;
    case 'projects':
      return FolderKanban;
    case 'calendar':
      return CalendarIcon;
    case 'daily_planner':
      return Clock;
    case 'weekly_planner':
      return CalendarIcon;
    case 'goals':
      return Compass;
    case 'habits':
      return Flame;
    case 'pomodoro':
      return Timer;
    case 'time_management':
      return Clock;
    case 'notes':
      return FileText;
    case 'reminders':
      return Bell;
    case 'reports':
      return BarChart3;
    case 'files':
      return Paperclip;
    case 'templates':
      return Bookmark;
    case 'sync':
      return RefreshCw;
    case 'backup':
      return Database;
    case 'settings':
      return SettingsIcon;
    default:
      return Sparkles;
  }
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { updateSettings, showToast, settings } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeCalloutIndex, setActiveCalloutIndex] = useState(0);
  const [showProTip, setShowProTip] = useState(false);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = VISUAL_TOUR_SECTIONS[currentStepIndex] || VISUAL_TOUR_SECTIONS[0];
  const totalSteps = VISUAL_TOUR_SECTIONS.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const formatDigits = (val: string | number) =>
    settings.persianDigits ? toPersianDigits(val) : String(val);

  // Auto scroll section navigation pills into view when step changes
  useEffect(() => {
    setActiveCalloutIndex(0);
    setShowProTip(false);
    if (pillsContainerRef.current) {
      const activeBtn = pillsContainerRef.current.querySelector<HTMLButtonElement>(
        `[data-step-index="${currentStepIndex}"]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentStepIndex]);

  const handleNext = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }

    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSelectStep = (idx: number) => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }
    setCurrentStepIndex(idx);
  };

  const handleFinish = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playSuccessNotification();
    }

    updateSettings({
      hasCompletedOnboarding: true,
      hasSeenMascotTour: true,
    });

    showToast('به Planix خوش آمدید! شروع یک تجربه برنامه‌ریزی بی‌نظیر 🚀', 'success');
    onComplete();
  };

  const handleSkip = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }

    updateSettings({
      hasCompletedOnboarding: true,
    });

    showToast('ورود به داشبورد Planix.', 'info');
    onComplete();
  };

  const StepIcon = getSectionIcon(currentStep.viewKey);
  const activeCallout = currentStep.callouts[activeCalloutIndex] || currentStep.callouts[0];

  return (
    <div
      id="planix-onboarding-screen"
      dir="rtl"
      className="fixed inset-0 z-[9998] flex flex-col justify-between bg-slate-950 text-slate-100 select-none overflow-hidden h-[100dvh] max-h-[100dvh]"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px), 10px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px), 10px)',
      }}
    >
      {/* 1. TOP HEADER: MINIMAL & COMPACT */}
      <header className="w-full max-w-2xl mx-auto px-3 py-1 shrink-0 flex items-center justify-between z-20 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 dark:bg-purple-950/50 border border-purple-300/60 dark:border-purple-500/40 p-0.5 flex items-center justify-center shrink-0 shadow-sm">
            <img
              src="/logo.png"
              alt="Planix"
              className="w-full h-full object-contain drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-white">Planix</span>
            <span className="text-[10px] text-purple-300 bg-purple-950/70 border border-purple-800/40 px-2 py-0.2 rounded-md font-semibold">
              بخش {formatDigits(currentStepIndex + 1)} از {formatDigits(totalSteps)}
            </span>
          </div>
        </div>

        <button
          id="onboarding-skip-btn"
          type="button"
          onClick={handleSkip}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition cursor-pointer active:scale-95"
        >
          رد کردن و ورود
        </button>
      </header>

      {/* 2. SECTION TABS SCROLLER: ULTRA MINIMAL */}
      <div className="w-full max-w-2xl mx-auto px-3 pt-1 shrink-0 z-10">
        <div
          ref={pillsContainerRef}
          className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none no-scrollbar scroll-smooth"
        >
          {VISUAL_TOUR_SECTIONS.map((sec, idx) => {
            const IconComponent = getSectionIcon(sec.viewKey);
            const isActive = idx === currentStepIndex;
            return (
              <button
                key={sec.id}
                data-step-index={idx}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30 border border-purple-400/50'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <IconComponent className="w-3 h-3" />
                <span>{sec.title.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE VIEW: ZERO-SCROLL GUARANTEED */}
      <main className="w-full max-w-xl mx-auto px-3 py-1 flex-1 min-h-0 flex flex-col justify-between gap-1.5 overflow-hidden z-10">
        {/* Mascot Dialogue Header */}
        <div className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-purple-900/30 flex items-center gap-2.5 shadow-sm">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 border border-orange-500/50 p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src="/mascot.png"
              alt="ممد"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 truncate">
                <StepIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-xs font-black text-white truncate">
                  {currentStep.title.split('(')[0].trim()}
                </span>
                <span className="text-[9px] text-purple-300/80 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40 shrink-0">
                  {currentStep.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowProTip((prev) => !prev)}
                className={`shrink-0 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition ${
                  showProTip
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-amber-300 bg-slate-800/60'
                }`}
                title="مشاهده نکته طلایی"
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>نکته</span>
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-purple-100 font-normal line-clamp-2 leading-relaxed mt-0.5">
              {showProTip ? (
                <span className="text-amber-200 font-medium">💡 {currentStep.proTip}</span>
              ) : (
                currentStep.mascotSpeech
              )}
            </p>
          </div>
        </div>

        {/* Visual Mockup Stage */}
        <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
          <SectionDiagramMockup
            viewKey={currentStep.viewKey}
            activeCalloutId={activeCallout?.id}
            onSelectCallout={(id) => {
              const idx = currentStep.callouts.findIndex((c) => c.id === id);
              if (idx !== -1) setActiveCalloutIndex(idx);
            }}
          />
        </div>

        {/* Interactive 4-Part Element Selector & Description Card */}
        <div className="shrink-0 flex flex-col gap-1">
          {/* 4 Mini Pin Selector Tabs */}
          <div className="grid grid-cols-4 gap-1">
            {currentStep.callouts.map((callout, idx) => {
              const isSelected = activeCalloutIndex === idx;
              return (
                <button
                  key={callout.id}
                  type="button"
                  onClick={() => setActiveCalloutIndex(idx)}
                  className={`py-1 px-1 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm font-bold scale-[1.02]'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-850 text-[10px]'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full text-[9px] font-black flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-purple-800 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {formatDigits(callout.number)}
                  </span>
                  <span className="text-[10px] truncate">{callout.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Single Focused Explanation Card */}
          {activeCallout && (
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/30 flex flex-col justify-center min-h-[54px] max-h-[66px] shadow-sm">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                    {formatDigits(activeCallout.number)}
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    {activeCallout.title}
                  </span>
                </div>
                <span className="text-[9px] bg-purple-950/80 text-purple-300 border border-purple-800/40 px-1.5 py-0.2 rounded font-medium shrink-0">
                  {activeCallout.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 pr-5">
                {activeCallout.description}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 4. BOTTOM ACTION BAR: CLEAN & STREAMLINED */}
      <footer className="w-full max-w-xl mx-auto px-3 py-1.5 shrink-0 z-20 border-t border-slate-900">
        <div className="flex items-center justify-between gap-2">
          {/* Previous Button */}
          <button
            id="onboarding-prev-btn"
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`py-1.5 px-3 rounded-xl border text-xs font-medium transition flex items-center gap-1 cursor-pointer active:scale-95 ${
              isFirstStep
                ? 'opacity-0 pointer-events-none'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>قبلی</span>
          </button>

          {/* Step Indicator */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>بخش</span>
            <span className="font-bold text-purple-300">{formatDigits(currentStepIndex + 1)}</span>
            <span>از</span>
            <span className="font-bold text-slate-300">{formatDigits(totalSteps)}</span>
          </div>

          {/* Next / Finish Button */}
          <button
            id="onboarding-next-btn"
            type="button"
            onClick={handleNext}
            className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 border border-purple-400/30 transition cursor-pointer active:scale-98"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>ورود به Planix ✨</span>
              </>
            ) : (
              <>
                <span>بعدی</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
