/**
 * Speech adapter — platform abstraction layer.
 *
 * WHY THIS FILE EXISTS:
 * The Waiting Room Board uses window.speechSynthesis directly.
 * React Native has no Web Speech API.
 *
 * ─────────────────────────────────────────────────
 * TO MIGRATE TO REACT NATIVE (Expo):
 * ─────────────────────────────────────────────────
 * 1. Install:  npx expo install expo-speech
 * 2. Replace the implementation below with:
 *
 *    import * as Speech from 'expo-speech';
 *
 *    speak: (text, options = {}) => {
 *      Speech.speak(text, {
 *        language: options.lang || 'cs-CZ',
 *        rate:     options.rate  || 0.92,
 *        pitch:    options.pitch || 1.0,
 *        volume:   options.volume || 0.85,
 *        onDone:   options.onEnd,
 *        onError:  options.onError,
 *      });
 *    }
 *
 *    cancel: () => Speech.stop()
 *
 * Note: expo-speech is already async/queue-based so you
 * won't need the manual queue from WaitingRoomBoard.
 * ─────────────────────────────────────────────────
 */

/**
 * Speak a text string.
 * @param {string} text
 * @param {{ lang?: string, rate?: number, pitch?: number, volume?: number, onEnd?: () => void, onError?: () => void }} options
 */
export function speak(text, options = {}) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang   = options.lang   ?? 'cs-CZ';
    utterance.rate   = options.rate   ?? 0.92;
    utterance.pitch  = options.pitch  ?? 1.0;
    utterance.volume = options.volume ?? 0.85;
    if (options.onEnd)   utterance.onend  = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[speech] speak() failed:', e);
    options.onError?.();
  }
}

/**
 * Cancel any ongoing speech.
 */
export function cancelSpeech() {
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    console.warn('[speech] cancel() failed:', e);
  }
}

/**
 * Returns whether the platform supports speech synthesis.
 * In React Native this will always be true (expo-speech always available).
 */
export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
