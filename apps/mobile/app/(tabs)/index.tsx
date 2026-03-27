import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

function formatCompact(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function DashboardScreen() {
  const router = useRouter();

  useRealtimeSubscription('dashboard_stats', ['dashboardStats']);
  useRealtimeSubscription('realtime_stats', ['realtimeStats']);
  useRealtimeSubscription('channel', ['channel']);
  useRealtimeSubscription('videos', ['latestVideos']);

  const { data: channel } = useQuery({
    queryKey: ['channel'],
    queryFn: async () => {
      const { data } = await supabase.from('channel').select('*').eq('id', CHANNEL_ID).single();
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CHANNEL_ID).eq('period', 'last_28_days').single();
      return data;
    },
  });

  const { data: realtimeData } = useQuery({
    queryKey: ['realtimeStats'],
    queryFn: async () => {
      const { data } = await supabase.from('realtime_stats').select('*').eq('channel_id', CHANNEL_ID).single();
      return data;
    },
  });

  const { data: latestVideos } = useQuery({
    queryKey: ['latestVideos'],
    queryFn: async () => {
      const { data } = await supabase.from('videos').select('*').eq('channel_id', CHANNEL_ID).eq('status', 'published').eq('visibility', 'public').order('published_at', { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Subscriber count card */}
      <TouchableOpacity style={styles.subscriberCard} onPress={() => router.push('/profile')}>
        <View style={styles.subscriberTop}>
          <Image
            source={{ uri: channel?.avatar_url || 'https://picsum.photos/200/200' }}
            style={styles.channelAvatar}
          />
          <View style={styles.subscriberInfo}>
            <Text style={styles.subscriberLabel}>Current subscribers</Text>
            <Text style={styles.subscriberCount}>
              {formatNumber(channel?.subscriber_count || 0)}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textTertiary} />
        </View>
      </TouchableOpacity>

      {/* Channel analytics summary card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Channel analytics</Text>
          <Text style={styles.cardSubtitle}>Last 28 days</Text>
        </View>

        <View style={styles.analyticsGrid}>
          <AnalyticMetric
            label="Views"
            value={formatCompact(stats?.views || 0)}
            change={stats?.views_change_percent}
          />
          <View style={styles.metricDivider} />
          <AnalyticMetric
            label="Watch time (hours)"
            value={formatCompact(stats?.watch_time_hours || 0)}
            change={stats?.watch_time_change_percent}
          />
          <View style={styles.metricDivider} />
          <AnalyticMetric
            label="Subscribers"
            value={`+${formatCompact(stats?.subscribers_net || 0)}`}
            change={stats?.subscribers_change_percent}
          />
        </View>

        <TouchableOpacity style={styles.goToAnalytics}>
          <Text style={styles.goToAnalyticsText}>GO TO CHANNEL ANALYTICS</Text>
        </TouchableOpacity>
      </View>

      {/* Realtime card */}
      <View style={styles.card}>
        <View style={styles.realtimeHeader}>
          <View style={styles.realtimeDot} />
          <Text style={styles.realtimeLabel}>REALTIME</Text>
        </View>
        <Text style={styles.realtimeValue}>
          {formatNumber(realtimeData?.views_last_48h || 0)}
        </Text>
        <Text style={styles.realtimeSubtext}>Views · Last 48 hours</Text>
        <View style={styles.realtimeMini}>
          <Text style={styles.realtimeMiniText}>
            {formatCompact(realtimeData?.views_last_60min || 0)}/hr now
          </Text>
          <View style={styles.realtimeViewers}>
            <View style={styles.liveDot} />
            <Text style={styles.realtimeViewersText}>
              {realtimeData?.current_viewers || 0} watching
            </Text>
          </View>
        </View>
        {/* Mini bar chart */}
        <View style={styles.miniChart}>
          {(realtimeData?.hourly_data || []).slice(0, 24).map((point: any, i: number) => {
            const maxVal = Math.max(...(realtimeData?.hourly_data || []).map((p: any) => p.views || 0), 1);
            const h = Math.max((point.views / maxVal) * 40, 1);
            return (
              <View key={i} style={[styles.miniBar, { height: h, backgroundColor: point.views > 0 ? COLORS.primary : COLORS.surfaceLight }]} />
            );
          })}
        </View>
      </View>

      {/* Latest published content */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Latest published content</Text>
        {(latestVideos || []).map((video: any) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoRow}
            onPress={() => router.push(`/video/${video.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.videoThumbWrap}>
              <Image
                source={{ uri: video.thumbnail_url || 'https://picsum.photos/640/360' }}
                style={styles.videoThumb}
              />
              {video.duration && video.duration !== '0:00' && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              )}
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
              <Text style={styles.videoMeta}>
                {timeAgo(video.published_at)} · {formatCompact(video.view_count)} views
              </Text>
              <View style={styles.videoStats}>
                <View style={styles.videoStatItem}>
                  <MaterialCommunityIcons name="thumb-up-outline" size={12} color={COLORS.textTertiary} />
                  <Text style={styles.videoStatText}>{formatCompact(video.like_count)}</Text>
                </View>
                <View style={styles.videoStatItem}>
                  <MaterialCommunityIcons name="comment-outline" size={12} color={COLORS.textTertiary} />
                  <Text style={styles.videoStatText}>{formatCompact(video.comment_count)}</Text>
                </View>
              </View>
            </View>
            <MaterialCommunityIcons name="dots-vertical" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Revenue summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Revenue</Text>
          <Text style={styles.cardSubtitle}>Last 28 days</Text>
        </View>
        <Text style={styles.revenueValue}>
          ${(stats?.estimated_revenue || 0).toFixed(2)}
        </Text>
        <Text style={styles.revenueChange}>
          {(stats?.revenue_change_percent || 0) >= 0 ? '↑' : '↓'}{' '}
          {Math.abs(stats?.revenue_change_percent || 0).toFixed(1)}% vs previous 28 days
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function AnalyticMetric({ label, value, change }: { label: string; value: string; change?: number }) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {change !== undefined && change !== 0 && (
        <Text style={[styles.metricChange, { color: isPositive ? COLORS.positive : COLORS.negative }]}>
          {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Subscriber card
  subscriberCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  subscriberTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceElevated,
  },
  subscriberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  subscriberLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  subscriberCount: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '600',
    marginTop: 2,
  },
  // Card
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  // Analytics grid
  analyticsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
  },
  metricValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '600',
  },
  metricChange: {
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  goToAnalytics: {
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 14,
    alignItems: 'center',
  },
  goToAnalyticsText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Realtime
  realtimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  realtimeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.positive,
  },
  realtimeLabel: {
    color: COLORS.positive,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  realtimeValue: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  realtimeSubtext: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  realtimeMini: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  realtimeMiniText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  realtimeViewers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.youtubeRed,
  },
  realtimeViewersText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 44,
    marginTop: 12,
    gap: 2,
  },
  miniBar: {
    flex: 1,
    borderRadius: 1,
    minHeight: 1,
  },
  // Video list
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  videoThumbWrap: {
    width: 120,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceElevated,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.overlay,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  durationText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxs,
    fontWeight: '500',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  videoTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    lineHeight: 18,
  },
  videoMeta: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  videoStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  videoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  videoStatText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  // Revenue
  revenueValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '600',
  },
  revenueChange: {
    color: COLORS.positive,
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
  },
});
