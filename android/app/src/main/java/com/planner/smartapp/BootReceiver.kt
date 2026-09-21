package com.planner.smartapp

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import org.json.JSONObject

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        if (action == Intent.ACTION_BOOT_COMPLETED ||
            action == "android.intent.action.QUICKBOOT_POWERON" ||
            action == Intent.ACTION_TIME_CHANGED ||
            action == Intent.ACTION_TIMEZONE_CHANGED
        ) {
            NotificationHelper.createNotificationChannels(context)

            // Reschedule active future alarms
            val prefs = context.getSharedPreferences("planix_alarms", Context.MODE_PRIVATE)
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val now = System.currentTimeMillis()

            for ((key, value) in prefs.all) {
                if (key.startsWith("alarm_") && value is String) {
                    try {
                        val json = JSONObject(value)
                        val id = json.getString("id")
                        val timestamp = json.getLong("timestamp")
                        if (timestamp > now) {
                            val title = json.optString("title", "یادآور پلنر")
                            val message = json.optString("message", "")
                            val soundUri = json.optString("soundUri", "")
                            val targetView = json.optString("targetView", "reminders")

                            val alarmIntent = Intent(context, AlarmReceiver::class.java).apply {
                                this.action = "com.planner.smartapp.ACTION_ALARM_TRIGGER"
                                putExtra("id", id)
                                putExtra("title", title)
                                putExtra("message", message)
                                putExtra("soundUri", soundUri)
                                putExtra("targetView", targetView)
                            }
                            val pendingIntent = PendingIntent.getBroadcast(
                                context,
                                id.hashCode(),
                                alarmIntent,
                                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                            )

                            val showIntent = Intent(context, MainActivity::class.java).apply {
                                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                                putExtra("targetView", targetView)
                            }
                            val showPendingIntent = PendingIntent.getActivity(
                                context,
                                (id + "_show").hashCode(),
                                showIntent,
                                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                            )

                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                                alarmManager.setAlarmClock(
                                    AlarmManager.AlarmClockInfo(timestamp, showPendingIntent),
                                    pendingIntent
                                )
                            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, timestamp, pendingIntent)
                            } else {
                                alarmManager.setExact(AlarmManager.RTC_WAKEUP, timestamp, pendingIntent)
                            }
                        } else {
                            // Expired alarm, remove from storage
                            prefs.edit().remove(key).apply()
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }
    }
}
