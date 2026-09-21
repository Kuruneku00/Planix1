package com.planner.smartapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class AlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action

        if (action == AlarmSoundService.ACTION_STOP_ALARM) {
            AlarmSoundService.stopAlarm(context)
            return
        }

        if (action == AlarmSoundService.ACTION_SNOOZE_ALARM) {
            val minutes = intent.getIntExtra("minutes", 5)
            AlarmSoundService.snoozeAlarm(context, minutes)
            return
        }

        // Standard or Exact Alarm Trigger
        val id = intent.getStringExtra("id") ?: System.currentTimeMillis().toString()
        val title = intent.getStringExtra("title") ?: "زمان سررسید پلنیکس 🔔"
        val message = intent.getStringExtra("message") ?: "برای مشاهده جزئیات ضربه بزنید"
        val soundUriStr = intent.getStringExtra("soundUri")
        val targetView = intent.getStringExtra("targetView") ?: "reminders"

        AlarmSoundService.startAlarm(context, id, title, message, soundUriStr, targetView)
    }
}
