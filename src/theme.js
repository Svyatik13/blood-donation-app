/**
 * Design tokens for the patient app.
 *
 * WHY THIS FILE EXISTS:
 * React Native has no CSS — all styles are JS objects.
 * By defining tokens here, the patient components can import
 * constants instead of using CSS variable strings like
 * 'var(--mob-bg)', which only work on web.
 *
 * MIGRATION NOTE:
 * When converting to React Native / Expo, this file
 * stays untouched. Simply update the values here if you
 * want to tweak the look across both platforms at once.
 */

// ------------------------------------
// Colors
// ------------------------------------
export const colors = {
  // Brand
  primary:        '#DC2626',
  primaryHover:   '#B91C1C',
  primaryLight:   '#FEE2E2',
  primarySoft:    'rgba(220, 38, 38, 0.1)',
  danger:         '#DC2626',

  // Semantic
  success:        '#059669',
  successLight:   '#D1FAE5',
  successSoft:    'rgba(5, 150, 105, 0.1)',
  warning:        '#D97706',
  warningLight:   '#FEF3C7',
  warningSoft:    'rgba(217, 119, 6, 0.1)',
  info:           '#2563EB',
  infoLight:      '#DBEAFE',

  // Patient app surface — light mode (default)
  bg:             '#F2F2F7',
  surface:        '#FFFFFF',
  surfaceElevated:'#FFFFFF',
  border:         'rgba(0, 0, 0, 0.08)',
  text:           '#111111',
  textSecondary:  '#3C3C43',
  textMuted:      '#8E8E93',

  // Dark mode overrides (used by [data-theme="dark"])
  dark: {
    bg:             '#000000',
    surface:        '#1C1C1E',
    surfaceElevated:'#2C2C2E',
    border:         'rgba(255, 255, 255, 0.1)',
    text:           '#FFFFFF',
    textSecondary:  '#EBEBF5',
    textMuted:      '#8E8E93',
  },

  // Misc
  white:  '#FFFFFF',
  black:  '#000000',
};

// ------------------------------------
// Spacing (multiples of 4px)
// ------------------------------------
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ------------------------------------
// Border radii
// ------------------------------------
export const radii = {
  sm:   4,
  md:   8,
  lg:   10,
  xl:   16,
  full: 9999,
};

// ------------------------------------
// Typography
// ------------------------------------
export const fontSizes = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  32,
};

export const fontWeights = {
  normal:    '400',
  medium:    '500',
  semibold:  '600',
  bold:      '700',
  extrabold: '800',
};

// ------------------------------------
// Shadows
// (web: box-shadow string | RN: shadow props object)
// ------------------------------------
export const shadows = {
  sm: {
    // Web
    web: '0 1px 2px rgba(0,0,0,0.05)',
    // React Native
    rn: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  },
  md: {
    web: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
    rn:  { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  },
  lg: {
    web: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
    rn:  { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 15, elevation: 6 },
  },
};

// ------------------------------------
// Transitions (web only — RN uses Animated / Reanimated)
// ------------------------------------
export const transitions = {
  fast:  '150ms ease',
  base:  '250ms ease',
  slow:  '400ms ease',
};
