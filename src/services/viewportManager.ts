/**
 * viewportManager
 *
 * FIX: this file was missing entirely from src/services/, while
 * src/App.tsx still imported it ("Cannot find module
 * './services/viewportManager'"). That unresolved import made
 * `vite build` fail immediately, which is why the GitHub Actions
 * "Build web application" step kept failing before Gradle/Android
 * ever ran.
 *
 * Purpose: keeps a reliable CSS custom property (--app-height, in
 * px) in sync with the *actual* visible viewport height. Plain CSS
 * "100vh" is unreliable on mobile — it does not account for the
 * on-screen keyboard, or the browser's address bar showing/hiding —
 * which typically shows up as content being cut off or extra blank
 * space at the bottom. This uses the VisualViewport API when
 * available (best behavior with the keyboard open) and falls back
 * to window.innerHeight on older WebViews.
 *
 * Usage (already wired up in App.tsx):
 *   const cleanup = viewportManager.init();
 *   // ... later, on unmount:
 *   cleanup();
 *
 * In CSS, use it like:
 *   .full-height { height: var(--app-height, 100vh); }
 */

/**
 * FIX (safe-area / status-bar overlap after close+reopen):
 *
 * MainActivity.kt pushes --safe-top / --safe-bottom / etc. into the
 * WebView's CSS by calling evaluateJavascript(...) from a native
 * WindowInsets listener. That push can fire *before* the WebView has
 * actually finished loading the page (there's no onPageFinished hook
 * re-sending it), so on some cold starts the evaluateJavascript call is
 * silently dropped and the CSS variables are left at their 0px default.
 * The result: the header/top bar renders with no top padding and sits
 * underneath the phone's status bar icons until something else happens
 * to nudge the native insets listener again.
 *
 * AndroidBridge already exposes a synchronous pull, `getSystemInsets()`,
 * that was never actually called from the web app. We use it here as a
 * guaranteed-correct fallback: as soon as our JS is running we can ask
 * the native side directly for the current insets, instead of only
 * waiting for it to remember to push them to us. We also re-pull
 * whenever the app becomes visible/focused again (i.e. every time the
 * user re-opens the app), since that's exactly when the push has been
 * observed to go missing.
 */
function applyNativeSafeAreaInsets() {
  if (typeof window === 'undefined' || !window.AndroidBridge) return;
  try {
    const json = window.AndroidBridge.getSystemInsets();
    if (!json) return;
    const parsed = JSON.parse(json);
    const top = Number(parsed.top) || 0;
    const bottom = Number(parsed.bottom) || 0;
    const left = Number(parsed.left) || 0;
    const right = Number(parsed.right) || 0;

    const root = document.documentElement;
    root.style.setProperty('--safe-area-top', `${top}px`);
    root.style.setProperty('--safe-area-bottom', `${bottom}px`);
    root.style.setProperty('--safe-area-left', `${left}px`);
    root.style.setProperty('--safe-area-right', `${right}px`);
    root.style.setProperty('--safe-top', `max(env(safe-area-inset-top, 0px), ${top}px)`);
    root.style.setProperty('--safe-bottom', `max(env(safe-area-inset-bottom, 0px), ${bottom}px)`);
    root.style.setProperty('--safe-left', `max(env(safe-area-inset-left, 0px), ${left}px)`);
    root.style.setProperty('--safe-right', `max(env(safe-area-inset-right, 0px), ${right}px)`);
  } catch {
    // ignore - native bridge may not be ready yet, next trigger will retry
  }
}

function setAppHeightVar() {
  if (typeof window === 'undefined') return;
  // Keep the physical window height here. System-bar insets are handled
  // independently by MainActivity and #planner-root. Using visualViewport
  // height for the whole app can make the frame jump/scale when Android
  // changes system bars or opens the keyboard.
  const height = window.innerHeight || document.documentElement.clientHeight || 0;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
}


function init(): () => void {
  if (typeof window === 'undefined') {
    // no-op on non-browser environments (SSR/build-time), keeps this
    // safe to import anywhere.
    return () => {};
  }

  setAppHeightVar();

  // Pull the real insets immediately on boot, don't just wait for the
  // native push (see applyNativeSafeAreaInsets above for why).
  applyNativeSafeAreaInsets();
  // A native JS interface can occasionally attach a beat after our first
  // script runs; one short retry covers that without any visible flicker.
  const readyRetryId = window.setTimeout(applyNativeSafeAreaInsets, 300);

  const handleResize = () => setAppHeightVar();
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      applyNativeSafeAreaInsets();
    }
  };
  const handleFocus = () => applyNativeSafeAreaInsets();

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('focus', handleFocus);
  window.addEventListener('nativeInsetsChanged', handleFocus);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
  }

  return () => {
    window.clearTimeout(readyRetryId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('nativeInsetsChanged', handleFocus);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.visualViewport.removeEventListener('scroll', handleResize);
    }
  };
}

export const viewportManager = {
  init,
};
