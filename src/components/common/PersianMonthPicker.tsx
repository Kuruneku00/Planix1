import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Calendar, X } from 'lucide-react';
import { PERSIAN_MONTH_NAMES, toPersianDigits } from '../../utils/jalali';

export interface PersianMonthPickerProps {
  value: number; // 1 to 12
  onChange: (month: number) => void;
  variant?: 'header' | 'compact' | 'input';
  showNumber?: boolean;
  className?: string;
  persianDigits?: boolean;
}

const SEASONS = [
  { name: 'بهار', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800/40' },
  { name: 'تابستان', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800/40' },
  { name: 'پاییز', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800/40' },
  { name: 'زمستان', color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40', border: 'border-sky-200 dark:border-sky-800/40' },
];

export const PersianMonthPicker: React.FC<PersianMonthPickerProps> = ({
  value,
  onChange,
  variant = 'compact',
  showNumber = true,
  className = '',
  persianDigits = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const currentMonthName = PERSIAN_MONTH_NAMES[value - 1] || 'فروردین';

  const formatNumber = (num: number) => {
    return persianDigits ? toPersianDigits(num) : String(num);
  };

  const handleSelect = (m: number) => {
    onChange(m);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef} dir="rtl">
      {/* Trigger Button */}
      {variant === 'header' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-extrabold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/50 transition cursor-pointer select-none active:scale-95 ${
            isOpen ? 'ring-2 ring-purple-500/40 bg-purple-50 dark:bg-purple-950/60' : ''
          }`}
          title="انتخاب ماه"
        >
          <span>{currentMonthName}</span>
          {showNumber && (
            <span className="text-[10px] font-mono opacity-75">
              ({formatNumber(value)})
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : variant === 'input' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-7 px-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer flex items-center justify-between gap-1 select-none ${
            isOpen ? 'ring-2 ring-purple-500/30 border-purple-500' : ''
          }`}
          title="انتخاب ماه"
        >
          <span className="truncate">{currentMonthName}</span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-purple-500' : ''
            }`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer select-none active:scale-98 ${
            isOpen ? 'ring-2 ring-purple-500/40 border-purple-500 bg-purple-50/30' : ''
          }`}
          title="انتخاب ماه"
        >
          <span>{currentMonthName}</span>
          {showNumber && (
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
              ({formatNumber(value)})
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-purple-500' : ''
            }`}
          />
        </button>
      )}

      {/* Themed Month Picker Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Card */}
          <div
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-white dark:bg-[#0c1024] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-2xl shadow-purple-950/40 dark:shadow-purple-950/80 text-slate-800 dark:text-slate-100 select-none animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    انتخاب ماه شمسی
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    ماه مورد نظر خود را لمس کنید
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                title="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 12 Months Grid (3 columns x 4 rows) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {PERSIAN_MONTH_NAMES.map((name, idx) => {
                const monthNum = idx + 1;
                const isSelected = monthNum === value;
                const seasonIdx = Math.floor(idx / 3);
                const season = SEASONS[seasonIdx];

                return (
                  <button
                    key={monthNum}
                    type="button"
                    onClick={() => handleSelect(monthNum)}
                    className={`relative p-2.5 rounded-xl text-center transition cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-lg shadow-purple-900/40 ring-2 ring-purple-400/60 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/70 hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-bold">{name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                          isSelected
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {formatNumber(monthNum)}
                      </span>
                      <span
                        className={`text-[9px] font-medium ${
                          isSelected ? 'text-purple-100' : season.color
                        }`}
                      >
                        {season.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
