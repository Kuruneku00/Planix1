import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import { Goal, GoalType, GoalStatus, Milestone } from '../../types';
import { formatToJalali, toPersianDigits } from '../../utils/jalali';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { PersianDatePicker } from '../common/PersianDateTimePicker';
import {
  Target,
  Plus,
  Search,
  CheckCircle2,
  Calendar as CalendarIcon,
  Trash2,
  Edit2,
  Check,
  Award,
  Sparkles,
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { openQuickAdd, refreshTrigger, refreshDb, settings, showToast, showConfirm } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'short_term' | 'long_term'>('all');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Edit Goal Form State
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<GoalType>('short_term');
  const [editStatus, setEditStatus] = useState<GoalStatus>('in_progress');
  const [editTargetDate, setEditTargetDate] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMilestones, setEditMilestones] = useState<Milestone[]>([]);
  const [newEditMilestoneTitle, setNewEditMilestoneTitle] = useState('');
  const [editTitleError, setEditTitleError] = useState('');

  const allGoals = useMemo(() => db.getGoals(), [refreshTrigger]);

  const filteredGoals = useMemo(() => {
    if (activeTab === 'all') return allGoals;
    return allGoals.filter((g) => g.type === activeTab);
  }, [allGoals, activeTab]);

  const [newMilestoneTexts, setNewMilestoneTexts] = useState<Record<string, string>>({});

  const openEditModal = (goal: Goal, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditType(goal.type);
    setEditStatus(goal.status);
    setEditTargetDate(goal.targetDate || '');
    setEditDesc(goal.description || '');
    setEditMilestones(goal.milestones || []);
    setNewEditMilestoneTitle('');
    setEditTitleError('');
  };

  const handleAddMilestoneInEdit = () => {
    const text = newEditMilestoneTitle.trim();
    if (!text) return;
    const newMs: Milestone = {
      id: `ms_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title: text,
      completed: false,
    };
    setEditMilestones((prev) => [...prev, newMs]);
    setNewEditMilestoneTitle('');
  };

  const handleToggleMilestoneInEdit = (id: string) => {
    setEditMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleUpdateMilestoneTitleInEdit = (id: string, text: string) => {
    setEditMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, title: text } : m))
    );
  };

  const handleDeleteMilestoneInEdit = (id: string) => {
    setEditMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveEditedGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;
    if (!editTitle.trim()) {
      setEditTitleError('لطفاً عنوان هدف را وارد کنید.');
      return;
    }

    const updatedGoal: Goal = {
      ...editingGoal,
      title: editTitle.trim(),
      type: editType,
      status: editStatus,
      targetDate: editTargetDate || undefined,
      description: editDesc.trim() || undefined,
      milestones: editMilestones,
    };

    db.saveGoal(updatedGoal);
    showToast('هدف با موفقیت ویرایش و ذخیره شد.', 'success');
    setEditingGoal(null);
    refreshDb();
  };

  const handleToggleMilestone = (goal: Goal, milestoneId: string) => {
    const milestone = goal.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    if (milestone.completed) {
      showConfirm({
        title: 'لغو تیک گام هدف',
        message: `آیا از لغو وضعیت انجام شده برای گام «${milestone.title}» اطمینان دارید؟`,
        confirmText: 'بله، لغو شود',
        cancelText: 'انصراف',
        isDanger: false,
        onConfirm: () => {
          const milestones = goal.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: false } : m
          );
          db.saveGoal({ ...goal, milestones, status: 'in_progress' });
          refreshDb();
        },
      });
    } else {
      const milestones = goal.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: true } : m
      );
      const allDone = milestones.length > 0 && milestones.every((m) => m.completed);
      db.saveGoal({ ...goal, milestones, status: allDone ? 'achieved' : 'in_progress' });
      refreshDb();
    }
  };

  const handleAddMilestoneToGoal = (goal: Goal) => {
    const text = (newMilestoneTexts[goal.id] || '').trim();
    if (!text) return;

    const newMilestone = {
      id: `ms_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title: text,
      completed: false,
    };

    const updatedMilestones = [...goal.milestones, newMilestone];
    db.saveGoal({ ...goal, milestones: updatedMilestones, status: 'in_progress' });
    setNewMilestoneTexts((prev) => ({ ...prev, [goal.id]: '' }));
    showToast('گام جدید به هدف افزوده شد.', 'success');
    refreshDb();
  };

  const handleDeleteGoal = (goal: Goal, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    showConfirm({
      title: 'حذف هدف',
      message: `آیا از حذف هدف «${goal.title}» مطمئن هستید؟`,
      onConfirm: () => {
        db.deleteGoal(goal.id);
        showToast('هدف حذف شد.', 'info');
        refreshDb();
      },
    });
  };

  return (
    <div id="goals-view" className="space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-500" />
            <span>اهداف و چشم‌انداز (Goals & Vision)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تعریف اهداف کوتاه‌مدت و بلندمدت، ویرایش و شکستن آن‌ها به گام‌های عملی
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Filters */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-slate-200'
              }`}
            >
              همه اهداف
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('short_term')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'short_term'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-slate-200'
              }`}
            >
              کوتاه‌مدت
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('long_term')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'long_term'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-slate-200'
              }`}
            >
              بلندمدت
            </button>
          </div>

          <button
            type="button"
            onClick={() => openQuickAdd('goal')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-purple-950/20 transition cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>هدف جدید</span>
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      {allGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="هنوز هدفی تعریف نشده است"
          description="اهداف شغلی، مالی، سلامتی، تحصیلی یا شخصی خود را ثبت کرده و مراحل تحقق آن را بسازید."
          actionText="تعریف اولین هدف"
          onAction={() => openQuickAdd('goal')}
        />
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-medium">هدفی در این دسته‌بندی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => {
            const completedMilestones = goal.milestones.filter((m) => m.completed).length;
            const totalMilestones = goal.milestones.length;
            const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition group shadow-xs ${
                  goal.status === 'achieved'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800/50'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-md border font-medium ${
                        goal.type === 'short_term'
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                          : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40'
                      }`}
                    >
                      {goal.type === 'short_term' ? 'کوتاه‌مدت' : 'بلندمدت'}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={(e) => openEditModal(goal, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="ویرایش هدف"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteGoal(goal, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="حذف هدف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3
                    onClick={(e) => openEditModal(goal, e)}
                    className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1 flex items-center gap-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    {goal.status === 'achieved' && <Award className="w-4 h-4 text-emerald-500" />}
                    <span>{goal.title}</span>
                  </h3>

                  {goal.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {goal.description}
                    </p>
                  )}

                  {/* Milestones Checklist */}
                  {totalMilestones > 0 && (
                    <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>گام‌های پیشرفت:</span>
                        <span className="font-mono text-[10px]">
                          {completedMilestones} از {totalMilestones}
                        </span>
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {goal.milestones.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleToggleMilestone(goal, m.id)}
                            className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-300 transition"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                m.completed
                                  ? 'bg-emerald-600 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {m.completed && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span className={m.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                              {m.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inline Add Milestone Form */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddMilestoneToGoal(goal);
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        value={newMilestoneTexts[goal.id] || ''}
                        onChange={(e) =>
                          setNewMilestoneTexts((prev) => ({ ...prev, [goal.id]: e.target.value }))
                        }
                        placeholder="ثبت گام جدید برای پیشرفت..."
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="submit"
                        disabled={!(newMilestoneTexts[goal.id] || '').trim()}
                        className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition cursor-pointer"
                        title="افزودن گام به هدف"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Progress, Target Date & Quick Edit Button */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>پیشرفت کلی:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {settings.persianDigits ? toPersianDigits(progress) : progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    {goal.targetDate ? (
                      <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-purple-300">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{formatToJalali(goal.targetDate, 'date_only', settings.persianDigits)}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">بدون تاریخ ددلاین</span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => openEditModal(goal, e)}
                      className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>ویرایش</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <Modal
          isOpen={!!editingGoal}
          onClose={() => setEditingGoal(null)}
          title="ویرایش اطلاعات هدف"
          subtitle="تغییر عنوان، وضعیت، بازه زمانی و گام‌های اجرایی هدف"
          icon={<Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEditedGoal} className="space-y-4 text-slate-800 dark:text-slate-100" dir="rtl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                عنوان هدف *
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (editTitleError) setEditTitleError('');
                }}
                placeholder="مثلاً: مطالعه ۲۴ کتاب در سال..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
              {editTitleError && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{editTitleError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  نوع هدف
                </label>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setEditType('short_term')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      editType === 'short_term'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    کوتاه‌مدت
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType('long_term')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      editType === 'long_term'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    بلندمدت
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  وضعیت هدف
                </label>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setEditStatus('in_progress')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      editStatus === 'in_progress'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    در جریان
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('achieved')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      editStatus === 'achieved'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    محقق‌شده
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('paused')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                      editStatus === 'paused'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    متوقف
                  </button>
                </div>
              </div>
            </div>

            <PersianDatePicker
              label="تاریخ تحقق هدف"
              value={editTargetDate}
              onChange={setEditTargetDate}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                توضیحات و دستاورد مورد انتظار
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="علت انتخاب هدف، انگیزه‌ها و چشم‌انداز..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Milestones Management */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                نشانه‌های پیشرفت و گام‌ها (Milestones)
              </label>

              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  value={newEditMilestoneTitle}
                  onChange={(e) => setNewEditMilestoneTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMilestoneInEdit();
                    }
                  }}
                  placeholder="افزودن گام جدید به هدف..."
                  className="flex-1 h-10 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddMilestoneInEdit}
                  disabled={!newEditMilestoneTitle.trim()}
                  className="h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن</span>
                </button>
              </div>

              {editMilestones.length > 0 ? (
                <div className="space-y-1.5 max-h-44 overflow-y-auto p-2 rounded-xl bg-purple-50/40 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-700/60">
                  {editMilestones.map((ms) => (
                    <div
                      key={ms.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleMilestoneInEdit(ms.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                          ms.completed
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-400 dark:border-slate-600'
                        }`}
                        title={ms.completed ? 'علامت به عنوان انجام نشده' : 'علامت به عنوان انجام شده'}
                      >
                        {ms.completed && <Check className="w-3 h-3" />}
                      </button>

                      <input
                        type="text"
                        value={ms.title}
                        onChange={(e) => handleUpdateMilestoneTitleInEdit(ms.id, e.target.value)}
                        className={`flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none ${
                          ms.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => handleDeleteMilestoneInEdit(ms.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                        title="حذف این گام"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">هنوز گامی تعریف نشده است.</p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => setEditingGoal(null)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium transition cursor-pointer shadow-2xs"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-950/20 transition cursor-pointer active:scale-98"
              >
                ذخیره تغییرات
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

