/**
 * Storage adapter — platform abstraction layer.
 *
 * WHY THIS FILE EXISTS:
 * AppContext uses localStorage directly. React Native has no
 * localStorage — it uses AsyncStorage instead.
 *
 * This adapter wraps the browser localStorage API so that
 * when converting to React Native, you only need to swap
 * the implementation inside this file — not hunt through
 * AppContext or any other file.
 *
 * ─────────────────────────────────────────────────
 * TO MIGRATE TO REACT NATIVE (Expo):
 * ─────────────────────────────────────────────────
 * 1. Install:  npx expo install @react-native-async-storage/async-storage
 * 2. Replace the body of each function below with:
 *
 *    import AsyncStorage from '@react-native-async-storage/async-storage';
 *
 *    get:    async (key) => { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : null; }
 *    set:    async (key, value) => AsyncStorage.setItem(key, JSON.stringify(value))
 *    remove: async (key) => AsyncStorage.removeItem(key)
 *    getStr: async (key) => AsyncStorage.getItem(key)
 *    setStr: async (key, value) => AsyncStorage.setItem(key, value)
 *
 * Note: AsyncStorage is async. You'll need to convert callers
 * in AppContext from useState(() => ...) to useEffect + useState.
 * ─────────────────────────────────────────────────
 */

export const storage = {
  /** Get a JSON-parsed value by key. Returns null if missing. */
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /** Store a value as JSON. */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch { /* quota exceeded etc. */ }
  },

  /** Remove a key. */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch { /* ignore */ }
  },

  /** Get a raw string value (no JSON parsing). */
  getString(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  /** Store a raw string value. */
  setString(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch { /* ignore */ }
  },
};
