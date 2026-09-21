package com.planner.smartapp

import android.app.Activity
import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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
            // Open main app with the target item view
            val mainIntent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("targetView", targetView)
            }
            startActivity(mainIntent)
            finishAndRemoveTask()
        }

        snooze5Button.setOnClickListener {
            AlarmSoundService.snoozeAlarm(this, 5)
            finishAndRemoveTask()
        }

        snooze10Button.setOnClickListener {
            AlarmSoundService.snoozeAlarm(this, 10)
            finishAndRemoveTask()
        }

        updateClockDisplay()
        timeHandler.postDelayed(timeRunnable, 1000)
    }

    private fun updateClockDisplay() {
        val clockView = findViewById<TextView>(R.id.alarm_clock_time)
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
        clockView.text = sdf.format(Date())
    }

    override fun onDestroy() {
        super.onDestroy()
        timeHandler.removeCallbacks(timeRunnable)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Prevent accidental dismissal via back button while alarm is ringing
        // User must explicitly choose Stop or Snooze
    }
}
