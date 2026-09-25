import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import {
  gregorianToJalali,
  jalaliToGregorian,
  getJalaliMonthDays,
  toPersianDigits,
  toEnglishDigits,
  formatToJalali,
  toGregorianIsoDate,
  parseJalaliInput,
} from '../../utils/jalali';
import { Modal } from '../common/Modal';
import { CalendarEvent, Task } from '../../types';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock,
  MapPin,
  Trash2,
  CheckSquare,
  Share2,
} from 'lucide-react';
import { systemPermissions } from '../../services/systemPermissions';

export const CalendarView: React.FC = () => {
  const { openQuickAdd, refreshTrigger, refreshDb, settings, showToast, showConfirm } = useApp();

  const today = new Date();
  const { jy: jYear, jm: jMonth, jd: jDay } = gregorianToJalali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  const [currentYear, setCurrentYear] = useState(jYear);
  const [currentMonth, setCurrentMonth] = useState(jMonth);
  const [selectedDay, setSelectedDay] = useState<number>(jDay);
  const [selectedDateIso, setSelectedDateIso] = useState<string>(toGregorianIsoDate());

  // Direct typing states for selecting days and dates
  const [dayInputText, setDayInputText] = useState<string>(String(jDay));
  const [yearInputText, setYearInputText] = useState<string>(String(jYear));
  const [dateJumpText, setDateJumpText] = useState<string>('');

  // Database events and tasks
  const allEvents = useMemo(() => db.getEvents(), [refreshTrigger]);
  const allTasks = useMemo(() => db.getTasks(), [refreshTrigger]);

  const monthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  const weekDayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => {
        const y = prev - 1;
        setYearInputText(String(y));
        return y;
      });
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => {
        const y = prev + 1;
        setYearInputText(String(y));
        return y;
      });
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(jYear);
    setCurrentMonth(jMonth);
    setSelectedDay(jDay);
    setDayInputText(String(jDay));
    setYearInputText(String(jYear));
    setSelectedDateIso(toGregorianIsoDate());
  };

  // Build grid for current Jalali month
  const daysInMonth = getJalaliMonthDays(currentYear, currentMonth);

  // First day of month's day of week (0 = Saturday, 6 = Friday)
  const { gy: fGy, gm: fGm, gd: fGd } = jalaliToGregorian(currentYear, currentMonth, 1);
  const firstDayDateObj = new Date(fGy, fGm - 1, fGd);
  const jsDay = firstDayDateObj.getDay();
  const firstDayOffset = (jsDay + 1) % 7;

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setDayInputText(String(day));
    const { gy, gm, gd } = jalaliToGregorian(currentYear, currentMonth, day);
    const iso = `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
    setSelectedDateIso(iso);
  };

  const handleDayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDayInputText(val);
    const clean = toEnglishDigits(val).trim();
    const num = parseInt(clean, 10);
    if (!isNaN(num) && num >= 1 && num <= daysInMonth) {
      handleSelectDay(num);
    }
  };

  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setYearInputText(val);
    const clean = toEnglishDigits(val).trim();
    const y = parseInt(clean, 10);
    if (!isNaN(y) && y >= 1300 && y <= 1500) {
      setCurrentYear(y);
      const maxDays = getJalaliMonthDays(y, currentMonth);
      const newDay = Math.min(selectedDay, maxDays);
      setSelectedDay(newDay);
      setDayInputText(String(newDay));
      const { gy, gm, gd } = jalaliToGregorian(y, currentMonth, newDay);
      setSelectedDateIso(`${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`);
    }
  };

  const handleMonthSelectChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
    const maxDays = getJalaliMonthDays(currentYear, newMonth);
    const newDay = Math.min(selectedDay, maxDays);
    setSelectedDay(newDay);
    setDayInputText(String(newDay));
    const { gy, gm, gd } = jalaliToGregorian(currentYear, newMonth, newDay);
    setSelectedDateIso(`${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`);
  };

  const handleApplyDirectDate = () => {
    const cleanDay = toEnglishDigits(dayInputText).trim();
    const dayNum = parseInt(cleanDay, 10);
    const cleanYear = toEnglishDigits(yearInputText).trim();
    const yearNum = parseInt(cleanYear, 10);
    const y = !isNaN(yearNum) && yearNum >= 1300 && yearNum <= 1500 ? yearNum : currentYear;
    const maxDays = getJalaliMonthDays(y, currentMonth);
    const d = !isNaN(dayNum) && dayNum >= 1 && dayNum <= maxDays ? dayNum : Math.min(selectedDay, maxDays);

    setCurrentYear(y);
    setSelectedDay(d);
    setDayInputText(String(d));
    setYearInputText(String(y));
    const { gy, gm, gd } = jalaliToGregorian(y, currentMonth, d);
    setSelectedDateIso(`${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`);
    showToast(`تاریخ انتخاب شد: ${y}/${currentMonth}/${d}`, 'success');
  };

  const handleJumpToDate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseJalaliInput(dateJumpText);
    if (!parsed) {
      showToast('لطفاً تاریخ معتبر شمسی (مثلاً ۱۴۰۳/۰۷/۱۵) وارد کنید.', 'error');
      return;
    }
    setCurrentYear(parsed.jy);
    setCurrentMonth(parsed.jm);
    setYearInputText(String(parsed.jy));
    handleSelectDay(parsed.jd);
    showToast(`انتقال به تاریخ ${parsed.jy}/${parsed.jm}/${parsed.jd}`, 'success');
    setDateJumpText('');
  };

  // Events on selected day
  const selectedDayEvents = useMemo(() => {
    return allEvents.filter((e) => e.startDate === selectedDateIso);
  }, [allEvents, selectedDateIso]);

  // Tasks due on selected day
  const selectedDayTasks = useMemo(() => {
    return allTasks.filter((t) => t.dueDate === selectedDateIso);
  }, [allTasks, selectedDateIso]);

  const handleDeleteEvent = (event: CalendarEvent) => {
    showConfirm({
      title: 'حذف رویداد',
      message: `آیا از حذف رویداد «${event.title}» اطمینان دارید؟`,
      onConfirm: () => {
        db.deleteEvent(event.id);
        showToast('رویداد با موفقیت حذف شد.', 'info');
        refreshDb();
      },
    });
  };

  const handleToggleTask = (task: Task) => {
    if (task.status === 'completed') {
      showConfirm({
        title: 'لغو وضعیت انجام شده',
        message: `آیا از لغو وضعیت انجام شده وظیفه «${task.title}» مطمئن هستید؟`,
        confirmText: 'بله، لغو شود',
        cancelText: 'انصراف',
        isDanger: false,
        onConfirm: () => {
          db.toggleTaskStatus(task.id);
          refreshDb();
        },
      });
    } else {
      db.toggleTaskStatus(task.id);
      refreshDb();
    }
  };

  return (
    <div id="calendar-view" className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8" dir="rtl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            <span>تقویم جامع خورشیدی</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مشاهده رویدادها، سررسیدها و برنامه‌ریزی ماهانه و روزانه
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
          {/* Month & Year Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="ماه قبل"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <select
              value={currentMonth}
              onChange={(e) => handleMonthSelectChange(Number(e.target.value))}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 px-1.5 py-1 rounded-lg border border-purple-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer text-center"
              title="انتخاب ماه"
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx + 1} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {name}
                </option>
              ))}
            </select>

            <input
              type="text"
              inputMode="numeric"
              value={yearInputText}
              onChange={handleYearInputChange}
              onBlur={() => {
                const clean = toEnglishDigits(yearInputText).trim();
                const y = parseInt(clean, 10);
                if (isNaN(y) || y < 1300 || y > 1500) {
                  setYearInputText(String(currentYear));
                }
              }}
              className="w-14 sm:w-16 text-center text-xs sm:text-sm font-bold font-mono text-purple-600 dark:text-purple-300 bg-purple-50/50 dark:bg-slate-800/80 rounded-lg px-1 py-1 border border-purple-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              title="تایپ یا تغییر سال"
            />

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="ماه بعد"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-300 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-semibold transition cursor-pointer"
          >
            امروز
          </button>

          <button
            type="button"
            onClick={() => openQuickAdd('event')}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-purple-950/20 transition cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>رویداد</span>
          </button>
        </div>
      </div>

      {/* Quick Day, Month & Year Direct Input Bar */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Direct Day, Month & Year Typing */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            تایپ و تنظیم سریع تاریخ:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Day */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">روز:</span>
              <input
                type="text"
                inputMode="numeric"
                value={dayInputText}
                onChange={handleDayInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyDirectDate();
                  }
                }}
                placeholder={`۱-${daysInMonth}`}
                className="w-10 sm:w-12 text-center text-xs sm:text-sm font-bold font-mono text-purple-600 dark:text-purple-300 bg-transparent focus:outline-none"
                title={`شماره روز (۱ تا ${daysInMonth})`}
              />
            </div>

            {/* Month */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">ماه:</span>
              <select
                value={currentMonth}
                onChange={(e) => handleMonthSelectChange(Number(e.target.value))}
                className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx + 1} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    {name} ({idx + 1})
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">سال:</span>
              <input
                type="text"
                inputMode="numeric"
                value={yearInputText}
                onChange={handleYearInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyDirectDate();
                  }
                }}
                placeholder="۱۴۰۳"
                className="w-14 sm:w-16 text-center text-xs sm:text-sm font-bold font-mono text-purple-600 dark:text-purple-300 bg-transparent focus:outline-none"
                title="سال شمسی (مثلاً ۱۴۰۳ یا ۱۴۰۴)"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyDirectDate}
              className="h-8.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-medium transition cursor-pointer shadow-xs"
            >
              تأیید
            </button>
          </div>
        </div>

        {/* Full Jalali Date Jump */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            پرش به تاریخ:
          </span>
          <input
            type="text"
            value={dateJumpText}
            onChange={(e) => setDateJumpText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleJumpToDate();
              }
            }}
            placeholder="مثلاً: ۱۴۰۳/۰۷/۱۵"
            className="w-32 sm:w-36 h-9 px-2.5 text-center text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={() => handleJumpToDate()}
            disabled={!dateJumpText.trim()}
            className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-medium transition cursor-pointer shrink-0"
          >
            برو
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Calendar Matrix + Day Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar Month Grid */}
        <div className="lg:col-span-2 p-3.5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4 shadow-xs">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
            {weekDayNames.map((d, i) => (
              <div
                key={d}
                className={`py-1.5 sm:py-2 rounded-lg ${i === 6 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {/* Empty slots for offset */}
            {Array.from({ length: firstDayOffset }).map((_, idx) => (
              <div key={`offset_${idx}`} className="h-12 sm:h-20 rounded-lg sm:rounded-xl bg-slate-50/60 dark:bg-slate-900/20" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isToday =
                currentYear === jYear && currentMonth === jMonth && dayNum === jDay;
              const isSelected = selectedDay === dayNum;

              // Convert to Gregorian ISO to check events
              const { gy, gm, gd } = jalaliToGregorian(currentYear, currentMonth, dayNum);
              const iso = `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;

              const dayEvents = allEvents.filter((e) => e.startDate === iso);
              const dayTasks = allTasks.filter((t) => t.dueDate === iso);

              // Check if Friday
              const dayOfWeek = (firstDayOffset + idx) % 7;
              const isFriday = dayOfWeek === 6;

              return (
                <div
                  key={dayNum}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-12 sm:h-20 p-1 sm:p-2 rounded-lg sm:rounded-xl border flex flex-col justify-between transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-500 ring-1 ring-purple-500'
                      : isToday
                      ? 'bg-purple-50 dark:bg-slate-800/90 border-purple-400 dark:border-purple-600/60'
                      : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] sm:text-xs font-bold font-mono ${
                        isToday
                          ? 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] sm:text-xs shadow-xs'
                          : isFriday
                          ? 'text-rose-500'
                          : isSelected
                          ? 'text-purple-700 dark:text-purple-300 font-extrabold'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {settings.persianDigits ? toPersianDigits(dayNum) : dayNum}
                    </span>

                    {(dayEvents.length > 0 || dayTasks.length > 0) && (
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {dayEvents.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        )}
                        {dayTasks.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Desktop Preview */}
                  <div className="hidden sm:block space-y-0.5 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 1).map((evt) => (
                      <div
                        key={evt.id}
                        className="text-[10px] px-1 py-0.5 rounded truncate bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-700/30 font-medium"
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayTasks.slice(0, 1).map((tsk) => (
                      <div
                        key={tsk.id}
                        className="text-[10px] px-1 py-0.5 rounded truncate bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        ✓ {tsk.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Sidebar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  برنامه‌های روز {settings.persianDigits ? toPersianDigits(selectedDay) : selectedDay} {monthNames[currentMonth - 1]}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {formatToJalali(selectedDateIso, 'full', settings.persianDigits)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => openQuickAdd('event')}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 transition cursor-pointer"
                title="افزودن رویداد به این روز"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Events List for Selected Day */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-purple-500" />
                  <span>رویدادها و جلسات:</span>
                </h4>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">هیچ رویدادی برای این روز ثبت نشده است.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">{ev.title}</h5>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              title="افزودن به تقویم گوشی"
                              onClick={() => {
                                systemPermissions.exportToDeviceCalendar({
                                  title: ev.title,
                                  description: ev.description,
                                  location: ev.location,
                                  startDate: ev.startDate,
                                  startTime: ev.startTime,
                                  endTime: ev.endTime,
                                });
                                showToast('رویداد به تقویم دستگاه ارسال شد.', 'success');
                              }}
                              className="text-slate-400 hover:text-emerald-500 p-1 transition cursor-pointer"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(ev)}
                              className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-purple-500" />
                            <span>
                              {settings.persianDigits ? toPersianDigits(ev.startTime) : ev.startTime} تا{' '}
                              {settings.persianDigits ? toPersianDigits(ev.endTime) : ev.endTime}
                            </span>
                          </div>
                          {ev.location && (
                            <div className="flex items-center gap-1 font-sans">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              <span className="truncate">{ev.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks due on this day */}
              <div>
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>وظایف با سررسید این روز:</span>
                </h4>

                {selectedDayTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">وظیفه‌ای برای این روز تنظیم نشده است.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedDayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTask(t)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                          t.status === 'completed'
                            ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800/40 text-slate-400 dark:text-slate-500 line-through'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:border-purple-300 dark:hover:border-purple-800/50'
                        }`}
                      >
                        <span className="truncate">{t.title}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-sans ${
                            t.status === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {t.status === 'completed' ? 'انجام شد' : 'در انتظار'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openQuickAdd('task')}
            className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800/60 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن وظیفه به این روز</span>
          </button>
        </div>
      </div>
    </div>
  );
};
