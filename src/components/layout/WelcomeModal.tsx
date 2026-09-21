import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Sparkles, ArrowLeft, Check, User, Compass } from 'lucide-react';
import { MascotAvatar } from '../mascot/MascotAvatar';

export const WelcomeModal: React.FC = () => {
  const { settings, updateSettings, showToast, openMascotTour } = useApp();
  const [name, setName] = useState(settings.userName || '');
  const [step, setStep] = useState(1);

  if (!settings.isFirstLaunch) return null;

  const handleStartTour = () => {
    updateSettings({
      isFirstLaunch: false,
    });
    // Immediately open Kuro Kitsune practical tour
    setTimeout(() => {
      openMascotTour(0);
    }, 200);
  };

  const handleFinishWithName = () => {
    const finalName = name.trim() || 'کاربر گرامی';
    const wasFirst = settings.isFirstLaunch;
    updateSettings({
      userName: finalName,
      isFirstLaunch: false,
    });
    if (wasFirst) {
      showToast(`خوش آمدید، ${finalName}!`, 'success');
    }
    setTimeout(() => {
      openMascotTour(0);
    }, 200);
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        updateSettings({ isFirstLaunch: false });
        setTimeout(() => openMascotTour(0), 200);
      }}
      title="آشنایی با برنامه Planix"
      subtitle="دستیار برنامه‌ریزی، مدیریت زمان و اهداف"
      maxWidth="md"
      position="center"
      icon={<Sparkles className="text-purple-400" />}
    >
      <div className="space-y-4 text-center" dir="rtl">
        {step === 1 && (
          <div className="space-y-4 py-2">
            {/* Mascot Introduction */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/40 shadow-xl shadow-purple-500/10 dark:shadow-purple-900/50 flex items-center justify-center p-2.5">
                <img
                  src="/logo.png"
                  alt="لوگوی Planix"
                  className="w-full h-full object-contain drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl text-slate-600 font-bold">+</span>
              <MascotAvatar size="md" animated={true} showBadge={true} badgeText="Kuro Kitsune" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">سلام! من Kuro Kitsune هستم 🦊</h3>
              <p className="text-xs text-purple-400 font-semibold mt-0.5">راهنما و مربی هوشمند شما در پلنر</p>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-right space-y-2">
              <p className="font-semibold text-slate-200">
                اینجا همه چیز برای رسیدن به اهداف و نظم روزانه شما آماده است:
              </p>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
                <li><strong className="text-slate-100">داشبورد یکپارچه:</strong> مشاهده خلاصه کارها، تقویم و وضعیت روزانه</li>
                <li><strong className="text-slate-100">برنامه روزانه:</strong> تکنیک مسدودسازی زمان (Time-Blocking)</li>
                <li><strong className="text-slate-100">عادت‌ها:</strong> ساخت زنجیره استمرار ۷ روزه بدون وقفه</li>
                <li><strong className="text-slate-100">تایمر پومودورو:</strong> تمرکز عمیق بدون حواس‌پرتی</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleStartTour}
                className="w-full sm:flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950/40 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>شروع آشنایی عملی با Kuro Kitsune</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                تنظیم نام و حساب
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFinishWithName();
            }}
            className="space-y-4 py-2 text-right"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>نام یا عنوان نمایشی شما:</span>
                <span className="text-[10px] text-purple-400 font-normal">اختیاری</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: علی رضایی..."
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition shadow-inner"
                />
                <User className="w-4 h-4 text-purple-400 absolute top-3.5 right-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                بازگشت
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950/50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>ذخیره و شروع کار</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
