import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import { syncService, SyncPeerInfo } from '../../services/syncService';
import { formatToJalali, toPersianDigits } from '../../utils/jalali';
import {
  RefreshCw,
  QrCode,
  Smartphone,
  Laptop,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Radio,
  Download,
  Upload,
  ArrowRightLeft,
  Sparkles,
  Layers,
  Clock,
  HelpCircle,
  FileCode,
  FileCheck,
} from 'lucide-react';

export const SyncView: React.FC = () => {
  const { settings, updateSettings, showToast, refreshDb, refreshTrigger } = useApp();

  // Local state
  const [deviceId] = useState<string>(() => syncService.getDeviceId());
  const [deviceInfo] = useState(() => syncService.getDeviceInfo());
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync bundle export state
  const [syncCode, setSyncCode] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);

  // Import / Pairing state
  const [inputCode, setInputCode] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [peers, setPeers] = useState<SyncPeerInfo[]>([]);
  const [autoSync, setAutoSync] = useState(() => syncService.isAutoSyncEnabled());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Database stats summary for syncing
  const stats = useMemo(() => {
    return {
      tasks: db.getTasks().length,
      projects: db.getProjects().length,
      habits: db.getHabits().length,
      notes: db.getNotes().length,
      goals: db.getGoals().length,
      events: db.getEvents().length,
      reminders: db.getReminders().length,
      dailyPlans: db.getDailyPlans().length,
    };
  }, [refreshTrigger]);

  const totalItems = useMemo(() => {
    return Object.values(stats).reduce((a, b) => a + b, 0);
  }, [stats]);

  // Subscribe to real-time sync channel
  useEffect(() => {
    syncService.pingPeers();
    setPeers(syncService.getConnectedPeers());

    const unsubscribe = syncService.subscribe((event) => {
      if (event.type === 'PEERS_UPDATED') {
        setPeers(event.payload || []);
      } else if (event.type === 'DATA_RECEIVED') {
        refreshDb();
        showToast('اطلاعات جدید از تب یا پنجره دیگر دریافت و همگام گردید.', 'info');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [refreshDb, showToast]);

  // Handle Copy Device ID
  const handleCopyDeviceId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(deviceId);
      setCopiedId(true);
      showToast('شناسه این دستگاه در حافظه کپی شد.', 'success');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Immediate Local & Cross-Tab Sync
  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncService.broadcastLocalSync('MANUAL');
      const nowIso = new Date().toISOString();
      updateSettings({ lastSyncTime: nowIso });
      setIsSyncing(false);
      refreshDb();
      showToast('همگام‌سازی فوری پایگاه داده و تب‌های باز با موفقیت انجام شد.', 'success');
    }, 600);
  };

  // Generate Sync Package
  const handleGenerateSyncPackage = async () => {
    const pkg = syncService.generateSyncPackage();
    setSyncCode(pkg.code);
    showToast(`بسته همگام‌سازی با موفقیت تولید شد (${toPersianDigits(pkg.count)} رکورد اطلاعاتی).`, 'success');
  };

  // Copy Generated Sync Code
  const handleCopySyncCode = () => {
    if (!syncCode) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(syncCode);
      setCopiedCode(true);
      showToast('کد کامل همگام‌سازی در حافظه کپی شد.', 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Open QR Code Modal
  const handleShowQRCode = async () => {
    setQrModalOpen(true);
    setQrLoading(true);
    try {
      const codeToUse = syncCode || syncService.generateSyncPackage().code;
      if (!syncCode) setSyncCode(codeToUse);
      // Generate QR for quick device pairing token
      const qrUrl = await syncService.generateQRCodeDataUrl(`PLANIX:${deviceId}`);
      setQrDataUrl(qrUrl);
    } catch {
      showToast('خطا در تولید بارکد QR.', 'error');
    } finally {
      setQrLoading(false);
    }
  };

  // Download Sync Package File
  const handleDownloadSyncFile = () => {
    try {
      const pkg = syncService.generateSyncPackage();
      const blob = new Blob([pkg.json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planix_sync_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 30000);
      showToast('فایل همگام‌سازی با موفقیت دانلود شد.', 'success');
    } catch {
      showToast('خطا در دانلود فایل همگام‌سازی.', 'error');
    }
  };

  // Paste from clipboard helper
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputCode(text.trim());
          showToast('کد از حافظه موقت جای‌گذاری شد.', 'info');
          return;
        }
      }
      showToast('دسترسی به کلیپ‌بورد در دسترس نیست، لطفاً دستی کپی و جای‌گذاری کنید.', 'info');
    } catch {
      showToast('امکان خواندن خودکار کلیپ‌بورد وجود ندارد، لطفاً دستی جای‌گذاری کنید.', 'info');
    }
  };

  // Process and apply incoming sync package
  const handleApplySync = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputCode.trim();
    if (!trimmed) {
      showToast('لطفاً کد یا داده همگام‌سازی را در کادر وارد کنید.', 'error');
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      const result = syncService.importSync(trimmed, importMode);
      setIsSyncing(false);

      if (result.success) {
        setInputCode('');
        const nowIso = new Date().toISOString();
        updateSettings({ lastSyncTime: nowIso });
        refreshDb();
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    }, 700);
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputCode(content);
        showToast('فایل همگام‌سازی با موفقیت خوانده شد. دکمه اعمال را بزنید.', 'success');
      }
    };
    reader.onerror = () => {
      showToast('خطا در خواندن فایل همگام‌سازی.', 'error');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Toggle Auto Sync
  const handleToggleAutoSync = () => {
    const newVal = !autoSync;
    setAutoSync(newVal);
    syncService.setAutoSyncEnabled(newVal);
    updateSettings({ syncEnabled: newVal });
    showToast(newVal ? 'همگام‌سازی خودکار فعال شد.' : 'همگام‌سازی خودکار غیرفعال شد.', 'info');
  };

  return (
    <div id="sync-view" className="space-y-6 max-w-5xl mx-auto pb-12 select-none" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span>مرکز همگام‌سازی و انتقال بین دستگاه‌ها</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            اتصال پایدار، ادغام هوشمند داده‌ها و انتقال سریع بین لپ‌تاپ، تبلت و گوشی موبایل
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={isSyncing}
          onClick={handleManualSync}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'در حال پردازش...' : 'همگام‌سازی فوری'}</span>
        </button>
      </div>

      {/* Sync Status Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                وضعیت کانال همگام‌سازی: آماده و فعال
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>رمزنگاری آفلاین و امن</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  {settings.lastSyncTime
                    ? `آخرین همگام‌سازی: ${formatToJalali(settings.lastSyncTime, 'full', settings.persianDigits)}`
                    : 'تاکنون همگام‌سازی دستی ثبت نشده است'}
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {toPersianDigits(totalItems)} رکورد آماده همگام‌سازی (وظایف، پروژه‌ها، عادات و یادداشت‌ها)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Auto Sync Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">همگام‌سازی خودکار</div>
            <div className="text-[10px] text-slate-400">بین تب‌ها و صفحات باز</div>
          </div>
          <button
            type="button"
            onClick={handleToggleAutoSync}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              autoSync ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                autoSync ? 'left-1' : 'left-6'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Grid: Export and Import Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Export / Generate Sync Code for other devices */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    ۱. ارسال اطلاعات به دستگاه دیگر
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    شناسه یا بسته اطلاعاتی این دستگاه جهت انتقال به گوشی یا لپ‌تاپ دیگر
                  </p>
                </div>
              </div>
            </div>

            {/* Device Token Pill */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>شناسه پایدار این دستگاه:</span>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">
                  {deviceInfo.label}
                </span>
              </label>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono text-xs text-purple-700 dark:text-purple-300">
                <span className="font-bold tracking-wider">{deviceId}</span>
                <button
                  type="button"
                  onClick={handleCopyDeviceId}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs transition cursor-pointer flex items-center gap-1.5"
                  title="کپی شناسه"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-sans">کپی</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Sync Code area */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  بسته کامل اطلاعاتی (کد همگام‌سازی):
                </span>
                {syncCode && (
                  <button
                    type="button"
                    onClick={handleCopySyncCode}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'کپی شد' : 'کپی کل کد'}</span>
                  </button>
                )}
              </div>

              {syncCode ? (
                <div className="relative">
                  <textarea
                    readOnly
                    rows={4}
                    value={syncCode}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed break-all select-all focus:outline-none"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>حاوی کلیه وظایف، برنامه‌ها و یادداشت‌ها</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">آماده جای‌گذاری در دستگاه مقصد</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    برای انتقال کلیه اطلاعات به گوشی یا دستگاه دیگر، دکمه زیر را لمس کنید:
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateSyncPackage}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>تولید کد بسته همگام‌سازی</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions (QR & File) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleShowQRCode}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>نمایش بارکد QR</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSyncFile}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>دانلود فایل (.json)</span>
            </button>
          </div>
        </div>

        {/* Box 2: Import / Receive Sync Code from other devices */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    ۲. دریافت و همگام‌سازی از دستگاه دیگر
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    کد ارائه‌شده از گوشی یا لپ‌تاپ دیگر را در این بخش وارد یا جای‌گذاری کنید
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleApplySync} className="space-y-3">
              {/* Input Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    کد یا محتوای همگام‌سازی:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>چسباندن از حافظه</span>
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>بارگذاری فایل</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json,.planix-sync"
                      className="hidden"
                    />
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="کد ارائه‌شده از دستگاه دیگر را اینجا Paste کنید (مثلاً: PLN-SYNC-v1.ey... یا کد دستگاه)..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-500 transition leading-relaxed resize-none"
                />
              </div>

              {/* Merge Mode Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">نحوه همگام‌سازی:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex flex-col gap-0.5 ${
                      importMode === 'merge'
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-purple-500" />
                      <span>ادغام هوشمند (Merge)</span>
                    </span>
                    <span className="text-[10px] opacity-80">
                      افزودن و به‌روزرسانی بدون حذف داده‌های قبلی
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer flex flex-col gap-0.5 ${
                      importMode === 'replace'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-amber-500" />
                      <span>جایگزینی کامل (Replace)</span>
                    </span>
                    <span className="text-[10px] opacity-80">
                      تطبیق ۱۰۰٪ و بازنویسی با اطلاعات دستگاه مبدا
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSyncing || !inputCode.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSyncing ? 'در حال همگام‌سازی و اعمال...' : 'اعمال و همگام‌سازی اطلاعات'}</span>
              </button>
            </form>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>اطلاعات شما به صورت محلی و امن پردازش شده و به هیچ سرور خارجی ارسال نمی‌شود.</span>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-500" />
          <span>راهنمای گام‌به‌گام انتقال و همگام‌سازی اطلاعات بین دو دستگاه</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="font-bold text-purple-600 dark:text-purple-400">گام اول: تولید کد در دستگاه مبدا</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              در دستگاهی که داده‌های اصلی را دارد (مثلاً لپ‌تاپ)، روی «تولید کد بسته همگام‌سازی» کلیک کرده و کد را کپی یا فایل را دانلود کنید.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">گام دوم: انتقال کد به دستگاه مقصد</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              کد را از طریق پیام‌رسان (ایتا، بله، تلگرام یا واتساپ برای خودتان) یا ایمیل به گوشی یا دستگاه دیگر منتقل کنید.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="font-bold text-emerald-600 dark:text-emerald-400">گام سوم: اعمال در دستگاه مقصد</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              در دستگاه مقصد وارد همین بخش «همگام‌سازی» شده، کد را در کادر سمت چپ جای‌گذاری نموده و دکمه «اعمال و همگام‌سازی» را بزنید.
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>بارکد اتصال مستقیم این دستگاه</span>
              </h3>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              {qrLoading ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : qrDataUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                  <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                </div>
              ) : (
                <div className="text-xs text-red-400">خطا در نمایش بارکد</div>
              )}

              <div className="mt-3 text-center">
                <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                  {deviceId}
                </span>
                <p className="text-[11px] text-slate-400 mt-2">
                  شناسه دستگاه را با دوربین گوشی اسکن کرده یا در دستگاه مقصد وارد کنید.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
