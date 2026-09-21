import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  formatToJalali,
  getTodayJalali,
  toPersianDigits,
  toEnglishDigits,
  PERSIAN_MONTH_NAMES,
  PERSIAN_WEEKDAY_SHORT,
  getJalaliMonthDays,
  jalaliToGregorian,
  gregorianToJalali,
} from '../../utils/jalali';
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, ChevronDown, Check, X } from 'lucide-react';

interface PersianDatePickerProps {
  value?: string; // Gregorian ISO: YYYY-MM-DD
  onChange: (iso: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'انتخاب تاریخ شمسی...',
  required = false,
  error,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Jalali view year and month
  const todayJalali = useMemo(() => getTodayJalali(), []);

  const parsedCurrentJalali = useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length === 3) {
      const gy = parseInt(parts[0], 10);
      const gm = parseInt(parts[1], 10);
      const gd = parseInt(parts[2], 10);
      if (!isNaN(gy) && !isNaN(gm) && !isNaN(gd)) {
        return gregorianToJalali(gy, gm, gd);
      }
    }
    return null;
  }, [value]);

  const [viewYear, setViewYear] = useState<number>(
    parsedCurrentJalali?.jy ?? todayJalali.jy
  );
  const [viewMonth, setViewMonth] = useState<number>(
    parsedCurrentJalali?.jm ?? todayJalali.jm
  );

  // When value changes from outside, sync view if opened
  useEffect(() => {
    if (parsedCurrentJalali) {
      setViewYear(parsedCurrentJalali.jy);
      setViewMonth(parsedCurrentJalali.jm);
    }
  }, [parsedCurrentJalali]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Days in selected Jalali month
  const daysInMonth = useMemo(() => {
    return getJalaliMonthDays(viewYear, viewMonth);
  }, [viewYear, viewMonth]);

  // Calculate starting weekday of the 1st of this Jalali month
  const startWeekday = useMemo(() => {
    const gDate = jalaliToGregorian(viewYear, viewMonth, 1);
    const jsDate = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
    const jsDay = jsDate.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
    return (jsDay + 1) % 7; // Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectJalaliDay = (day: number) => {
    const gDate = jalaliToGregorian(viewYear, viewMonth, day);
    const iso = `${gDate.gy}-${String(gDate.gm).padStart(2, '0')}-${String(gDate.gd).padStart(2, '0')}`;
    onChange(iso);
    setIsOpen(false);
  };

  const setToday = () => {
    const gDate = jalaliToGregorian(todayJalali.jy, todayJalali.jm, todayJalali.jd);
    const iso = `${gDate.gy}-${String(gDate.gm).padStart(2, '0')}-${String(gDate.gd).padStart(2, '0')}`;
    onChange(iso);
    setViewYear(todayJalali.jy);
    setViewMonth(todayJalali.jm);
    setIsOpen(false);
  };

  const setTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const iso = d.toISOString().split('T')[0];
    onChange(iso);
    const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    setViewYear(j.jy);
    setViewMonth(j.jm);
    setIsOpen(false);
  };

  const displayString = value ? formatToJalali(value, 'full', true) : '';

  return (
    <div className={`relative ${className}`} ref={containerRef} dir="rtl">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`h-11 px-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
          disabled
            ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
            : error
            ? 'bg-slate-800 border-rose-500/80 text-slate-100 hover:border-rose-400'
            : isOpen
            ? 'bg-slate-800 border-purple-500 text-slate-100 ring-1 ring-purple-500/50'
            : 'bg-slate-800 border-slate-700 text-slate-100 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-purple-400 shrink-0" />
          <span className={`text-xs sm:text-sm truncate ${displayString ? 'font-medium text-slate-100' : 'text-slate-400'}`}>
            {displayString || placeholder}
          </span>
        </div>

        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
            title="پاک کردن تاریخ"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-400 mt-1 font-medium">{error}</p>}

      {/* Dropdown Calendar Panel */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-x-3 bottom-[calc(4.5rem+var(--safe-bottom))] sm:bottom-auto sm:inset-x-auto sm:absolute sm:right-0 sm:mt-1.5 w-auto sm:w-80 p-3.5 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl shadow-purple-950/50 text-slate-100 z-50 max-w-[95vw] mx-auto animate-in fade-in sm:zoom-in-95 duration-150">
            {/* Calendar Header: Month & Year Nav */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="ماه قبل"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-purple-300">
              <span>{PERSIAN_MONTH_NAMES[viewMonth - 1]}</span>
              <span className="font-mono">{toPersianDigits(viewYear)}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="ماه بعد"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <button
              type="button"
              onClick={setToday}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-purple-950/60 hover:text-purple-300 border border-slate-700 text-[11px] text-slate-300 transition cursor-pointer"
            >
              امروز
            </button>
            <button
              type="button"
              onClick={setTomorrow}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-purple-950/60 hover:text-purple-300 border border-slate-700 text-[11px] text-slate-300 transition cursor-pointer"
            >
              فردا
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] sm:text-xs font-semibold text-slate-400">
            {PERSIAN_WEEKDAY_SHORT.map((day, idx) => (
              <div key={idx} className={idx === 6 ? 'text-rose-400' : ''}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Blank padding days */}
            {Array.from({ length: startWeekday }).map((_, i) => (
              <div key={`empty_${i}`} className="h-8" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected =
                parsedCurrentJalali?.jy === viewYear &&
                parsedCurrentJalali?.jm === viewMonth &&
                parsedCurrentJalali?.jd === dayNum;
              const isToday =
                todayJalali.jy === viewYear &&
                todayJalali.jm === viewMonth &&
                todayJalali.jd === dayNum;
              const weekdayIndex = (startWeekday + i) % 7;
              const isFriday = weekdayIndex === 6;

              return (
                <button
                  key={`day_${dayNum}`}
                  type="button"
                  onClick={() => selectJalaliDay(dayNum)}
                  className={`h-8 sm:h-8.5 rounded-lg flex items-center justify-center text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/50'
                      : isToday
                      ? 'bg-slate-800 border border-purple-500/80 text-purple-300 font-bold'
                      : isFriday
                      ? 'text-rose-400 hover:bg-slate-800'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {toPersianDigits(dayNum)}
                </button>
              );
            })}
          </div>
        </div>
      </>
      )}
    </div>
  );
};

