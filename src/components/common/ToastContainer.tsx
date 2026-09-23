import React from 'react';

/**
 * In-app notification banners and toasts are completely disabled per user requirement:
 * "هیچ نوتیفی نمیخوام داخل خود برنامه بیاد نوتیف های لازم رو همون از طریق نوتیف گوشی ارسال کنه وو چیزایی کهمهم نیستن ام نیاد"
 * Only essential notifications (alarms, scheduled reminders, timer completion) are delivered via phone OS notifications.
 */
export const ToastContainer: React.FC = () => {
  return null;
};

