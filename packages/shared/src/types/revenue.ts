export interface Revenue {
  id: string;
  channel_id: string;
  month: string;
  estimated_revenue: number;
  ad_revenue: number;
  membership_revenue: number;
  superchat_revenue: number;
  merchandise_revenue: number;
  premium_revenue: number;
  rpm: number;
  cpm: number;
  playback_based_cpm: number;
  ad_impressions: number;
  monetized_playbacks: number;
  created_at: string;
  updated_at: string;
}
