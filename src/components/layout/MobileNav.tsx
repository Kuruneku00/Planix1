import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  CalendarDays,
  Menu,
  Plus,
  X,
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
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  Moon,
  Grid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotAvatar } from '../mascot/MascotAvatar';

interface MobileNavProps {
  drawerOpen?: boolean;
  setDrawerOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ drawerOpen, setDrawerOpen }) => {
  const [internalDrawerOpen, setInternalDrawerOpen] = React.useState(false);
  const isDrawerOpen = drawerOpen !== undefined ? drawerOpen : internalDrawerOpen;

  const handleSetDrawerOpen = (open: boolean | ((prev: boolean) => boolean)) => {
    if (setDrawerOpen) {
      setDrawerOpen(open);
    } else {
      setInternalDrawerOpen(open);
    }
  };

  const { activeView, setActiveView, openQuickAdd, settings, updateSettings, openMascotTour, openMascotGuide } = useApp();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const allViews: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'tasks', label: 'وظایف', icon: CheckSquare },
    { id: 'projects', label: 'پروژه‌ها', icon: FolderKanban },
    { id: 'calendar', label: 'تقویم', icon: CalendarIcon },
    { id: 'daily_planner', label: 'برنامه روزانه', icon: CalendarDays },
    { id: 'weekly_planner', label: 'برنامه هفتگی', icon: CalendarDays },
    { id: 'goals', label: 'اهداف', icon: Target },
    { id: 'habits', label: 'عادت‌ها', icon: Flame },
    { id: 'pomodoro', label: 'تایمر پومودورو', icon: Timer },
    { id: 'time_management', label: 'مدیریت زمان', icon: Clock },
    { id: 'notes', label: 'یادداشت‌ها', icon: FileText },
    { id: 'reminders', label: 'یادآورها', icon: Bell },
    { id: 'reports', label: 'گزارش‌ها', icon: BarChart3 },
    { id: 'files', label: 'فایل‌ها', icon: Paperclip },
    { id: 'templates', label: 'قالب‌ها', icon: BookmarkPlus },
    { id: 'sync', label: 'همگام‌سازی', icon: RefreshCw },
    { id: 'backup', label: 'پشتیبان‌گیری', icon: Database },
    { id: 'settings', label: 'تنظیمات', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Bottom Navigation Bar for Mobile: 5 symmetric items with + strictly centered */}
      <div
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#060813] backdrop-blur-md border-t border-slate-200 dark:border-[#161c2e] z-40 grid grid-cols-5 items-center px-1"
        style={{
          paddingBottom: 'var(--safe-bottom)',
          height: 'calc(4rem + var(--safe-bottom))',
        }}
        dir="rtl"
      >
        {/* 1. Dashboard */}
        <button
          type="button"
          onClick={() => {
            setActiveView('dashboard');
            handleSetDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 h-full transition cursor-pointer ${
            activeView === 'dashboard'
              ? 'text-[#8B3DFF] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] truncate">داشبورد</span>
        </button>

        {/* 2. Tasks */}
        <button
          type="button"
          onClick={() => {
            setActiveView('tasks');
            handleSetDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 h-full transition cursor-pointer ${
            activeView === 'tasks'
              ? 'text-[#8B3DFF] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] truncate">وظایف</span>
        </button>

        {/* 3. Center Quick Add (+) Button */}
        <div className="flex items-center justify-center">
          <button
            id="mobile-center-add-btn"
            type="button"
            onClick={() => openQuickAdd()}
            className="relative -top-3 w-12 h-12 rounded-2xl bg-[#8B3DFF] hover:bg-[#7430D9] text-white flex items-center justify-center shadow-lg shadow-purple-600/40 transition active:scale-90 cursor-pointer"
            title="ایجاد سریع (+)"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 4. Calendar */}
        <button
          type="button"
          onClick={() => {
            setActiveView('calendar');
            handleSetDrawerOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 h-full transition cursor-pointer ${
            activeView === 'calendar'
              ? 'text-[#8B3DFF] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px] truncate">تقویم</span>
        </button>

        {/* 5. More Menu */}
        <button
          type="button"
          onClick={() => handleSetDrawerOpen(!isDrawerOpen)}
          className={`flex flex-col items-center justify-center gap-1 h-full transition cursor-pointer ${
            isDrawerOpen
              ? 'text-[#8B3DFF] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] truncate">بیشتر</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-hidden" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleSetDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-[#060813] border-l border-slate-200 dark:border-[#161c2e] text-slate-800 dark:text-slate-100 flex flex-col z-10 shadow-2xl transition-colors duration-200"
            >
              {/* Drawer Header */}
              <div
                className="px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0"
                style={{
                  paddingTop: 'var(--safe-top)',
                  minHeight: 'calc(3.5rem + var(--safe-top))',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/40 text-[#8B3DFF] flex items-center justify-center shrink-0">
                    <Grid className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">منوی بخش‌ها</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    title={settings.theme === 'dark' ? 'تم روشن' : 'تم تاریک'}
                  >
                    {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8B3DFF]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="بستن منو"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mascot Companions in Mobile Drawer: Practical Guide & Visual Tour */}
              <div className="px-4 pt-3 pb-1 space-y-2">
                {/* Practical live guide for current view */}
                <div
                  onClick={() => {
                    handleSetDrawerOpen(false);
                    openMascotGuide();
                  }}
                  className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 transition flex items-center gap-3 cursor-pointer shadow-sm group active:scale-95"
                >
                  <MascotAvatar size="sm" animated={true} />
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-500 dark:text-amber-300 group-hover:text-amber-400">
                        راهنمای عملی ممد 🦊
                      </span>
                      <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-[9px] text-amber-400 font-bold">
                        بخش جاری
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                      توضیحات و اقدامات کاربردی این بخش در گوشی
                    </p>
                  </div>
                </div>

                {/* Full visual tour button */}
                <div
                  onClick={() => {
                    handleSetDrawerOpen(false);
                    openMascotTour(0);
                  }}
                  className="p-2.5 rounded-xl bg-purple-50 dark:bg-slate-800/60 hover:bg-purple-100/70 dark:hover:bg-slate-800 border border-purple-200 dark:border-slate-700/70 hover:border-purple-400 transition flex items-center justify-between cursor-pointer active:scale-95"
                >
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    راهنمای تصویری کل بخش‌ها
                  </span>
                  <span className="text-[10px] text-[#8B3DFF] font-bold">مشاهده تور ←</span>
                </div>
              </div>

              {/* Drawer Grid Navigation */}
              <div
                className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-2.5"
                style={{
                  paddingBottom: 'calc(4rem + var(--safe-bottom))',
                }}
              >
                {allViews.map((v) => {
                  const Icon = v.icon;
                  const isActive = activeView === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setActiveView(v.id);
                        handleSetDrawerOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
                        isActive
                          ? 'bg-[#8B3DFF] text-white border-[#7430D9] shadow-md shadow-purple-900/20'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span className="text-xs font-medium">{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

