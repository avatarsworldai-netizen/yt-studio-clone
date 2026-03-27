import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  useRealtimeSubscription('videos', ['video-detail']);

  const { data: video } = useQuery({
    queryKey: ['video-detail', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      return data;
    },
    enabled: !!id,
  });

  if (!video) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Video Thumbnail */}
      <Image
        source={{ uri: video.thumbnail_url || 'https://picsum.photos/640/360' }}
        style={styles.thumbnail}
      />

      {/* Title & Meta */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.meta}>
          {video.visibility} · {video.status}
          {video.published_at &&
            ` · ${new Date(video.published_at).toLocaleDateString()}`}
        </Text>
      </View>

      {/* Key Metrics */}
      <SectionHeader title="Key metrics" />
      <View style={styles.statsRow}>
        <StatCard title="Views" value={formatNumber(video.view_count)} />
        <StatCard title="Watch time" value={`${formatNumber(video.watch_time_hours)} hrs`} />
      </View>
      <View style={styles.statsRow}>
        <StatCard title="Likes" value={formatNumber(video.like_count)} />
        <StatCard title="Comments" value={formatNumber(video.comment_count)} />
      </View>

      {/* Reach */}
      <SectionHeader title="Reach" />
      <View style={styles.statsRow}>
        <StatCard title="Impressions" value={formatNumber(video.impressions)} />
        <StatCard title="CTR" value={`${video.impression_ctr}%`} />
      </View>
      <View style={styles.statsRow}>
        <StatCard title="Shares" value={formatNumber(video.share_count)} />
        <StatCard title="Avg duration" value={video.average_view_duration} />
      </View>

      {/* Revenue */}
      <SectionHeader title="Revenue" />
      <View style={styles.statsRow}>
        <StatCard title="Revenue" value={`$${video.estimated_revenue.toFixed(2)}`} />
        <StatCard title="RPM" value={`$${video.rpm.toFixed(2)}`} />
      </View>

      {/* Audience Retention */}
      {video.retention_data && video.retention_data.length > 0 && (
        <>
          <SectionHeader title="Audience retention" />
          <View style={styles.retentionCard}>
            {video.retention_data.map((point: any, index: number) => (
              <View key={index} style={styles.retentionRow}>
                <Text style={styles.retentionTime}>
                  {Math.floor(point.second / 60)}:{String(point.second % 60).padStart(2, '0')}
                </Text>
                <View style={styles.retentionBarBg}>
                  <View
                    style={[
                      styles.retentionBarFill,
                      { width: `${point.percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.retentionPercent}>{point.percentage}%</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Traffic Sources */}
      {video.traffic_sources && video.traffic_sources.length > 0 && (
        <>
          <SectionHeader title="Traffic sources" />
          <View style={styles.trafficCard}>
            {video.traffic_sources.map((source: any, index: number) => (
              <View key={index} style={styles.trafficRow}>
                <View style={styles.trafficInfo}>
                  <Text style={styles.trafficLabel}>{source.source}</Text>
                  <Text style={styles.trafficViews}>
                    {formatNumber(source.views)} views
                  </Text>
                </View>
                <Text style={styles.trafficPercent}>{source.percentage}%</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Geography */}
      {video.audience_geography && video.audience_geography.length > 0 && (
        <>
          <SectionHeader title="Top geographies" />
          <View style={styles.trafficCard}>
            {video.audience_geography.map((geo: any, index: number) => (
              <View key={index} style={styles.trafficRow}>
                <Text style={styles.trafficLabel}>{geo.country}</Text>
                <Text style={styles.trafficPercent}>{geo.percentage}%</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surfaceLight,
  },
  titleSection: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    lineHeight: 24,
  },
  meta: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  retentionCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  retentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  retentionTime: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    width: 40,
  },
  retentionBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
  },
  retentionBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  retentionPercent: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    width: 40,
    textAlign: 'right',
  },
  trafficCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  trafficRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  trafficInfo: {
    flex: 1,
  },
  trafficLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
  },
  trafficViews: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  trafficPercent: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
