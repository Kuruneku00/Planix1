package com.planner.smartapp

import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

class AlarmSoundService : Service() {

    private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private var currentAlarmId: String = ""
    private var currentTitle: String = ""
    private var currentMessage: String = ""
    private var currentSoundUriStr: String? = null
    private var currentTargetView: String = "reminders"

    companion object {
        const val ACTION_START_ALARM = "com.planner.smartapp.ACTION_START_ALARM"
        const val ACTION_STOP_ALARM = "com.planner.smartapp.ACTION_STOP_ALARM"
        const val ACTION_SNOOZE_ALARM = "com.planner.smartapp.ACTION_SNOOZE_ALARM"
        const val NOTIFICATION_ID = 998877

        fun startAlarm(
            context: Context,
            id: String,
            title: String,
            message: String,
            soundUri: String?,
            targetView: String? = "reminders"
        ) {
            val intent = Intent(context, AlarmSoundService::class.java).apply {
                action = ACTION_START_ALARM
                putExtra("id", id)
                putExtra("title", title)
                putExtra("message", message)
                putExtra("soundUri", soundUri)
                putExtra("targetView", targetView)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stopAlarm(context: Context) {
            val intent = Intent(context, AlarmSoundService::class.java).apply {
                action = ACTION_STOP_ALARM
            }
            context.startService(intent)
        }

        fun snoozeAlarm(context: Context, minutes: Int = 5) {
            val intent = Intent(context, AlarmSoundService::class.java).apply {
                action = ACTION_SNOOZE_ALARM
                putExtra("minutes", minutes)
            }
            context.startService(intent)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: ACTION_START_ALARM

        when (action) {
            ACTION_START_ALARM -> {
                currentAlarmId = intent?.getStringExtra("id") ?: System.currentTimeMillis().toString()
                currentTitle = intent?.getStringExtra("title") ?: "زنگ و هشدار پلنیکس"
                currentMessage = intent?.getStringExtra("message") ?: "زمان موعد فرا رسیده است"
                currentSoundUriStr = intent?.getStringExtra("soundUri")
                currentTargetView = intent?.getStringExtra("targetView") ?: "reminders"

                startContinuousRinging()
            }
            ACTION_STOP_ALARM -> {
                stopContinuousRinging()
                stopSelf()
            }
            ACTION_SNOOZE_ALARM -> {
                val minutes = intent?.getIntExtra("minutes", 5) ?: 5
                scheduleSnooze(minutes)
                stopContinuousRinging()
                stopSelf()
            }
        }

        return START_NOT_STICKY
    }

    private fun startContinuousRinging() {
        acquireWakeLock()

        // 1. Prepare Sound with AudioAttributes.USAGE_ALARM (Audible even in Silent/Vibrate mode)
        try {
            mediaPlayer?.release()
            mediaPlayer = null

            val soundUri: Uri = if (!currentSoundUriStr.isNullOrEmpty()) {
                Uri.parse(currentSoundUriStr)
            } else {
                RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                    ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            }

            mediaPlayer = MediaPlayer().apply {
                setDataSource(applicationContext, soundUri)
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                isLooping = true
                prepare()
                start()
            }
        } catch (e: Exception) {
            e.printStackTrace()
            // Fallback to default ringtone
            try {
                val fallbackUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
                mediaPlayer = MediaPlayer().apply {
                    setDataSource(applicationContext, fallbackUri)
                    setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
                    )
                    isLooping = true
                    prepare()
                    start()
                }
            } catch (e2: Exception) {
                e2.printStackTrace()
            }
        }

        // 2. Continuous Vibration pattern
        try {
            vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }

            val pattern = longArrayOf(0, 700, 300, 700, 300, 900)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(pattern, 0)) // 0 means repeat from index 0
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(pattern, 0)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 3. Build Full-Screen Intent for AlarmActivity
        val fullScreenIntent = Intent(this, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("id", currentAlarmId)
            putExtra("title", currentTitle)
            putExtra("message", currentMessage)
            putExtra("soundUri", currentSoundUriStr)
            putExtra("targetView", currentTargetView)
        }
        val fullScreenPendingIntent = PendingIntent.getActivity(
            this,
            (currentAlarmId + "_fs").hashCode(),
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val contentIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("targetView", currentTargetView)
        }
        val pendingContentIntent = PendingIntent.getActivity(
            this,
            currentAlarmId.hashCode(),
            contentIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Stop Action Intent
        val stopIntent = Intent(this, AlarmReceiver::class.java).apply {
            action = ACTION_STOP_ALARM
        }
        val pendingStopIntent = PendingIntent.getBroadcast(
            this,
            1001,
            stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Snooze Action Intent (5 minutes)
        val snoozeIntent = Intent(this, AlarmReceiver::class.java).apply {
            action = ACTION_SNOOZE_ALARM
            putExtra("id", currentAlarmId)
            putExtra("title", currentTitle)
            putExtra("message", currentMessage)
            putExtra("soundUri", currentSoundUriStr)
            putExtra("targetView", currentTargetView)
            putExtra("minutes", 5)
        }
        val pendingSnoozeIntent = PendingIntent.getBroadcast(
            this,
            1002,
            snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, NotificationHelper.CHANNEL_ALARM_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("🔔 $currentTitle")
            .setContentText(currentMessage)
            .setStyle(NotificationCompat.BigTextStyle().bigText(currentMessage))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setContentIntent(pendingContentIntent)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "توقف", pendingStopIntent)
            .addAction(android.R.drawable.ic_lock_idle_alarm, "تعویق (۵ دقیقه)", pendingSnoozeIntent)
            .build()

        startForeground(NOTIFICATION_ID, notification)

        // Also launch AlarmActivity directly so it presents immediately
        try {
            startActivity(fullScreenIntent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun scheduleSnooze(minutes: Int) {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val triggerTime = System.currentTimeMillis() + (minutes * 60 * 1000)

        val snoozeIntent = Intent(this, AlarmReceiver::class.java).apply {
            action = "com.planner.smartapp.ACTION_ALARM_TRIGGER"
            putExtra("id", "${currentAlarmId}_snooze_${System.currentTimeMillis()}")
            putExtra("title", "$currentTitle (تعویق شده)")
            putExtra("message", currentMessage)
            putExtra("soundUri", currentSoundUriStr)
            putExtra("targetView", currentTargetView)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            this,
            (currentAlarmId + "_snooze").hashCode(),
            snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                alarmManager.setAlarmClock(
                    AlarmManager.AlarmClockInfo(triggerTime, pendingIntent),
                    pendingIntent
                )
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun stopContinuousRinging() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            vibrator?.cancel()
            vibrator = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        releaseWakeLock()

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.cancel(NOTIFICATION_ID)
    }

    private fun acquireWakeLock() {
        try {
            if (wakeLock == null) {
                val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
                wakeLock = powerManager.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
                    "planix:alarm_service_wakelock"
                )
            }
            if (wakeLock?.isHeld == false) {
                wakeLock?.acquire(10 * 60 * 1000L) // Safety timeout: max 10 minutes
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun releaseWakeLock() {
        try {
            if (wakeLock?.isHeld == true) {
                wakeLock?.release()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onDestroy() {
        stopContinuousRinging()
        super.onDestroy()
    }
}
