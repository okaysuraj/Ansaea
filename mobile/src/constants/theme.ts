/**
 * ANSAEA — Unified Mobile Design System & Tokens
 * Direction: Warm Utilitarian Minimalism (aligned 1:1 with Web)
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Palette = {
  // Brand Deep Sage & Herbal Tones
  sageDark: '#1B4332',
  sagePrimary: '#2D6A4F',
  sageLight: '#40916C',
  sageSubtle: '#D8F3DC',
  sageLuminous: '#52B788',

  // Status Colors
  success: '#40916C',
  successSubtle: '#D8F3DC',
  warning: '#E09F3E',
  warningSubtle: '#FEF3C7',
  danger: '#C1292E',
  dangerSubtle: '#FEE2E2',
  info: '#457B9D',
  infoSubtle: '#DBEAFE',

  // Light Neutrals (Warm Minimalist Stone & Canvas)
  surfaceWarm0: '#FAFAF8',
  surfaceWarm1: '#FFFFFF',
  surfaceWarm2: '#F4F4F2',
  surfaceWarm3: '#EBEBEA',
  borderWarm: '#E2E0DD',
  borderWarmHover: '#D0CECC',
  textWarmPrimary: '#1A1A18',
  textWarmSecondary: '#6B6B66',
  textWarmTertiary: '#9C9C96',

  // Dark Neutrals (Obsidian & Slate)
  surfaceDark0: '#0F172A',
  surfaceDark1: '#1E293B',
  surfaceDark2: '#273549',
  surfaceDark3: '#334155',
  borderDark: '#334155',
  borderDarkHover: '#475569',
  textDarkPrimary: '#F8FAFC',
  textDarkSecondary: '#94A3B8',
  textDarkTertiary: '#64748B',
};

export const Colors = {
  light: {
    text: Palette.textWarmPrimary,
    textSecondary: Palette.textWarmSecondary,
    textTertiary: Palette.textWarmTertiary,
    textInverse: '#FFFFFF',
    background: Palette.surfaceWarm0,
    backgroundElement: Palette.surfaceWarm1,
    backgroundSelected: Palette.surfaceWarm2,
    surface: Palette.surfaceWarm1,
    border: Palette.borderWarm,
    borderHover: Palette.borderWarmHover,
    accent: Palette.sagePrimary,
    accentHover: Palette.sageDark,
    accentSubtle: Palette.sageSubtle,
    statusSuccess: Palette.success,
    statusWarning: Palette.warning,
    statusDanger: Palette.danger,
    statusInfo: Palette.info,
  },
  dark: {
    text: Palette.textDarkPrimary,
    textSecondary: Palette.textDarkSecondary,
    textTertiary: Palette.textDarkTertiary,
    textInverse: '#1A1A18',
    background: Palette.surfaceDark0,
    backgroundElement: Palette.surfaceDark1,
    backgroundSelected: Palette.surfaceDark2,
    surface: Palette.surfaceDark1,
    border: Palette.borderDark,
    borderHover: Palette.borderDarkHover,
    accent: Palette.sageLuminous,
    accentHover: Palette.sageLight,
    accentSubtle: 'rgba(64, 145, 108, 0.2)',
    statusSuccess: Palette.success,
    statusWarning: Palette.warning,
    statusDanger: Palette.danger,
    statusInfo: Palette.info,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
  eight: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
