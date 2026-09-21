package com.planner.smartapp

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import com.getcapacitor.BridgeActivity
import java.io.OutputStream

class MainActivity : BridgeActivity() {

    // System insets tracking in px
    var insetsTop: Int = 0
    var insetsBottom: Int = 0
    var insetsLeft: Int = 0
    var insetsRight: Int = 0

    private var pendingBackupContent: String? = null

    // Notification permission launcher (Android 13+)
    val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        val status = if (isGranted) "granted" else "denied"
        bridge?.webView?.post {
            bridge?.webView?.evaluateJavascript(
                "if (window.onNativeNotificationPermissionResult) window.onNativeNotificationPermissionResult($isGranted, '$status');",
                null
            )
        }
    }

    // Audio file picker launcher (Storage Access Framework)
    val audioPickerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK && result.data != null) {
            val uri: Uri? = result.data?.data
            if (uri != null) {
                try {
                    contentResolver.takePersistableUriPermission(
                        uri,
                        Intent.FLAG_GRANT_READ_URI_PERMISSION
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                }

                val displayName = getFileNameFromUri(uri) ?: "audio_selected.mp3"
                bridge?.webView?.post {
                    bridge?.webView?.evaluateJavascript(
                        "if (window.onNativeAudioFilePicked) window.onNativeAudioFilePicked('${uri}', '${displayName.replace("'", "\\'")}');",
                        null
                    )
                }
                return@registerForActivityResult
            }
        }
        bridge?.webView?.post {
            bridge?.webView?.evaluateJavascript(
                "if (window.onNativeAudioFilePicked) window.onNativeAudioFilePicked(null, null);",
                null
            )
        }
    }

    // Backup document creation launcher (Storage Access Framework)
    val createBackupLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK && result.data != null) {
            val uri: Uri? = result.data?.data
            if (uri != null && pendingBackupContent != null) {
                try {
                    val outputStream: OutputStream? = contentResolver.openOutputStream(uri)
                    outputStream?.use { stream ->
                        stream.write(pendingBackupContent!!.toByteArray(Charsets.UTF_8))
                        stream.flush()
                    }
                    pendingBackupContent = null
                    bridge?.webView?.post {
                        bridge?.webView?.evaluateJavascript(
                            "if (window.onNativeBackupFileSaved) window.onNativeBackupFileSaved(true, '${uri}');",
                            null
                        )
                    }
                    return@registerForActivityResult
                } catch (e: Exception) {
                    pendingBackupContent = null
                    val err = e.localizedMessage ?: "Unknown I/O error"
                    bridge?.webView?.post {
                        bridge?.webView?.evaluateJavascript(
                            "if (window.onNativeBackupFileSaved) window.onNativeBackupFileSaved(false, '${err.replace("'", "\\'")}');",
                            null
                        )
                    }
                    return@registerForActivityResult
                }
            }
        }
        pendingBackupContent = null
        bridge?.webView?.post {
            bridge?.webView?.evaluateJavascript(
                "if (window.onNativeBackupFileSaved) window.onNativeBackupFileSaved(false, 'عملیات ذخیره فایل لغو شد');",
                null
            )
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        splashScreen.setOnExitAnimationListener { splashScreenViewProvider ->
            val fadeOut = android.animation.ObjectAnimator.ofFloat(
                splashScreenViewProvider.view,
                android.view.View.ALPHA,
                1f,
                0f
            )
            fadeOut.interpolator = android.view.animation.DecelerateInterpolator()
            fadeOut.duration = 750L
            fadeOut.addListener(object : android.animation.AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: android.animation.Animator) {
                    splashScreenViewProvider.remove()
                }
            })
            fadeOut.start()
        }

        // Configure edge-to-edge BEFORE the Activity/WebView is created.
        // This prevents the first rendered frame from using the full screen
        // and then jumping into the safe-area layout.
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = android.graphics.Color.TRANSPARENT
        window.navigationBarColor = android.graphics.Color.TRANSPARENT
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            window.isNavigationBarContrastEnforced = false
            window.isStatusBarContrastEnforced = false
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
            window.attributes.layoutInDisplayCutoutMode =
                android.view.WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }
        val decorDarkColor = android.graphics.Color.parseColor("#020617")
        window.decorView.setBackgroundColor(decorDarkColor)
        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false
        insetsController.isAppearanceLightNavigationBars = false

        super.onCreate(savedInstanceState)

        // Initialize Notification Channels
        NotificationHelper.createNotificationChannels(this)

        // Register Native AndroidBridge onto Capacitor WebView
        ensureBridgeAndInsets()
    }

    private var bridgeRegistered = false

    private fun ensureBridgeAndInsets() {
        bridge?.webView?.let { webView ->
            webView.setBackgroundColor(android.graphics.Color.parseColor("#020617"))
            if (!bridgeRegistered) {
                try {
                    webView.addJavascriptInterface(AndroidBridge(this, webView), "AndroidBridge")
                    setupWindowInsets(webView)
                    bridgeRegistered = true
                } catch (e: Exception) {
                    android.util.Log.e("MainActivity", "Error registering AndroidBridge", e)
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        ensureBridgeAndInsets()
        ViewCompat.requestApplyInsets(window.decorView)
        dispatchInsetsToWebView()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            ViewCompat.requestApplyInsets(window.decorView)
            dispatchInsetsToWebView()
        }
    }

    override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
        super.onConfigurationChanged(newConfig)
        ViewCompat.requestApplyInsets(window.decorView)
        dispatchInsetsToWebView()
    }

    private fun setupWindowInsets(webView: android.webkit.WebView) {
        ViewCompat.setOnApplyWindowInsetsListener(window.decorView) { _, insets ->
            val systemBars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or
                WindowInsetsCompat.Type.displayCutout()
            )
            val density = resources.displayMetrics.density
            insetsTop = (systemBars.top / density).toInt()
            insetsBottom = (systemBars.bottom / density).toInt()
            insetsLeft = (systemBars.left / density).toInt()
            insetsRight = (systemBars.right / density).toInt()

            dispatchInsetsToWebView()

            insets
        }
    }

    private fun dispatchInsetsToWebView() {
        bridge?.webView?.let { webView ->
            webView.post {
                val script = """
                    (function() {
                        var root = document.documentElement;
                        if (!root) return;
                        root.style.setProperty('--safe-area-top', '${insetsTop}px');
                        root.style.setProperty('--safe-area-bottom', '${insetsBottom}px');
                        root.style.setProperty('--safe-area-left', '${insetsLeft}px');
                        root.style.setProperty('--safe-area-right', '${insetsRight}px');
                        root.style.setProperty('--safe-top', 'max(env(safe-area-inset-top, 0px), ${insetsTop}px)');
                        root.style.setProperty('--safe-bottom', 'max(env(safe-area-inset-bottom, 0px), ${insetsBottom}px)');
                        root.style.setProperty('--safe-left', 'max(env(safe-area-inset-left, 0px), ${insetsLeft}px)');
                        root.style.setProperty('--safe-right', 'max(env(safe-area-inset-right, 0px), ${insetsRight}px)');
                        window.dispatchEvent(new CustomEvent('nativeInsetsChanged', {
                            detail: { top: $insetsTop, bottom: $insetsBottom, left: $insetsLeft, right: $insetsRight }
                        }));
                    })();
                """.trimIndent()
                webView.evaluateJavascript(script, null)
            }
        }
    }

    fun setPendingBackup(content: String) {
        pendingBackupContent = content
    }

    private fun getFileNameFromUri(uri: Uri): String? {
        var name: String? = null
        val cursor = contentResolver.query(uri, null, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val index = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (index >= 0) {
                    name = it.getString(index)
                }
            }
        }
        return name
    }
}
