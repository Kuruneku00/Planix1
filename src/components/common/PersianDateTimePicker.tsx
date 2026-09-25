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
  parseJalaliInput,
  parseJalaliToGregorianIso,
  formatJalaliNumeric,
} from '../../utils/jalali';
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, ChevronDown, Check, X, ArrowLeft } from 'lucide-react';

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
  placeholder = 'انتخاب یا تایپ تاریخ شمسی...',
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

  // Direct typing state
  const [typedInput, setTypedInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [directDayInput, setDirectDayInput] = useState<string>('');
  const [directMonthInput, setDirectMonthInput] = useState<number>(
    parsedCurrentJalali?.jm ?? todayJalali.jm
  );
  const [directYearInput, setDirectYearInput] = useState<string>(
    String(parsedCurrentJalali?.jy ?? todayJalali.jy)
  );

  // Sync direct inputs when view changes
  useEffect(() => {
    setDirectMonthInput(viewMonth);
    setDirectYearInput(String(viewYear));
  }, [viewYear, viewMonth]);

  // When value changes from outside, sync view & input
  useEffect(() => {
    if (parsedCurrentJalali) {
      setViewYear(parsedCurrentJalali.jy);
      setViewMonth(parsedCurrentJalali.jm);
      setDirectDayInput(String(parsedCurrentJalali.jd));
      if (!isTyping) {
        setTypedInput(formatJalaliNumeric(parsedCurrentJalali.jy, parsedCurrentJalali.jm, parsedCurrentJalali.jd));
      }
    } else if (!isTyping) {
      setTypedInput('');
      setDirectDayInput('');
    }
  }, [parsedCurrentJalali, isTyping]);

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
    setTypedInput(formatJalaliNumeric(viewYear, viewMonth, day));
    setIsOpen(false);
    setDirectDayInput('');
  };

  const handleDirectDateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDay = toEnglishDigits(directDayInput).trim();
    const dayNum = parseInt(cleanDay, 10);
    const cleanYear = toEnglishDigits(directYearInput).trim();
    const yearNum = parseInt(cleanYear, 10);
    const monthNum = directMonthInput;

    const targetYear = !isNaN(yearNum) && yearNum >= 1300 && yearNum <= 1500 ? yearNum : viewYear;
    const targetMonth = monthNum >= 1 && monthNum <= 12 ? monthNum : viewMonth;
    const maxDays = getJalaliMonthDays(targetYear, targetMonth);

    if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= maxDays) {
      const gDate = jalaliToGregorian(targetYear, targetMonth, dayNum);
      const iso = `${gDate.gy}-${String(gDate.gm).padStart(2, '0')}-${String(gDate.gd).padStart(2, '0')}`;
      onChange(iso);
      setViewYear(targetYear);
      setViewMonth(targetMonth);
      setTypedInput(formatJalaliNumeric(targetYear, targetMonth, dayNum));
      setIsOpen(false);
      setDirectDayInput('');
    } else {
      setViewYear(targetYear);
      setViewMonth(targetMonth);
    }
  };

  const handleDirectDaySubmit = handleDirectDateSubmit;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(true);
    const text = e.target.value;
    setTypedInput(text);
    const iso = parseJalaliToGregorianIso(text);
    if (iso) {
      onChange(iso);
      const parsed = parseJalaliInput(text);
      if (parsed) {
        setViewYear(parsed.jy);
        setViewMonth(parsed.jm);
      }
    }
  };

  const handleInputBlur = () => {
    setIsTyping(false);
    if (!typedInput.trim()) {
      onChange('');
      return;
    }
    const iso = parseJalaliToGregorianIso(typedInput);
    if (iso) {
      onChange(iso);
      const parsed = parseJalaliInput(typedInput);
      if (parsed) {
        setViewYear(parsed.jy);
        setViewMonth(parsed.jm);
        setTypedInput(formatJalaliNumeric(parsed.jy, parsed.jm, parsed.jd));
      }
    } else if (parsedCurrentJalali) {
      setTypedInput(formatJalaliNumeric(parsedCurrentJalali.jy, parsedCurrentJalali.jm, parsedCurrentJalali.jd));
    } else {
      setTypedInput('');
    }
  };

  const setToday = () => {
    const gDate = jalaliToGregorian(todayJalali.jy, todayJalali.jm, todayJalali.jd);
    const iso = `${gDate.gy}-${String(gDate.gm).padStart(2, '0')}-${String(gDate.gd).padStart(2, '0')}`;
    onChange(iso);
    setViewYear(todayJalali.jy);
    setViewMonth(todayJalali.jm);
    setTypedInput(formatJalaliNumeric(todayJalali.jy, todayJalali.jm, todayJalali.jd));
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
    setTypedInput(formatJalaliNumeric(j.jy, j.jm, j.jd));
    setIsOpen(false);
  };

  const displayString = value ? formatToJalali(value, 'full', true) : '';

  return (
    <div className={`relative ${className}`} ref={containerRef} dir="rtl">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {/* Trigger & Direct Typing Input Container */}
      <div
        className={`h-11 px-2.5 sm:px-3 rounded-xl border flex items-center justify-between transition ${
          disabled
            ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
            : error
            ? 'bg-white dark:bg-slate-800 border-rose-500/80 text-slate-800 dark:text-slate-100 ring-1 ring-rose-500/40'
            : isOpen
            ? 'bg-white dark:bg-slate-800 border-purple-500 text-slate-800 dark:text-slate-100 ring-1 ring-purple-500/50'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-purple-400 dark:hover:border-slate-600'
        }`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="p-1 rounded text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition shrink-0 cursor-pointer"
          title="مشاهده تقویم و انتخاب روز"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>

        {/* Direct typing field for Jalali date */}
        <input
          type="text"
          disabled={disabled}
          value={typedInput}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => {
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleInputBlur();
              setIsOpen(false);
            }
          }}
          placeholder={placeholder || 'مثلاً: ۱۴۰۳/۰۷/۱۵'}
          className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-mono"
        />

        <div className="flex items-center gap-1 shrink-0">
          {displayString && (
            <span className="text-[10px] text-slate-400 font-sans hidden md:inline max-w-[110px] truncate">
              {displayString}
            </span>
          )}

          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setTypedInput('');
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              title="پاک کردن تاریخ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            title="تقویم"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
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

          <div className="fixed inset-x-3 bottom-[calc(4.5rem+var(--safe-bottom))] sm:bottom-auto sm:inset-x-auto sm:absolute sm:right-0 sm:mt-1.5 w-auto sm:w-88 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 shadow-2xl shadow-purple-950/30 text-slate-800 dark:text-slate-100 z-50 max-w-[95vw] mx-auto animate-in fade-in sm:zoom-in-95 duration-150">
            {/* Direct Day, Month & Year Typing Section */}
            <div className="mb-2.5 p-2 rounded-xl bg-purple-50/60 dark:bg-slate-800/80 border border-purple-200/80 dark:border-slate-700/60 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-purple-900 dark:text-purple-300">
                <span>تایپ و تنظیم سریع تاریخ:</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {toPersianDigits(daysInMonth)} روز
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Day Input */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700 rounded-lg px-1.5 py-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">روز:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={directDayInput}
                    onChange={(e) => setDirectDayInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleDirectDateSubmit();
                      }
                    }}
                    placeholder={`۱-${daysInMonth}`}
                    className="w-10 text-center text-xs font-mono font-bold text-purple-700 dark:text-purple-300 bg-transparent focus:outline-none"
                    title={`شماره روز (۱ تا ${daysInMonth})`}
                  />
                </div>

                {/* Month Select */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700 rounded-lg px-1.5 py-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">ماه:</span>
                  <select
                    value={directMonthInput}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setDirectMonthInput(m);
                      setViewMonth(m);
                    }}
                    className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {PERSIAN_MONTH_NAMES.map((name, idx) => (
                      <option key={idx} value={idx + 1} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Input */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700 rounded-lg px-1.5 py-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">سال:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={directYearInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDirectYearInput(val);
                      const clean = toEnglishDigits(val).trim();
                      const y = parseInt(clean, 10);
                      if (!isNaN(y) && y >= 1300 && y <= 1500) {
                        setViewYear(y);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleDirectDateSubmit();
                      }
                    }}
                    placeholder="۱۴۰۳"
                    className="w-14 text-center text-xs font-mono font-bold text-purple-700 dark:text-purple-300 bg-transparent focus:outline-none"
                    title="سال شمسی (مثلاً ۱۴۰۳ یا ۱۴۰۴)"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={() => handleDirectDateSubmit()}
                  className="h-6.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-[11px] font-medium transition cursor-pointer shadow-xs mr-auto"
                >
                  تأیید
                </button>
              </div>
            </div>

            {/* Calendar Header: Month & Year Nav */}
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-purple-100 dark:border-slate-800 gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition cursor-pointer shrink-0"
                title="ماه قبل"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                <select
                  value={viewMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setViewMonth(m);
                    setDirectMonthInput(m);
                  }}
                  className="bg-transparent font-bold text-xs sm:text-sm text-purple-700 dark:text-purple-300 rounded px-1 py-0.5 border-0 focus:ring-1 focus:ring-purple-500 cursor-pointer text-center"
                  title="انتخاب ماه"
                >
                  {PERSIAN_MONTH_NAMES.map((name, idx) => (
                    <option key={idx} value={idx + 1} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                      {name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  inputMode="numeric"
                  value={directYearInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDirectYearInput(val);
                    const clean = toEnglishDigits(val).trim();
                    const y = parseInt(clean, 10);
                    if (!isNaN(y) && y >= 1300 && y <= 1500) {
                      setViewYear(y);
                    }
                  }}
                  onBlur={() => {
                    const clean = toEnglishDigits(directYearInput).trim();
                    const y = parseInt(clean, 10);
                    if (isNaN(y) || y < 1300 || y > 1500) {
                      setDirectYearInput(String(viewYear));
                    }
                  }}
                  className="w-14 text-center font-mono font-bold text-xs sm:text-sm rounded bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 px-1 py-0.5 focus:outline-none focus:border-purple-500"
                  title="تایپ یا تغییر سال"
                />
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition cursor-pointer shrink-0"
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
                className="flex-1 py-1 px-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-700 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
              >
                امروز
              </button>
              <button
                type="button"
                onClick={setTomorrow}
                className="flex-1 py-1 px-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-700 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
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
                        ? 'bg-purple-50 dark:bg-slate-800 border border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                        : isFriday
                        ? 'text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
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
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
            ? 'bg-white dark:bg-slate-800 border-rose-500/80 text-slate-900 dark:text-slate-100 hover:border-rose-400'
            : isOpen
            ? 'bg-white dark:bg-slate-800 border-purple-500 text-slate-900 dark:text-slate-100 ring-1 ring-purple-500/50'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-purple-300 dark:hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-1.5" dir="ltr">
          <Clock className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-purple-600 dark:text-purple-400 shrink-0`} />
          <span className={`${compact ? 'text-xs font-semibold' : 'text-xs sm:text-sm font-bold'} font-mono tracking-wider text-slate-800 dark:text-slate-100`}>
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
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 shadow-2xl p-4 text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">انتخاب و تنظیم ساعت</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">ساعت و دقیقه مورد نظر خود را مشخص کنید</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-purple-700 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer border border-purple-100 dark:border-transparent"
                title="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Digital Clock Display with Nudge Buttons (clean white & purple tint in light mode) */}
            <div className="bg-purple-50/50 dark:bg-slate-800/80 rounded-xl p-3 border border-purple-200/80 dark:border-slate-700/70 mb-3 flex flex-col items-center shadow-xs">
              <div className="flex items-center justify-center gap-4 w-full" dir="ltr">
                {/* Hours Display & Adjust */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateTime(hours - 1, minutes)}
                      className="w-7 h-6 rounded bg-white dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 text-xs font-bold text-purple-700 dark:text-slate-200 border border-purple-200/80 dark:border-transparent flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                      title="یک ساعت قبل"
                    >
                      -
                    </button>
                    <div className="w-14 h-10 rounded-lg bg-white dark:bg-slate-900 border border-purple-400 dark:border-purple-500/60 flex items-center justify-center font-mono text-xl font-bold text-purple-700 dark:text-purple-300 shadow-xs">
                      {String(hours).padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateTime(hours + 1, minutes)}
                      className="w-7 h-6 rounded bg-white dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 text-xs font-bold text-purple-700 dark:text-slate-200 border border-purple-200/80 dark:border-transparent flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                      title="یک ساعت بعد"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">ساعت</span>
                </div>

                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono self-center mb-4">:</span>

                {/* Minutes Display & Adjust */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateTime(hours, minutes - 5)}
                      className="w-7 h-6 rounded bg-white dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 text-xs font-bold text-purple-700 dark:text-slate-200 border border-purple-200/80 dark:border-transparent flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                      title="۵ دقیقه قبل"
                    >
                      -
                    </button>
                    <div className="w-14 h-10 rounded-lg bg-white dark:bg-slate-900 border border-purple-400 dark:border-purple-500/60 flex items-center justify-center font-mono text-xl font-bold text-purple-700 dark:text-purple-300 shadow-xs">
                      {String(minutes).padStart(2, '0')}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateTime(hours, minutes + 5)}
                      className="w-7 h-6 rounded bg-white dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 text-xs font-bold text-purple-700 dark:text-slate-200 border border-purple-200/80 dark:border-transparent flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                      title="۵ دقیقه بعد"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">دقیقه</span>
                </div>
              </div>
            </div>

            {/* Direct Side-by-Side Selection Columns (Hour Column on Left, Minute Column on Right) */}
            <div className="grid grid-cols-2 gap-2 mb-3 flex-1 min-h-0" dir="ltr">
              {/* Hours Column (Left) */}
              <div className="flex flex-col min-h-0">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block text-center" dir="rtl">
                  ساعت (۰ تا ۲۳)
                </span>
                <div className="h-36 overflow-y-auto rounded-xl bg-purple-50/20 dark:bg-slate-950/70 border border-purple-200/70 dark:border-slate-800 p-1 space-y-1 shadow-2xs">
                  {hourOptions.map((h) => {
                    const isSelected = h === hours;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => updateTime(h, minutes)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white font-bold shadow-sm'
                            : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-purple-100/50 dark:border-slate-800/60 hover:bg-purple-50 dark:hover:bg-slate-800/80 hover:text-purple-700 dark:hover:text-white'
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
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block text-center" dir="rtl">
                  دقیقه (۰۰ تا ۵۵)
                </span>
                <div className="h-36 overflow-y-auto rounded-xl bg-purple-50/20 dark:bg-slate-950/70 border border-purple-200/70 dark:border-slate-800 p-1 space-y-1 shadow-2xs">
                  {minuteOptions.map((m) => {
                    const isSelected = m === minutes;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => updateTime(hours, m)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white font-bold shadow-sm'
                            : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-purple-100/50 dark:border-slate-800/60 hover:bg-purple-50 dark:hover:bg-slate-800/80 hover:text-purple-700 dark:hover:text-white'
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
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
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
                        : 'bg-white dark:bg-slate-800/70 border-purple-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 hover:border-purple-300 hover:text-purple-700 dark:hover:text-white shadow-2xs'
                    }`}
                    title={q.label}
                  >
                    {q.val}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-purple-100 dark:border-slate-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30"
              >
                <Check className="w-4 h-4" />
                <span>تایید و اعمال ساعت</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition cursor-pointer shadow-2xs"
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
