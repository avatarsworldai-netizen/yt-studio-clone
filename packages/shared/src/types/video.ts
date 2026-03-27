export type VideoStatus = 'published' | 'draft' | 'unlisted' | 'private' | 'scheduled';
export type VideoVisibility = 'public' | 'unlisted' | 'private';

export interface RetentionPoint {
  second: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  percentage: number;
  views: number;
}

export interface GeographyData {
  country: string;
  percentage: number;
}

export interface AgeGenderData {
  range: string;
  male: number;
  female: number;
}

export interface Video {
  id: string;
  channel_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  status: VideoStatus;
  visibility: VideoVisibility;
  published_at: string | null;

  // Stats
  view_count: number;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  share_count: number;
  watch_time_hours: number;
  average_view_duration: string;
  impressions: number;
  impression_ctr: number;

  // Revenue
  estimated_revenue: number;
  rpm: number;
  cpm: number;

  // Audience data
  retention_data: RetentionPoint[];
  traffic_sources: TrafficSource[];
  audience_geography: GeographyData[];
  audience_age_gender: AgeGenderData[];

  sort_order: number;
  created_at: string;
  updated_at: string;
}
