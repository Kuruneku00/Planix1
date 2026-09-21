import React from 'react';
import { useApp } from '../../context/AppContext';
import { MascotAvatar } from './MascotAvatar';

interface MascotHelpButtonProps {
  compact?: boolean;
  className?: string;
  initialStep?: number;
}

export const MascotHelpButton: React.FC<MascotHelpButtonProps> = ({
  compact = false,
  className = '',
  initialStep = 0,
}) => {
  const { openMascotTour } = useApp();

  return (
    <button
      type="button"
      onClick={() => openMascotTour(initialStep)}
      className={`relative group flex items-center justify-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-500/60 transition shadow-sm cursor-pointer active:scale-95 shrink-0 ${className}`}
      title="راهنمای هوشمند برنامه (ممد)"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center bg-orange-500/10">
        <MascotAvatar size="xs" showBadge={false} />
      </div>

      {!compact && (
        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-bold text-orange-500 dark:text-orange-300 group-hover:text-orange-600 dark:group-hover:text-orange-200 block leading-tight">
            راهنمای ممد
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 block leading-none">
            ممد مربی شما
          </span>
        </div>
      )}

      {/* Pulsing indicator dot */}
      <span className="absolute 0 -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-white dark:ring-slate-900" />
    </button>
  );
};
