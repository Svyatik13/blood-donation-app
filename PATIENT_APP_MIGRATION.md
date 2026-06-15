# Patient App — React Native Migration Guide

This guide documents how to convert the patient-facing part of BloodLife into a standalone **Expo** (React Native) app for iOS and Android.

The web app is already structured to make this migration straightforward. Most of the work is replacing CSS class names with `StyleSheet` objects and swapping the platform adapters.

---

## Architecture Overview

```
src/
├── theme.js                  ← Shared design tokens (works as-is in RN)
├── i18n.js                   ← Shared translations (works as-is in RN)
├── platform/
│   ├── storage.js            ← Swap body → AsyncStorage
│   ├── speech.js             ← Swap body → expo-speech
│   └── haptics.js            ← Swap body → expo-haptics
├── context/
│   └── AppContext.jsx        ← Business logic, mostly portable
└── components/
    └── patient/              ← Copy these screens to the RN project
        ├── HomeTab.jsx
        ├── LoginScreen.jsx
        ├── RegisterScreen.jsx
        ├── ProfileTab.jsx
        ├── HistoryTab.jsx
        ├── StatusScreen.jsx
        ├── QuestionnaireScreen.jsx
        ├── MobileNavBar.jsx
        └── DonorPathModal.jsx
```

---

## Step 1 — Bootstrap the Expo project

```bash
npx create-expo-app@latest BloodLifeApp --template blank
cd BloodLifeApp
```

---

## Step 2 — Install dependencies

```bash
# Core navigation
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Platform adapters
npx expo install @react-native-async-storage/async-storage
npx expo install expo-speech
npx expo install expo-haptics

# UI utilities
npx expo install expo-font
npx expo install @expo-google-fonts/inter

# Animation (replaces framer-motion)
npx expo install react-native-reanimated

# Confetti (replaces canvas-confetti)
npm install react-native-confetti-cannon
```

---

## Step 3 — Copy shared files

Copy these files verbatim — they need **no changes**:

```
src/theme.js          → BloodLifeApp/src/theme.js
src/i18n.js           → BloodLifeApp/src/i18n.js
src/platform/         → BloodLifeApp/src/platform/   (all 3 adapter files)
src/context/AppContext.jsx → BloodLifeApp/src/context/AppContext.jsx
```

---

## Step 4 — Swap platform adapters

### `src/platform/storage.js`
Replace the entire body with:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get(key) {
    try {
      const v = await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  async remove(key) {
    try { await AsyncStorage.removeItem(key); } catch {}
  },
  async getString(key) {
    try { return await AsyncStorage.getItem(key); } catch { return null; }
  },
  async setString(key, value) {
    try { await AsyncStorage.setItem(key, value); } catch {}
  },
};
```

> ⚠️ AsyncStorage is async — update AppContext's `useState` initializer to use `useEffect` + `useState(null)` and load data after mount.

### `src/platform/speech.js`
Replace the body with:

```js
import * as Speech from 'expo-speech';

export function speak(text, options = {}) {
  Speech.speak(text, {
    language: options.lang    ?? 'cs-CZ',
    rate:     options.rate    ?? 0.92,
    pitch:    options.pitch   ?? 1.0,
    volume:   options.volume  ?? 0.85,
    onDone:   options.onEnd,
    onError:  options.onError,
  });
}

export function cancelSpeech() { Speech.stop(); }
export function isSpeechAvailable() { return true; }
```

### `src/platform/haptics.js`
Replace the body with:

```js
import * as Haptics from 'expo-haptics';

export const impactLight         = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
export const impactMedium        = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
export const notificationSuccess = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
export const notificationError   = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
export const selectionChanged    = () => Haptics.selectionAsync();
```

---

## Step 5 — Convert CSS class names to StyleSheet

This is the main conversion effort. Each `mob-*` CSS class becomes a `StyleSheet.create()` entry.

### Key mappings

| CSS class | React Native equivalent |
|---|---|
| `className="mob-card"` | `style={styles.card}` |
| `className="mob-btn mob-btn-primary"` | `<TouchableOpacity style={styles.btnPrimary}>` |
| `className="mob-input"` | `<TextInput style={styles.input}>` |
| `className="mob-scroll"` | `<ScrollView>` |
| `className="mob-content"` | `<View style={styles.content}>` |
| `className="animate-fade-in"` | Reanimated `FadeIn` entering prop |
| `className="animate-slide-up"` | Reanimated `SlideInDown` entering prop |

### Starter StyleSheet (put in a shared `styles.js`):

```js
import { StyleSheet } from 'react-native';
import { colors, radii, spacing, fontSizes, fontWeights, shadows } from './theme';

export const styles = StyleSheet.create({
  content: { padding: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm.rn,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: fontSizes.base,
    color: colors.text,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.white,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.base,
  },
});
```

---

## Step 6 — Navigation

Replace `react-router-dom` (`useNavigate`, `<Route>`) with React Navigation:

```js
// Web (current)
const navigate = useNavigate();
navigate('/patient');

// React Native
import { useNavigation } from '@react-navigation/native';
const navigation = useNavigation();
navigation.navigate('Home');
```

Tab navigation (replaces `MobileNavBar.jsx`):

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

// Screens: Home, History, Profile
```

---

## Step 7 — Fonts

Replace the Google Fonts `@import` in CSS with:

```js
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
```

---

## What does NOT need changing

- ✅ `theme.js` — works as-is
- ✅ `i18n.js` — works as-is  
- ✅ All business logic in `AppContext.jsx` (state, functions) — works as-is after storage adapter swap
- ✅ Component prop interfaces — same in RN
- ✅ `t()` / `docT()` translation system — works as-is

---

## Recommended Expo Config

```json
// app.json
{
  "expo": {
    "name": "BloodLife",
    "slug": "bloodlife",
    "platforms": ["ios", "android"],
    "icon": "./assets/icon.png",
    "splash": { "backgroundColor": "#DC2626" },
    "ios": { "bundleIdentifier": "com.yourorg.bloodlife" },
    "android": { "package": "com.yourorg.bloodlife" }
  }
}
```
