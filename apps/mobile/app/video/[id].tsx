import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { COLORS, FONT_SIZE } from '../../constants/theme';

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useRealtimeSubscription('videos', ['video-detail']);

  const { data: video } = useQuery({
    queryKey: ['video-detail', id],
    queryFn: async () => {
      const { data } = await supabase.from('videos').select('*').eq('id', id).single();
      return data;
    },
    enabled: !!id,
  });

  if (!video) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textTertiary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Thumbnail */}
      <Image source={{ uri: video.thumbnail_url || 'https://picsum.photos/640/360' }} style={styles.thumbnail} />

      {/* Title section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{video.title}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: video.status === 'published' ? COLORS.positive + '20' : COLORS.surfaceLight }]}>
            <Text style={[styles.statusText, { color: video.status === 'published' ? COLORS.positive : COLORS.textSecondary }]}>
              {video.visibility === 'public' ? 'Public' : video.visibility.charAt(0).toUpperCase() + video.visibility.slice(1)}
            </Text>
          </View>
          {video.published_at && (
            <Text style={styles.dateText}>
              Published {new Date(video.published_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          )}
        </View>
      </View>

      {/* Key metrics */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricBox label="Views" value={formatNumber(video.view_count)} />
          <MetricBox label="Watch time (hrs)" value={formatNumber(video.watch_time_hours)} />
          <MetricBox label="Likes" value={formatNumber(video.like_count)} />
          <MetricBox label="Comments" value={formatNumber(video.comment_count)} />
        </View>
      </View>

      {/* Reach */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reach</Text>
        <DetailRow label="Impressions" value={formatNumber(video.impressions)} />
        <DetailRow label="Impressions CTR" value={`${video.impression_ctr}%`} />
        <DetailRow label="Avg view duration" value={video.average_view_duration} />
        <DetailRow label="Shares" value={formatNumber(video.share_count)} isLast />
      </View>

      {/* Revenue */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Revenue</Text>
        <DetailRow label="Estimated revenue" value={`$${video.estimated_revenue.toFixed(2)}`} />
        <DetailRow label="RPM" value={`$${video.rpm.toFixed(2)}`} />
        <DetailRow label="CPM" value={`$${video.cpm.toFixed(2)}`} isLast />
      </View>

      {/* Audience retention */}
      {video.retention_data?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Audience retention</Text>
          {video.retention_data.map((point: any, i: number) => (
            <View key={i} style={styles.retentionRow}>
              <Text style={styles.retentionTime}>
                {Math.floor(point.second / 60)}:{String(point.second % 60).padStart(2, '0')}
              </Text>
              <View style={styles.retentionBarBg}>
                <View style={[styles.retentionBarFill, { width: `${point.percentage}%` }]} />
              </View>
              <Text style={styles.retentionPct}>{point.percentage}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Traffic sources */}
      {video.traffic_sources?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Traffic sources</Text>
          {video.traffic_sources.map((src: any, i: number) => (
            <DetailRow
              key={i}
              label={src.source}
              value={`${src.percentage}%`}
              sub={`${formatNumber(src.views)} views`}
              isLast={i === video.traffic_sources.length - 1}
            />
          ))}
        </View>
      )}

      {/* Geography */}
      {video.audience_geography?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Top geographies</Text>
          {video.audience_geography.map((geo: any, i: number) => (
            <DetailRow
              key={i}
              label={geo.country}
              value={`${geo.percentage}%`}
              isLast={i === video.audience_geography.length - 1}
            />
          ))}
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricBoxValue}>{value}</Text>
      <Text style={styles.metricBoxLabel}>{label}</Text>
    </View>
  );
}

function DetailRow({ label, value, sub, isLast }: { label: string; value: string; sub?: string; isLast?: boolean }) {
  return (
    <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        {sub && <Text style={styles.detailSub}>{sub}</Text>}
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  thumbnail: { width: '100%', height: 210, backgroundColor: COLORS.surfaceElevated },
  titleSection: { padding: 16, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  title: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: '600', lineHeight: 24 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  statusBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  dateText: { color: COLORS.textTertiary, fontSize: FONT_SIZE.sm },
  card: { backgroundColor: COLORS.surface, margin: 16, marginBottom: 0, borderRadius: 12, padding: 16 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: FONT_SIZE.lg, fontWeight: '600', marginBottom: 14 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricBox: { width: '47%', backgroundColor: COLORS.surfaceElevated, borderRadius: 8, padding: 12 },
  metricBoxValue: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xxl, fontWeight: '600' },
  metricBoxLabel: { color: COLORS.textTertiary, fontSize: FONT_SIZE.xs, marginTop: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  detailRowBorder: { borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  detailLabel: { color: COLORS.textPrimary, fontSize: FONT_SIZE.md },
  detailSub: { color: COLORS.textTertiary, fontSize: FONT_SIZE.xs, marginTop: 2 },
  detailValue: { color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: '600' },
  retentionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  retentionTime: { color: COLORS.textTertiary, fontSize: FONT_SIZE.sm, width: 36 },
  retentionBarBg: { flex: 1, height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3 },
  retentionBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  retentionPct: { color: COLORS.textPrimary, fontSize: FONT_SIZE.sm, width: 36, textAlign: 'right' },
});
