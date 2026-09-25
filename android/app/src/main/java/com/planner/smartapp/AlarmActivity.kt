package com.planner.smartapp

import android.app.Activity
import android.app.KeyguardManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.WindowManager
import android.view.animation.Animation
import android.view.animation.ScaleAnimation
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AlarmActivity : Activity() {

    companion object {
        private var instance: AlarmActivity? = null

        fun dismissIfOpen() {
            Handler(Looper.getMainLooper()).post {
                instance?.let { act ->
                    try {
                        act.finish()
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                    instance = null
                }
            }
        }
    }

    private var alarmId: String = ""
    private var title: String = ""
    private var message: String = ""
    private var soundUri: String? = null
    private var targetView: String = "reminders"

    private val timeHandler = Handler(Looper.getMainLooper())
    private val timeRunnable = object : Runnable {
        override fun run() {
            updateClockDisplay()
            timeHandler.postDelayed(this, 1000)
        }
    }

    private var stopReceiverRegistered = false
    private val stopReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // If alarm was already stopped from notification, immediately dismiss
        if (!AlarmSoundService.isRinging) {
            finish()
            return
        }

        instance = this

        try {
            val filter = IntentFilter(AlarmSoundService.ACTION_STOP_ALARM)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                registerReceiver(stopReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
            } else {
                registerReceiver(stopReceiver, filter)
            }
            stopReceiverRegistered = true
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Lockscreen and Wake Screen Flags
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
            keyguardManager?.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        setContentView(R.layout.activity_alarm)

        alarmId = intent.getStringExtra("id") ?: ""
        title = intent.getStringExtra("title") ?: "زنگ و هشدار پلنیکس"
        message = intent.getStringExtra("message") ?: "زمان سررسید فرا رسیده است"
        soundUri = intent.getStringExtra("soundUri")
        targetView = intent.getStringExtra("targetView") ?: "reminders"

        val titleView = findViewById<TextView>(R.id.alarm_title_text)
        val messageView = findViewById<TextView>(R.id.alarm_message_text)
        val iconView = findViewById<ImageView>(R.id.alarm_icon)
        val stopButton = findViewById<Button>(R.id.btn_stop_alarm)
        val snooze5Button = findViewById<Button>(R.id.btn_snooze_5m)
        val snooze10Button = findViewById<Button>(R.id.btn_snooze_10m)

        titleView.text = title
        messageView.text = message

        // Pulsing scale animation for alarm bell
        val pulse = ScaleAnimation(
            0.9f, 1.15f, 0.9f, 1.15f,
            Animation.RELATIVE_TO_SELF, 0.5f,
            Animation.RELATIVE_TO_SELF, 0.5f
        ).apply {
            duration = 600
            repeatMode = Animation.REVERSE
            repeatCount = Animation.INFINITE
        }
        iconView.startAnimation(pulse)

        stopButton.setOnClickListener {
            AlarmSoundService.stopAlarm(this)
            // Return user to their existing place in the app without recreating or resetting MainActivity
            val mainIntent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            startActivity(mainIntent)
            finish()
        }

        snooze5Button.setOnClickListener {
            AlarmSoundService.snoozeAlarm(this, 5)
            finish()
        }

        snooze10Button.setOnClickListener {
            AlarmSoundService.snoozeAlarm(this, 10)
            finish()
        }

        updateClockDisplay()
        timeHandler.postDelayed(timeRunnable, 1000)
    }

    private fun updateClockDisplay() {
        val clockView = findViewById<TextView>(R.id.alarm_clock_time)
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
        clockView.text = sdf.format(Date())
    }

    override fun onResume() {
        super.onResume()
        if (!AlarmSoundService.isRinging) {
            finish()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (instance == this) {
            instance = null
        }
        if (stopReceiverRegistered) {
            try {
                unregisterReceiver(stopReceiver)
                stopReceiverRegistered = false
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        timeHandler.removeCallbacks(timeRunnable)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Prevent accidental dismissal via back button while alarm is ringing
        // User must explicitly choose Stop or Snooze
    }
}
