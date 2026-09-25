import QRCode from 'qrcode';
import { db } from './db';

const STORAGE_KEYS = {
  DEVICE_ID: 'planner_device_id',
  AUTO_SYNC: 'planner_auto_sync_enabled',
};

export interface SyncPeerInfo {
  deviceId: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastSeen: number;
}

export interface SyncPackage {
  header: 'PLANIX_SYNC_V1';
  deviceId: string;
  timestamp: string;
  data: any;
  summary: {
    tasks: number;
    projects: number;
    habits: number;
    notes: number;
    goals: number;
    events: number;
    reminders: number;
  };
}

// UTF-8 Safe Base64 Encoding
export const toSafeBase64 = (str: string): string => {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    console.error('Base64 encoding failed:', e);
    return '';
  }
};

// UTF-8 Safe Base64 Decoding
export const fromSafeBase64 = (base64: string): string => {
  try {
    const cleaned = base64.trim().replace(/^PLN-SYNC-v1\./, '');
    const binary = atob(cleaned);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error('Base64 decoding failed:', e);
    return '';
  }
};

class SyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: { type: string; payload?: any }) => void> = new Set();
  private connectedPeers: Map<string, SyncPeerInfo> = new Map();

  constructor() {
    this.initBroadcastChannel();
  }

  // Generate or get stable device ID
  getDeviceId(): string {
    if (typeof window === 'undefined') return 'PLN-WEB-0001';
    let id = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!id) {
      const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      id = `PLN-${part1}-${part2}`;
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
    }
    return id;
  }

  // Detect device type and title
  getDeviceInfo(): { type: 'desktop' | 'mobile' | 'tablet'; label: string } {
    if (typeof window === 'undefined') return { type: 'desktop', label: 'رایانه' };
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|iphone|android|phone/i.test(ua);
    const isTablet = /tablet|ipad/i.test(ua);

    if (isTablet) return { type: 'tablet', label: 'تبلت' };
    if (isMobile) return { type: 'mobile', label: 'گوشی هوشمند' };
    return { type: 'desktop', label: 'رایانه و لپ‌تاپ' };
  }

  // Auto-sync status
  isAutoSyncEnabled(): boolean {
    if (typeof window === 'undefined') return true;
    const val = localStorage.getItem(STORAGE_KEYS.AUTO_SYNC);
    return val === null ? true : val === 'true';
  }

  setAutoSyncEnabled(enabled: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTO_SYNC, enabled ? 'true' : 'false');
    }
  }

  // Export current full database as a portable sync package
  generateSyncPackage(): { code: string; json: string; summary: SyncPackage['summary']; count: number } {
    const rawDataStr = db.exportBackupData();
    const parsedData = JSON.parse(rawDataStr);

    const summary = {
      tasks: parsedData.tasks?.length || 0,
      projects: parsedData.projects?.length || 0,
      habits: parsedData.habits?.length || 0,
      notes: parsedData.notes?.length || 0,
      goals: parsedData.goals?.length || 0,
      events: parsedData.events?.length || 0,
      reminders: parsedData.reminders?.length || 0,
    };

    const count = Object.values(summary).reduce((a, b) => a + b, 0);

    const pkg: SyncPackage = {
      header: 'PLANIX_SYNC_V1',
      deviceId: this.getDeviceId(),
      timestamp: new Date().toISOString(),
      data: parsedData,
      summary,
    };

    const json = JSON.stringify(pkg, null, 2);
    const code = `PLN-SYNC-v1.${toSafeBase64(json)}`;

    return { code, json, summary, count };
  }

  // Parse an incoming code or raw JSON
  parseSyncData(rawInput: string): { success: boolean; data?: any; error?: string } {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { success: false, error: 'لطفاً کد یا داده همگام‌سازی را وارد کنید.' };
    }

    // Attempt 1: If it starts with prefix PLN-SYNC-v1. or looks like base64
    if (trimmed.startsWith('PLN-SYNC-v1.') || (!trimmed.startsWith('{') && !trimmed.startsWith('['))) {
      const decoded = fromSafeBase64(trimmed);
      if (decoded) {
        try {
          const parsed = JSON.parse(decoded);
          const actualData = parsed.data || parsed;
          return { success: true, data: actualData };
        } catch {
          // Continue to fallback
        }
      }
    }

    // Attempt 2: Direct JSON
    try {
      const parsed = JSON.parse(trimmed);
      const actualData = parsed.data || parsed;
      return { success: true, data: actualData };
    } catch {
      return { success: false, error: 'کد وارد شده معتبر نیست. لطفاً کد کامل همگام‌سازی را وارد کنید.' };
    }
  }

  // Import / Sync into local database
  importSync(
    rawInput: string,
    mode: 'merge' | 'replace' = 'merge'
  ): { success: boolean; message: string; count?: number } {
    const parsed = this.parseSyncData(rawInput);
    if (!parsed.success || !parsed.data) {
      return { success: false, message: parsed.error || 'داده همگام‌سازی نامعتبر است.' };
    }

    const jsonString = JSON.stringify(parsed.data);

    if (mode === 'replace') {
      const ok = db.importDatabaseJSON(jsonString);
      if (ok) {
        this.broadcastLocalSync('REPLACE');
        return { success: true, message: 'پایگاه داده به طور کامل جایگزین و همگام گردید.' };
      }
      return { success: false, message: 'خطا در بازیابی کامل داده‌ها.' };
    } else {
      const res = db.mergeBackupData(jsonString);
      if (res.success) {
        this.broadcastLocalSync('MERGE');
      }
      return { success: res.success, message: res.message, count: res.countMerged };
    }
  }

  // Generate QR Code as DataURL
  async generateQRCodeDataUrl(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: 280,
        margin: 2,
        color: {
          dark: '#581c87', // deep purple
          light: '#ffffff',
        },
      });
    } catch (e) {
      console.error('Failed to generate QR code:', e);
      return '';
    }
  }

  // Real-time local multi-tab / local window sync via BroadcastChannel
  private initBroadcastChannel() {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;

    try {
      this.channel = new BroadcastChannel('planix_realtime_sync');

      this.channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (!type) return;

        if (type === 'PING') {
          // Announce self back
          this.channel?.postMessage({
            type: 'PONG',
            payload: {
              deviceId: this.getDeviceId(),
              ...this.getDeviceInfo(),
              lastSeen: Date.now(),
            },
          });
        } else if (type === 'PONG') {
          if (payload?.deviceId && payload.deviceId !== this.getDeviceId()) {
            this.connectedPeers.set(payload.deviceId, payload);
            this.notifyListeners({ type: 'PEERS_UPDATED', payload: Array.from(this.connectedPeers.values()) });
          }
        } else if (type === 'SYNC_DATA') {
          // Received direct data sync from another tab
          if (payload?.deviceId !== this.getDeviceId() && payload?.data) {
            db.mergeBackupData(JSON.stringify(payload.data));
            this.notifyListeners({ type: 'DATA_RECEIVED', payload });
          }
        }

        this.notifyListeners(event.data);
      };

      // Announce presence
      this.channel.postMessage({
        type: 'PING',
        payload: {
          deviceId: this.getDeviceId(),
          ...this.getDeviceInfo(),
          lastSeen: Date.now(),
        },
      });
    } catch (e) {
      console.warn('BroadcastChannel not supported or failed to initialize:', e);
    }
  }

  // Broadcast current local state to any other open tabs or windows
  broadcastLocalSync(reason = 'MANUAL') {
    if (!this.channel) return;
    try {
      const pkg = this.generateSyncPackage();
      this.channel.postMessage({
        type: 'SYNC_DATA',
        payload: {
          deviceId: this.getDeviceId(),
          reason,
          timestamp: new Date().toISOString(),
          data: JSON.parse(pkg.json).data,
        },
      });
    } catch (e) {
      console.error('Failed to broadcast sync event:', e);
    }
  }

  // Ping peers to refresh connected list
  pingPeers() {
    if (!this.channel) return;
    this.connectedPeers.clear();
    this.channel.postMessage({
      type: 'PING',
      payload: {
        deviceId: this.getDeviceId(),
        ...this.getDeviceInfo(),
        lastSeen: Date.now(),
      },
    });
  }

  getConnectedPeers(): SyncPeerInfo[] {
    return Array.from(this.connectedPeers.values());
  }

  subscribe(callback: (event: { type: string; payload?: any }) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(event: { type: string; payload?: any }) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        console.error('Sync listener error:', e);
      }
    });
  }
}

export const syncService = new SyncService();
