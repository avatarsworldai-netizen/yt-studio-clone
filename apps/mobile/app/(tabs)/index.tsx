import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { VideoListItem } from '../../components/ui/VideoListItem';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
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
      const { data } = await supabase
        .from('channel')
        .select('*')
        .eq('id', CHANNEL_ID)
        .single();
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .eq('period', 'last_28_days')
        .single();
      return data;
    },
  });

  const { data: realtimeData } = useQuery({
    queryKey: ['realtimeStats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('realtime_stats')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .single();
      return data;
    },
  });

  const { data: latestVideos } = useQuery({
    queryKey: ['latestVideos'],
    queryFn: async () => {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Channel Header */}
      <TouchableOpacity style={styles.channelHeader} onPress={() => router.push('/profile')}>
        <Image
          source={{ uri: channel?.avatar_url || 'https://picsum.photos/200/200' }}
          style={styles.avatar}
        />
        <View style={styles.channelInfo}>
          <View style={styles.channelNameRow}>
            <Text style={styles.channelName}>{channel?.name || 'Loading...'}</Text>
            {channel?.is_verified && (
              <MaterialCommunityIcons name="check-decagram" size={16} color={COLORS.textSecondary} />
            )}
          </View>
          <Text style={styles.subscriberCount}>
            {formatNumber(channel?.subscriber_count || 0)} subscribers
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Realtime Card */}
      <View style={styles.realtimeCard}>
        <Text style={styles.realtimeLabel}>Realtime</Text>
        <Text style={styles.realtimeValue}>
          {formatNumber(realtimeData?.views_last_48h || 0)}
        </Text>
        <Text style={styles.realtimeSubtitle}>Views in last 48 hours</Text>
        <View style={styles.realtimeRow}>
          <Text style={styles.realtimeMinor}>
            {formatNumber(realtimeData?.views_last_60min || 0)} views/hr now
          </Text>
          <View style={styles.currentViewers}>
            <MaterialCommunityIcons name="eye" size={14} color={COLORS.positive} />
            <Text style={[styles.realtimeMinor, { color: COLORS.positive }]}>
              {realtimeData?.current_viewers || 0} watching
            </Text>
          </View>
        </View>
      </View>

      {/* Summary Stats */}
      <SectionHeader title="Channel analytics" actionText="SEE MORE" />
      <Text style={styles.periodLabel}>Last 28 days</Text>
      <View style={styles.statsRow}>
        <StatCard
          title="Views"
          value={formatNumber(stats?.views || 0)}
          changePercent={stats?.views_change_percent}
        />
        <StatCard
          title="Watch time (hrs)"
          value={formatNumber(stats?.watch_time_hours || 0)}
          changePercent={stats?.watch_time_change_percent}
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          title="Subscribers"
          value={`+${formatNumber(stats?.subscribers_net || 0)}`}
          changePercent={stats?.subscribers_change_percent}
        />
        <StatCard
          title="Revenue"
          value={`$${(stats?.estimated_revenue || 0).toFixed(0)}`}
          changePercent={stats?.revenue_change_percent}
        />
      </View>

      {/* Latest Videos */}
      <SectionHeader title="Latest videos" />
      {(latestVideos || []).map((video: any) => (
        <VideoListItem
          key={video.id}
          title={video.title}
          thumbnailUrl={video.thumbnail_url}
          viewCount={video.view_count}
          publishedAt={video.published_at}
          duration={video.duration}
          status={video.status}
          visibility={video.visibility}
          onPress={() => router.push(`/video/${video.id}`)}
        />
      ))}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
  },
  channelInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  subscriberCount: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  realtimeCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  realtimeLabel: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  realtimeValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
  },
  realtimeSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  realtimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  realtimeMinor: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  currentViewers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  bottomSpacer: {
    height: 40,
  },
});
