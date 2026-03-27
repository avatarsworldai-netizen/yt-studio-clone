-- ============================================
-- YouTube Studio Clone - Database Schema
-- ============================================

-- TABLE: channel
CREATE TABLE channel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  description TEXT,
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  total_views BIGINT NOT NULL DEFAULT 0,
  total_watch_time_hours DECIMAL(12,1) NOT NULL DEFAULT 0,
  video_count INTEGER NOT NULL DEFAULT 0,
  country TEXT DEFAULT 'US',
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channel(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  visibility TEXT NOT NULL DEFAULT 'public',
  published_at TIMESTAMPTZ,

  -- Stats
  view_count BIGINT NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  dislike_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  watch_time_hours DECIMAL(10,1) NOT NULL DEFAULT 0,
  average_view_duration TEXT DEFAULT '0:00',
  impressions INTEGER NOT NULL DEFAULT 0,
  impression_ctr DECIMAL(5,2) NOT NULL DEFAULT 0,

  -- Revenue per video
  estimated_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  rpm DECIMAL(6,2) NOT NULL DEFAULT 0,
  cpm DECIMAL(6,2) NOT NULL DEFAULT 0,

  -- Audience data (JSON)
  retention_data JSONB DEFAULT '[]',
  traffic_sources JSONB DEFAULT '[]',
  audience_geography JSONB DEFAULT '[]',
  audience_age_gender JSONB DEFAULT '[]',

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  author_is_verified BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  dislike_count INTEGER NOT NULL DEFAULT 0,
  is_hearted BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  is_reply BOOLEAN DEFAULT false,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: dashboard_stats
CREATE TABLE dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channel(id) ON DELETE CASCADE,
  period TEXT NOT NULL,

  views BIGINT NOT NULL DEFAULT 0,
  views_change_percent DECIMAL(6,2) DEFAULT 0,
  watch_time_hours DECIMAL(12,1) NOT NULL DEFAULT 0,
  watch_time_change_percent DECIMAL(6,2) DEFAULT 0,
  subscribers_gained INTEGER NOT NULL DEFAULT 0,
  subscribers_lost INTEGER NOT NULL DEFAULT 0,
  subscribers_net INTEGER NOT NULL DEFAULT 0,
  subscribers_change_percent DECIMAL(6,2) DEFAULT 0,
  estimated_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  revenue_change_percent DECIMAL(6,2) DEFAULT 0,
  impressions BIGINT NOT NULL DEFAULT 0,
  impression_ctr DECIMAL(5,2) NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(channel_id, period)
);

-- TABLE: analytics_timeseries
CREATE TABLE analytics_timeseries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channel(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(channel_id, date, metric_type)
);

-- TABLE: revenue
CREATE TABLE revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channel(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  estimated_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  ad_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  membership_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  superchat_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  merchandise_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  premium_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  rpm DECIMAL(6,2) NOT NULL DEFAULT 0,
  cpm DECIMAL(6,2) NOT NULL DEFAULT 0,
  playback_based_cpm DECIMAL(6,2) NOT NULL DEFAULT 0,
  ad_impressions BIGINT NOT NULL DEFAULT 0,
  monetized_playbacks BIGINT NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(channel_id, month)
);

-- TABLE: realtime_stats
CREATE TABLE realtime_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channel(id) ON DELETE CASCADE,
  current_viewers INTEGER NOT NULL DEFAULT 0,
  views_last_48h BIGINT NOT NULL DEFAULT 0,
  views_last_60min BIGINT NOT NULL DEFAULT 0,
  top_video_id UUID REFERENCES videos(id),
  hourly_data JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE: notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channel(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE channel;
ALTER PUBLICATION supabase_realtime ADD TABLE videos;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE dashboard_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_timeseries;
ALTER PUBLICATION supabase_realtime ADD TABLE revenue;
ALTER PUBLICATION supabase_realtime ADD TABLE realtime_stats;

-- Row Level Security
ALTER TABLE channel ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_timeseries ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies: allow read for everyone, write for authenticated (admin)
CREATE POLICY "Allow public read" ON channel FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON dashboard_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON analytics_timeseries FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON revenue FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON realtime_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON notifications FOR SELECT USING (true);

CREATE POLICY "Allow admin write" ON channel FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write" ON videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write" ON comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write" ON dashboard_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write" ON analytics_timeseries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write" ON revenue FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write" ON realtime_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write" ON notifications FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON channel FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON dashboard_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON revenue FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON realtime_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
