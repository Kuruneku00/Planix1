import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VISUAL_TOUR_SECTIONS } from '../../data/visualTourData';
import { SectionDiagramMockup } from './SectionDiagramMockup';
import { toPersianDigits } from '../../utils/jalali';
import { soundEffects } from '../../utils/audio';
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  LayoutGrid,
  Lightbulb,
} from 'lucide-react';

interface MascotTourModalProps {
  isOnboardingMode?: boolean;
  onComplete?: () => void;
}

export const MascotTourModal: React.FC<MascotTourModalProps> = ({
  isOnboardingMode = false,
  onComplete,
}) => {
  const {
    mascotTourOpen,
    setMascotTourOpen,
    mascotInitialStep,
    settings,
    updateSettings,
    showToast,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial step when tour opens
  useEffect(() => {
    if (mascotTourOpen || isOnboardingMode) {
      const initIdx =
        typeof mascotInitialStep === 'number' &&
        mascotInitialStep >= 0 &&
        mascotInitialStep < VISUAL_TOUR_SECTIONS.length
          ? mascotInitialStep
          : 0;
      setCurrentStepIndex(initIdx);
    }
  }, [mascotTourOpen, mascotInitialStep, isOnboardingMode]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);

  if (!isOnboardingMode && !mascotTourOpen) return null;

  const currentStep = VISUAL_TOUR_SECTIONS[currentStepIndex] || VISUAL_TOUR_SECTIONS[0];
  const totalSteps = VISUAL_TOUR_SECTIONS.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const formatDigits = (val: string | number) =>
    settings.persianDigits ? toPersianDigits(val) : String(val);

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

  const handleFinish = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playSuccessNotification();
    }
    updateSettings({ 
      hasSeenMascotTour: true, 
    });
    setMascotTourOpen(false);

    if (onComplete) {
      onComplete();
    } else {
      showToast('راهنمای بخش‌ها به پایان رسید 🦊', 'success');
    }
  };

  const isLight = settings.theme === 'light';

  return (
    <div
      id="visual-mascot-tour-modal"
      className={`fixed inset-0 z-[250] select-none overflow-hidden flex flex-col justify-between h-[100dvh] max-h-[100dvh] w-full transition-colors ${
        isLight ? 'bg-[#f4f6fc] text-slate-800' : 'bg-[#0b0e17] text-slate-100'
      }`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
      }}
      dir="rtl"
    >
      {/* 1. TOP HEADER (Matching user screenshots in both Light and Dark modes) */}
      <header className="w-full max-w-lg mx-auto pt-2 pb-3 shrink-0 flex items-center justify-between">
        {/* Left (RTL): Step Counter badge with mascot avatar */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            isLight
              ? 'bg-[#edf0ff] border-[#dce2fc] text-[#4f3ff5]'
              : 'bg-[#181f33] border-slate-700/50 text-slate-200'
          }`}
        >
          <span className="text-xs font-bold">
            {formatDigits(currentStepIndex + 1)} از {formatDigits(totalSteps)}
          </span>
          <div
            className={`w-5 h-5 rounded-full overflow-hidden shrink-0 border ${
              isLight ? 'bg-slate-100 border-[#dce2fc]' : 'bg-slate-800 border-transparent'
            }`}
          >
            <img
              src="/mascot.png"
              alt="Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right (RTL): Back chevron + Planix title */}
        <div className="flex items-center gap-2">
          <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Planix
          </h2>
          <button
            type="button"
            onClick={handleFinish}
            className={`p-1 transition cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
            }`}
            title="بستن"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Skip/Enter bar button */}
      <div className="w-full max-w-lg mx-auto pb-3 shrink-0">
        <button
          type="button"
          onClick={handleFinish}
          className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer group shadow-sm ${
            isLight
              ? 'bg-white border-[#e2e6f4] text-slate-600 hover:text-slate-900 hover:border-purple-300'
              : 'bg-[#111624] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-purple-600/40'
          }`}
        >
          <span className={isLight ? 'text-slate-700 font-bold group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'}>
            رد کردن و ورود
          </span>
          <ArrowLeft className="w-4 h-4 text-[#7059f6] group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2. MAIN SCROLLABLE BODY */}
      <main
        ref={scrollContainerRef}
        className="w-full max-w-lg mx-auto flex-1 min-h-0 overflow-y-auto space-y-4 pr-0.5 scrollbar-none"
      >
        {/* Top Info Card (قسمت توضیحات) */}
        <div
          className={`p-4 rounded-2xl border space-y-3 shadow-sm ${
            isLight
              ? 'bg-white border-[#e2e6f4] text-slate-800'
              : 'bg-[#111624] border-slate-800/80 text-slate-100'
          }`}
        >
          {/* Tag + Icon Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black ${isLight ? 'text-[#4f3ff5]' : 'text-slate-300'}`}>
                {formatDigits(currentStepIndex + 1)}.
              </span>
              <LayoutGrid className={`w-4 h-4 ${isLight ? 'text-[#7059f6]' : 'text-purple-400'}`} />
            </div>
            <span
              className={`text-[11px] px-3 py-1 rounded-full font-bold border ${
                isLight
                  ? 'bg-[#edf0ff] text-[#4f3ff5] border-[#dce2fc]'
                  : 'bg-[#1c2438] text-purple-300 border-purple-900/40'
              }`}
            >
              {currentStep.category}
            </span>
          </div>

          {/* Title + Mascot Avatar + Speech (قسمت توضیحات) */}
          <div className="flex items-start justify-between gap-3">
            <div
              className={`w-11 h-11 rounded-xl p-0.5 shrink-0 overflow-hidden border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#181f33] border-slate-700/60'
              }`}
            >
              <img
                src="/mascot.png"
                alt="روباه"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-right">
              <h3 className={`text-sm sm:text-base font-black mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {currentStep.title}
              </h3>
              <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {currentStep.mascotSpeech}
              </p>
            </div>
          </div>

          {/* ProTip bulb banner */}
          {currentStep.proTip && (
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs gap-2 ${
                isLight
                  ? 'bg-[#edf2ff] border-[#dce4fc] text-[#3730a3]'
                  : 'bg-[#161c2e] border-slate-700/50 text-slate-300'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-right text-[11px] leading-relaxed flex-1 font-medium">
                {currentStep.proTip}
              </span>
            </div>
          )}
        </div>

        {/* Schematic Mockup Title Header */}
        <div className={`flex items-center justify-between px-1 text-xs font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          <div className="flex items-center gap-1.5">
            <span className={isLight ? 'text-[#7059f6]' : 'text-purple-400'}>📈</span>
            <span>نمودار تصویری و اجزای بخش (مطابق نمونۀ ارسالی)</span>
          </div>
        </div>

        {/* Section Diagram Mockup */}
        <SectionDiagramMockup
          viewKey={currentStep.viewKey}
          activeCalloutId={undefined}
          onSelectCallout={() => {}}
          isLight={isLight}
        />

        {/* 4 List Item Cards (pill category on left, text in middle, purple number badge + chevron on right) */}
        <div className="space-y-2 pt-1 pb-4">
          {currentStep.callouts.map((callout) => (
            <div
              key={callout.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition shadow-sm ${
                isLight
                  ? 'bg-white border-[#e2e6f4] hover:border-purple-300 text-slate-800'
                  : 'bg-[#111624] border-slate-800/80 hover:border-slate-700 text-slate-100'
              }`}
            >
              {/* Category Pill (Left in RTL) */}
              <div className="shrink-0">
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${
                    isLight
                      ? 'bg-[#edf0ff] text-[#4f3ff5] border-[#dce2fc]'
                      : 'bg-[#1a2136] text-purple-300 border-transparent'
                  }`}
                >
                  {callout.badge}
                </span>
              </div>

              {/* Title & Description (Center) */}
              <div className="flex-1 text-right min-w-0 pr-1">
                <h4 className={`text-xs sm:text-[13px] font-bold mb-0.5 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {callout.title}
                </h4>
                <p className={`text-[10px] sm:text-[11px] leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {callout.description}
                </p>
              </div>

              {/* Number Badge + Chevron (Right in RTL) */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>‹</span>
                <div
                  className={`w-6 h-6 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-sm ${
                    isLight ? 'bg-[#7059f6]' : 'bg-[#7c3aed]'
                  }`}
                >
                  {formatDigits(callout.number)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3. BOTTOM ACTION BAR: Force physical LTR layout */}
      <footer
        dir="ltr"
        className={`w-full max-w-lg mx-auto pt-2 pb-1 shrink-0 flex items-center justify-between gap-2 border-t ${
          isLight ? 'bg-[#f4f6fc]/90 border-[#e2e6f4]' : 'bg-[#0b0e17]/90 border-slate-800/60'
        }`}
      >
        {/* Left Side: بخش بعدی */}
        <button
          type="button"
          onClick={handleNext}
          dir="rtl"
          className={`py-2.5 px-5 rounded-2xl text-white font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer active:scale-95 shrink-0 ${
            isLight
              ? 'bg-[#7059f6] hover:bg-[#5f47e8] shadow-[#7059f6]/30'
              : 'bg-[#5848ff] hover:bg-[#4b3bf0] shadow-indigo-600/30'
          }`}
        >
          <span>{isLastStep ? 'پایان راهنما' : 'بخش بعدی'}</span>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Center: رد کردن راهنما */}
        <button
          type="button"
          onClick={handleFinish}
          dir="rtl"
          className={`text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer ${
            isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-purple-300'
          }`}
        >
          رد کردن راهنما
        </button>

        {/* Right Side: بخش قبلی */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirstStep}
          dir="rtl"
          className={`py-2.5 px-4 rounded-2xl disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0 border ${
            isLight
              ? 'bg-[#edf0ff] hover:bg-[#e0e5ff] text-[#4f3ff5] border-[#dce2fc]'
              : 'bg-[#131726] hover:bg-[#1c2238] text-slate-300 border-slate-800/80'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
          <span>بخش قبلی</span>
        </button>
      </footer>
    </div>
  );
};
