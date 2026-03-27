export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar_url: string | null;
  banner_url: string | null;
  description: string | null;
  subscriber_count: number;
  total_views: number;
  total_watch_time_hours: number;
  video_count: number;
  country: string;
  joined_date: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
