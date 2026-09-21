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

export const MascotTourModal: React.FC = () => {
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
    if (mascotTourOpen) {
      const initIdx =
        typeof mascotInitialStep === 'number' &&
        mascotInitialStep >= 0 &&
        mascotInitialStep < VISUAL_TOUR_SECTIONS.length
          ? mascotInitialStep
          : 0;
      setCurrentStepIndex(initIdx);
    }
  }, [mascotTourOpen, mascotInitialStep]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex]);

  if (!mascotTourOpen) return null;

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
    const wasFirstLaunch = settings.isFirstLaunch || !settings.hasSeenMascotTour;
    updateSettings({ 
      hasSeenMascotTour: true, 
      hasCompletedOnboarding: true,
      isFirstLaunch: false 
    });
    setMascotTourOpen(false);

    // Only show "خوش آمدید" welcome toast on very first launch/tour finish
    if (wasFirstLaunch) {
      showToast('به برنامه Planix خوش آمدید 🦊', 'success');
    }
  };

  return (
    <div
      id="visual-mascot-tour-modal"
      className="fixed inset-0 z-[250] bg-[#0b0e17] text-slate-100 select-none overflow-hidden flex flex-col justify-between h-[100dvh] max-h-[100dvh] w-full"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
      }}
      dir="rtl"
    >
      {/* 1. TOP HEADER (Exactly like user screenshot) */}
      <header className="w-full max-w-lg mx-auto pt-2 pb-3 shrink-0 flex items-center justify-between">
        {/* Left (RTL): Step Counter badge with mascot avatar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181f33] border border-slate-700/50">
          <span className="text-xs text-slate-200 font-bold">
            {formatDigits(currentStepIndex + 1)} از {formatDigits(totalSteps)}
          </span>
          <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 shrink-0">
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
          <h2 className="text-lg font-black tracking-tight text-white">Planix</h2>
          <button
            type="button"
            onClick={handleFinish}
            className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
            title="بستن"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Skip/Enter bar button (Clean arrow indicator instead of search) */}
      <div className="w-full max-w-lg mx-auto pb-3 shrink-0">
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-2.5 px-4 rounded-xl bg-[#111624] border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-purple-600/40 text-xs font-semibold flex items-center justify-between transition cursor-pointer group"
        >
          <span className="text-slate-300 group-hover:text-white transition">رد کردن و ورود</span>
          <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2. MAIN SCROLLABLE BODY */}
      <main
        ref={scrollContainerRef}
        className="w-full max-w-lg mx-auto flex-1 min-h-0 overflow-y-auto space-y-4 pr-0.5 scrollbar-none"
      >
        {/* Top Info Card */}
        <div className="p-4 rounded-2xl bg-[#111624] border border-slate-800/80 space-y-3">
          {/* Tag + Icon Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-300">{formatDigits(currentStepIndex + 1)}.</span>
              <LayoutGrid className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#1c2438] text-purple-300 border border-purple-900/40 font-bold">
              {currentStep.category}
            </span>
          </div>

          {/* Title + Mascot Avatar + Speech */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#181f33] border border-slate-700/60 p-0.5 shrink-0 overflow-hidden">
              <img
                src="/mascot.png"
                alt="روباه"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-sm sm:text-base font-black text-white mb-1">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {currentStep.mascotSpeech}
              </p>
            </div>
          </div>

          {/* ProTip bulb banner */}
          {currentStep.proTip && (
            <div className="p-2.5 rounded-xl bg-[#161c2e] border border-slate-700/50 flex items-center justify-between text-xs text-slate-300 gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-right text-[11px] leading-relaxed flex-1">
                {currentStep.proTip}
              </span>
            </div>
          )}
        </div>

        {/* Schematic Mockup Title Header */}
        <div className="flex items-center justify-between px-1 text-slate-300 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="text-purple-400">📈</span>
            <span>نمودار تصویری و اجزای بخش (مطابق نمونۀ ارسالی)</span>
          </div>
        </div>

        {/* Section Diagram Mockup */}
        <SectionDiagramMockup
          viewKey={currentStep.viewKey}
          activeCalloutId={undefined}
          onSelectCallout={() => {}}
        />

        {/* 4 List Item Cards (Identical to screenshot: pill category on left, text in middle, purple number badge + chevron on right) */}
        <div className="space-y-2 pt-1 pb-4">
          {currentStep.callouts.map((callout) => (
            <div
              key={callout.id}
              className="p-3 rounded-2xl bg-[#111624] border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              {/* Category Pill (Left in RTL) */}
              <div className="shrink-0">
                <span className="text-[10px] px-2.5 py-1 rounded-lg bg-[#1a2136] text-purple-300 font-medium">
                  {callout.badge}
                </span>
              </div>

              {/* Title & Description (Center) */}
              <div className="flex-1 text-right min-w-0 pr-1">
                <h4 className="text-xs sm:text-[13px] font-bold text-white mb-0.5 truncate">
                  {callout.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">
                  {callout.description}
                </p>
              </div>

              {/* Number Badge + Chevron (Right in RTL) */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-600 text-xs">‹</span>
                <div className="w-6 h-6 rounded-lg bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {formatDigits(callout.number)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3. BOTTOM ACTION BAR: Force physical LTR layout so 'بخش بعدی' is on the left and 'بخش قبلی' is on the right */}
      <footer
        dir="ltr"
        className="w-full max-w-lg mx-auto pt-2 shrink-0 flex items-center justify-between gap-2 border-t border-slate-800/60"
      >
        {/* Left Side: بخش بعدی */}
        <button
          type="button"
          onClick={handleNext}
          dir="rtl"
          className="py-2.5 px-5 rounded-2xl bg-[#5848ff] hover:bg-[#4b3bf0] text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition cursor-pointer active:scale-95 shrink-0"
        >
          <span>{isLastStep ? 'پایان راهنما' : 'بخش بعدی'}</span>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Center: رد کردن راهنما */}
        <button
          type="button"
          onClick={handleFinish}
          dir="rtl"
          className="text-xs font-semibold text-slate-400 hover:text-purple-300 py-2 px-3 rounded-xl transition cursor-pointer"
        >
          رد کردن راهنما
        </button>

        {/* Right Side: بخش قبلی */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirstStep}
          dir="rtl"
          className="py-2.5 px-4 rounded-2xl bg-[#131726] hover:bg-[#1c2238] disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-800/80 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
          <span>بخش قبلی</span>
        </button>
      </footer>
    </div>
  );
};
