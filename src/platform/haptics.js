/**
 * Haptics adapter — platform abstraction layer.
 *
 * WHY THIS FILE EXISTS:
 * Mobile apps use haptic feedback for key interactions (button
 * taps, success states, errors). The web has limited haptic
 * support via the Vibration API, but React Native / Expo has
 * first-class haptics via expo-haptics.
 *
 * ─────────────────────────────────────────────────
 * TO MIGRATE TO REACT NATIVE (Expo):
 * ─────────────────────────────────────────────────
 * 1. Install:  npx expo install expo-haptics
 * 2. Replace each function body below with:
 *
 *    import * as Haptics from 'expo-haptics';
 *
 *    impactLight:         () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
 *    impactMedium:        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
 *    notificationSuccess: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
 *    notificationError:   () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
 *    selectionChanged:    () => Haptics.selectionAsync()
 * ─────────────────────────────────────────────────
 *
 * Web fallback: uses the Vibration API where available,
 * silently does nothing where it isn't.
 */

const vibrate = (ms) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch { /* ignore */ }
};

/** Light tap — use for standard button presses. */
export const impactLight = () => vibrate(10);

/** Medium tap — use for confirmations. */
export const impactMedium = () => vibrate(20);

/** Success notification — use after completing a key action. */
export const notificationSuccess = () => vibrate([10, 50, 10]);

/** Error notification — use after a failed action. */
export const notificationError = () => vibrate([20, 50, 20, 50, 20]);

/** Selection changed — use for picker/toggle interactions. */
export const selectionChanged = () => vibrate(5);
