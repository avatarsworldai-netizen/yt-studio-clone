// YouTube Studio Dark Theme Colors
export const COLORS = {
  background: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceLight: '#272727',
  surfaceHover: '#3a3a3a',
  primary: '#3ea6ff',
  textPrimary: '#f1f1f1',
  textSecondary: '#aaaaaa',
  positive: '#2ba640',
  negative: '#ff4e45',
  border: '#333333',
  tabBarBg: '#212121',
  statusPublished: '#2ba640',
  statusDraft: '#909090',
  statusUnlisted: '#909090',
  statusPrivate: '#ff4e45',
  statusScheduled: '#ff8c00',
  white: '#ffffff',
  black: '#000000',
} as const;

// Stat periods
export const STAT_PERIODS = [
  { key: 'last_7_days', label: 'Last 7 days', short: '7d' },
  { key: 'last_28_days', label: 'Last 28 days', short: '28d' },
  { key: 'last_90_days', label: 'Last 90 days', short: '90d' },
  { key: 'lifetime', label: 'Lifetime', short: 'All' },
] as const;

// Video status labels
export const VIDEO_STATUS_LABELS: Record<string, string> = {
  published: 'Published',
  draft: 'Draft',
  unlisted: 'Unlisted',
  private: 'Private',
  scheduled: 'Scheduled',
};

// Comment status labels
export const COMMENT_STATUS_LABELS: Record<string, string> = {
  published: 'Published',
  held_for_review: 'Held for review',
  spam: 'Spam',
  removed: 'Removed',
};

// Channel ID (single channel app)
export const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

// Format helpers
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatWatchTime(hours: number): string {
  if (hours >= 1000) return `${(hours / 1000).toFixed(1)}K hrs`;
  return `${hours.toFixed(0)} hrs`;
}
