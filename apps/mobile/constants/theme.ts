// YouTube Studio Dark Mode - exact color palette
export const COLORS = {
  // Backgrounds
  background: '#0f0f0f',
  surface: '#1c1c1c',
  surfaceElevated: '#282828',
  surfaceLight: '#3a3a3a',

  // YouTube brand
  youtubeRed: '#FF0000',
  primary: '#3ea6ff', // YouTube blue for links/highlights

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textTertiary: '#717171',

  // Status
  positive: '#1db954',
  negative: '#ff4e45',
  warning: '#ffb800',

  // Borders
  border: '#272727',
  divider: '#222222',

  // Tab bar
  tabBarBg: '#0f0f0f',
  tabBarActive: '#ffffff',
  tabBarInactive: '#717171',

  // Misc
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.7)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const FONT_SIZE = {
  xxs: 10,
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
} as const;
