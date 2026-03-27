export type StatPeriod = 'last_7_days' | 'last_28_days' | 'last_90_days' | 'lifetime';
export type MetricType = 'views' | 'watch_time' | 'subscribers' | 'revenue';

export interface DashboardStats {
  id: string;
  channel_id: string;
  period: StatPeriod;
  views: number;
  views_change_percent: number;
  watch_time_hours: number;
  watch_time_change_percent: number;
  subscribers_gained: number;
  subscribers_lost: number;
  subscribers_net: number;
  subscribers_change_percent: number;
  estimated_revenue: number;
  revenue_change_percent: number;
  impressions: number;
  impression_ctr: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsTimeseries {
  id: string;
  channel_id: string;
  date: string;
  metric_type: MetricType;
  value: number;
  created_at: string;
}

export interface HourlyDataPoint {
  hour: string;
  views: number;
}

export interface RealtimeStats {
  id: string;
  channel_id: string;
  current_viewers: number;
  views_last_48h: number;
  views_last_60min: number;
  top_video_id: string | null;
  hourly_data: HourlyDataPoint[];
  updated_at: string;
}
