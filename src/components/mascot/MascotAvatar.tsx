import React from 'react';

interface MascotAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  showBadge?: boolean;
  badgeText?: string;
  onClick?: () => void;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  size = 'md',
  animated = false,
  className = '',
  showBadge = false,
  badgeText = 'راهنما',
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  const containerSizes = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Outer ambient glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-orange-500/30 blur-md transition-opacity ${
          onClick ? 'group-hover:opacity-100 opacity-60' : 'opacity-70'
        }`}
      />

      {/* Mascot Image Frame */}
      <div
        className={`${containerSizes} rounded-2xl overflow-hidden bg-slate-950 border-2 border-orange-500/60 shadow-lg shadow-orange-950/40 relative z-10 flex items-center justify-center transition-transform ${
          animated ? 'animate-mascot-float' : ''
        } ${onClick ? 'group-hover:scale-105 active:scale-95' : ''}`}
      >
        <img
          src="/mascot.png"
          alt="ممد — دستیار هوشمند Planix"
          className="w-full h-full object-cover object-top"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>

      {/* Optional Badge */}
      {showBadge && (
        <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold shadow-md shadow-orange-950/60 z-20 whitespace-nowrap">
          {badgeText}
        </span>
      )}
    </div>
  );
};