interface PersianTimePickerProps {
  value: string; // HH:mm format, e.g. "14:30"
  onChange: (time: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  compact?: boolean;
}

export const PersianTimePicker: React.FC<PersianTimePickerProps> = ({
  value = '09:00',
  onChange,
  label,
  required = false,
  error,
  className = '',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hours, minutes] = useMemo(() => {
    const parts = (value || '09:00').split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return [isNaN(h) ? 9 : h, isNaN(m) ? 0 : m];
  }, [value]);

  const hourOptions = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minuteOptions = useMemo(() => [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], []);

  const updateTime = (newH: number, newM: number) => {
    const clampedH = (newH + 24) % 24;
    const clampedM = (newM + 60) % 60;
    const timeStr = `${String(clampedH).padStart(2, '0')}:${String(clampedM).padStart(2, '0')}`;
    onChange(timeStr);
  };

  const quickPicks = [
    { label: 'صبح (08:00)', val: '08:00' },
    { label: 'شروع کار (09:00)', val: '09:00' },
    { label: 'جلسه (10:00)', val: '10:00' },
    { label: 'ظهر (12:00)', val: '12:00' },
    { label: 'ناهار (13:30)', val: '13:30' },
    { label: 'عصر (16:00)', val: '16:00' },
    { label: 'تمرکز (18:00)', val: '18:00' },
    { label: 'شب (20:00)', val: '20:00' },
  ];

  return (
    <div className={`relative ${className}`} ref={containerRef} dir="rtl">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${
          compact
            ? 'h-8 px-2.5 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer transition select-none'
            : 'h-11 px-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none'
        } ${
          error
            ? 'bg-slate-800 border-rose-500/80 text-slate-100 hover:border-rose-400'
            : isOpen
            ? 'bg-slate-800 border-purple-500 text-slate-100 ring-1 ring-purple-500/50'
            : 'bg-slate-800 border-slate-700 text-slate-100 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-1.5" dir="ltr">
          <Clock className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-purple-400 shrink-0`} />
          <span className={`${compact ? 'text-xs font-semibold' : 'text-xs sm:text-sm font-bold'} font-mono tracking-wider text-slate-100`}>
            {value || '09:00'}
          </span>
        </div>
      </button>

      {error && <p className="text-[11px] text-rose-400 mt-1 font-medium">{error}</p>}

      {/* Modal Dialog for Time Selection */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl shadow-purple-950/60 p-4 text-slate-100 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">انتخاب و تنظیم ساعت</h4>
                  <span className="text-[10px] text-slate-400">ساعت و دقیقه مورد نظر خود را مشخص کنید</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
                title="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Large Digital Clock Display with Nudge Buttons (LTR: Hour on Left, Minute on Right) */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/70 mb-3 flex flex-col items-center">
              <div className="flex items-center justify-center gap-4 w-full" dir="ltr">
                {/* Hours Display & Adjust */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateTime(hours - 1, minutes)}
                      className="w-7 h-6 rounded bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 flex items-center justify-center cursor-pointer transition active:scale-95"
                      title="یک ساعت قبل"
                    >
                      -
                    </button>
                    <div className="w-14 h-10 rounded-lg bg-slate-900 border border-purple-500/60 flex items-center justify-center font-mono text-xl font-bold text-purple-300 shadow-inner">
                      {String(hours).padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateTime(hours + 1, minutes)}
                      className="w-7 h-6 rounded bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 flex items-center justify-center cursor-pointer transition active:scale-95"
                      title="یک ساعت بعد"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-purple-300">ساعت</span>
                </div>

                <span className="text-2xl font-bold text-purple-400 font-mono self-center mb-4">:</span>

                {/* Minutes Display & Adjust */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateTime(hours, minutes - 5)}
                      className="w-7 h-6 rounded bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 flex items-center justify-center cursor-pointer transition active:scale-95"
                      title="۵ دقیقه قبل"
                    >
                      -
                    </button>
                    <div className="w-14 h-10 rounded-lg bg-slate-900 border border-purple-500/60 flex items-center justify-center font-mono text-xl font-bold text-purple-300 shadow-inner">
                      {String(minutes).padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateTime(hours, minutes + 5)}
                      className="w-7 h-6 rounded bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 flex items-center justify-center cursor-pointer transition active:scale-95"
                      title="۵ دقیقه بعد"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-purple-300">دقیقه</span>
                </div>
              </div>
            </div>

            {/* Direct Side-by-Side Selection Columns (Hour Column on Left, Minute Column on Right) */}
            <div className="grid grid-cols-2 gap-2 mb-3 flex-1 min-h-0" dir="ltr">
              {/* Hours Column (Left) */}
              <div className="flex flex-col min-h-0">
                <span className="text-[11px] font-bold text-slate-300 mb-1 block text-center" dir="rtl">
                  ساعت (۰ تا ۲۳)
                </span>
                <div className="h-36 overflow-y-auto rounded-xl bg-slate-950/70 border border-slate-800 p-1 space-y-1">
                  {hourOptions.map((h) => {
                    const isSelected = h === hours;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => updateTime(h, minutes)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-900/60'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className="mx-auto font-mono font-bold tracking-wider">
                          ساعت {String(h).padStart(2, '0')}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minutes Column (Right) */}
              <div className="flex flex-col min-h-0">
                <span className="text-[11px] font-bold text-slate-300 mb-1 block text-center" dir="rtl">
                  دقیقه (۰۰ تا ۵۵)
                </span>
                <div className="h-36 overflow-y-auto rounded-xl bg-slate-950/70 border border-slate-800 p-1 space-y-1">
                  {minuteOptions.map((m) => {
                    const isSelected = m === minutes;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => updateTime(hours, m)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-900/60'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className="mx-auto font-mono font-bold tracking-wider">
                          {String(m).padStart(2, '0')} دقیقه
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-slate-400 mb-1.5 block">
                پیش‌فرض‌های پرکاربرد:
              </span>
              <div className="grid grid-cols-4 gap-1">
                {quickPicks.map((q) => (
                  <button
                    key={q.val}
                    type="button"
                    onClick={() => updateTime(parseInt(q.val.split(':')[0], 10), parseInt(q.val.split(':')[1], 10))}
                    className={`py-1 px-1 rounded-lg text-[10px] font-medium border text-center transition cursor-pointer truncate ${
                      value === q.val
                        ? 'bg-purple-600 text-white border-purple-500 font-bold'
                        : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={q.label}
                  >
                    {q.val}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/50"
              >
                <Check className="w-4 h-4" />
                <span>تایید و اعمال ساعت</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
