import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';
import { db } from '../../services/db';
import { toPersianDigits } from '../../utils/jalali';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  CalendarDays,
  Columns3,
  CheckSquare,
  FolderKanban,
  Target,
  Flame,
  FileText,
  Bell,
  Timer,
  Clock,
  BarChart3,
  Paperclip,
  BookmarkPlus,
  RefreshCw,
  Database,
  Settings,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Compass,
} from 'lucide-react';
import { MascotAvatar } from '../mascot/MascotAvatar';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, setCollapsed }) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;
  const handleToggle = (val: boolean) => {
    if (setCollapsed) {
      setCollapsed(val);
    } else {
      setInternalCollapsed(val);
    }
  };
  const { activeView, setActiveView, refreshTrigger, settings, openMascotTour } = useApp();

  // Get real live counts from DB for badges
  const pendingTasksCount = React.useMemo(() => {
    return db.getTasks().filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length;
  }, [refreshTrigger]);

  const activeProjectsCount = React.useMemo(() => {
    return db.getProjects().filter((p) => p.status === 'in_progress').length;
  }, [refreshTrigger]);

  const activeHabitsCount = React.useMemo(() => {
    return db.getHabits().length;
  }, [refreshTrigger]);

  const uncompletedRemindersCount = React.useMemo(() => {
    return db.getReminders().filter((r) => !r.isCompleted).length;
  }, [refreshTrigger]);

  const sections: NavSection[] = [
    {
      title: 'مدیریت و کارها',
      items: [
        { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
        { id: 'tasks', label: 'وظایف', icon: CheckSquare, badgeCount: pendingTasksCount },
        { id: 'projects', label: 'پروژه‌ها', icon: FolderKanban, badgeCount: activeProjectsCount },
        { id: 'calendar', label: 'تقویم', icon: CalendarIcon },
      ],
    },
    {
      title: 'برنامه‌ریزی و رشد',
      items: [
        { id: 'daily_planner', label: 'برنامه روزانه', icon: CalendarDays },
        { id: 'weekly_planner', label: 'برنامه هفتگی', icon: Columns3 },
        { id: 'goals', label: 'اهداف', icon: Target },
        { id: 'habits', label: 'عادت‌ها', icon: Flame, badgeCount: activeHabitsCount },
      ],
    },
    {
      title: 'ابزارها و تمرکز',
      items: [
        { id: 'pomodoro', label: 'تایمر و پومودورو', icon: Timer },
        { id: 'time_management', label: 'مدیریت زمان', icon: Clock },
        { id: 'notes', label: 'یادداشت‌ها', icon: FileText },
        { id: 'reminders', label: 'یادآورها', icon: Bell, badgeCount: uncompletedRemindersCount },
      ],
    },
    {
      title: 'تحلیل و تنظیمات',
      items: [
        { id: 'reports', label: 'آمار و گزارش‌ها', icon: BarChart3 },
        { id: 'files', label: 'فایل‌ها و پیوست‌ها', icon: Paperclip },
        { id: 'templates', label: 'قالب‌ها', icon: BookmarkPlus },
        { id: 'sync', label: 'همگام‌سازی', icon: RefreshCw },
        { id: 'backup', label: 'نسخه پشتیبان', icon: Database },
        { id: 'settings', label: 'تنظیمات', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`hidden lg:flex flex-col flex-shrink-0 bg-white dark:bg-[#060813] border-l border-slate-200/90 dark:border-[#161c2e] text-slate-800 dark:text-slate-100 transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      dir="rtl"
    >
      {/* Brand Header */}
      <div className="h-14 sm:h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 shadow-sm flex items-center justify-center p-1 shrink-0">
              <img
                src="/logo.png"
                alt="لوگوی پلنر"
                className="w-full h-full object-contain drop-shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="font-black tracking-tight text-[#8B3DFF]">Planix</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                  حرفه‌ای
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">برنامه‌ریزی هوشمند</p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 shadow-sm flex items-center justify-center p-1 shrink-0">
            <img
              src="/logo.png"
              alt="لوگوی پلنر"
              className="w-full h-full object-contain drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => handleToggle(!isCollapsed)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          title={isCollapsed ? 'گسترش منو' : 'جمع کردن منو'}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer group relative ${
                    isActive
                      ? 'bg-[#8B3DFF] text-white shadow-md shadow-purple-900/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#8B3DFF]'
                      }`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-purple-800 text-purple-100'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      {settings.persianDigits ? toPersianDigits(item.badgeCount) : item.badgeCount}
                    </span>
                  )}

                  {isCollapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mascot Companion Guide Card */}
      <div className="px-3 py-2 border-t border-slate-200/80 dark:border-slate-800/80">
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => openMascotTour(0)}
            className="w-full flex items-center justify-center p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer relative group"
            title="راهنمای هوشمند بخش‌ها (فوکسی)"
          >
            <MascotAvatar size="xs" showBadge={false} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
          </button>
        ) : (
          <div
            onClick={() => openMascotTour(0)}
            className="p-2.5 rounded-2xl bg-purple-50 dark:bg-slate-800/50 hover:bg-purple-100/80 dark:hover:bg-slate-800/80 border border-purple-200 dark:border-slate-700/70 hover:border-[#8B3DFF]/50 transition cursor-pointer group shadow-sm flex items-center gap-2.5"
          >
            <MascotAvatar size="sm" animated={true} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#8B3DFF] truncate">
                  راهنمای بخش‌ها 🦊
                </span>
                <span className="px-1 py-0.2 rounded bg-[#8B3DFF]/15 text-[9px] text-[#8B3DFF] font-semibold">
                  تور
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                توضیح مرحله‌به‌مرحله بخش‌ها
              </p>
            </div>
            <Compass className="w-4 h-4 text-[#8B3DFF] group-hover:rotate-45 transition-transform shrink-0" />
          </div>
        )}
      </div>

      {/* Sidebar Footer / User Profile & Toggle */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className="w-full h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="گسترش منو"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {settings.userName ? settings.userName.charAt(0) : 'ک'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {settings.userName || 'کاربر پلنر'}
                </div>
                <div className="text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block"></span>
                  <span>آفلاین / ذخیره محلی</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('settings')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
              title="تنظیمات"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              ساخته شده در <span className="text-[#8B3DFF] font-bold">رومی لند</span> توسط <span className="text-[#8B3DFF] font-bold">یگانه بابایی</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
