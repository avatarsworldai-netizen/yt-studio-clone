import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

const PERIODS = [
  { key: 'last_7_days', label: '7 days' },
  { key: 'last_28_days', label: '28 days' },
  { key: 'last_90_days', label: '90 days' },
  { key: 'lifetime', label: 'Lifetime' },
] as const;

const TABS = ['Overview', 'Reach', 'Engagement', 'Audience'] as const;

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('last_28_days');
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Overview');

  useRealtimeSubscription('dashboard_stats', ['analyticsStats']);
  useRealtimeSubscription('analytics_timeseries', ['timeseries']);

  const { data: stats } = useQuery({
    queryKey: ['analyticsStats', selectedPeriod],
    queryFn: async () => {
      const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CHANNEL_ID).eq('period', selectedPeriod).single();
      return data;
    },
  });

  const { data: timeseries } = useQuery({
    queryKey: ['timeseries'],
    queryFn: async () => {
      const { data } = await supabase.from('analytics_timeseries').select('*').eq('channel_id', CHANNEL_ID).eq('metric_type', 'views').order('date', { ascending: true }).limit(30);
      return data ?? [];
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Period chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.periodChip, selectedPeriod === p.key && styles.periodChipActive]}
            onPress={() => setSelectedPeriod(p.key)}
          >
            <Text style={[styles.periodText, selectedPeriod === p.key && styles.periodTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sub-tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart card */}
      <View style={styles.chartCard}>
        <Text style={styles.chartLabel}>Views</Text>
        <Text style={styles.chartValue}>{formatNumber(stats?.views || 0)}</Text>
        {stats?.views_change_percent !== undefined && stats?.views_change_percent !== 0 && (
          <Text style={[styles.chartChange, { color: stats.views_change_percent >= 0 ? COLORS.positive : COLORS.negative }]}>
            {stats.views_change_percent >= 0 ? '↑' : '↓'} {Math.abs(stats.views_change_percent).toFixed(1)}%
          </Text>
        )}
        {/* Line chart visualization */}
        <View style={styles.chartArea}>
          {(timeseries || []).map((point: any, i: number) => {
            const values = (timeseries || []).map((p: any) => Number(p.value));
            const maxVal = Math.max(...values, 1);
            const h = (Number(point.value) / maxVal) * 80;
            return (
              <View key={i} style={styles.chartBarWrap}>
                <View style={[styles.chartBar, { height: Math.max(h, 2) }]} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Metrics list */}
      <View style={styles.metricsCard}>
        <MetricRow
          icon="eye-outline"
          label="Views"
          value={formatNumber(stats?.views || 0)}
          change={stats?.views_change_percent}
        />
        <MetricRow
          icon="clock-outline"
          label="Watch time (hours)"
          value={formatNumber(stats?.watch_time_hours || 0)}
          change={stats?.watch_time_change_percent}
        />
        <MetricRow
          icon="account-plus-outline"
          label="Subscribers"
          value={`+${formatNumber(stats?.subscribers_net || 0)}`}
          change={stats?.subscribers_change_percent}
        />
        <MetricRow
          icon="image-multiple-outline"
          label="Impressions"
          value={formatNumber(stats?.impressions || 0)}
        />
        <MetricRow
          icon="cursor-default-click-outline"
          label="Impressions CTR"
          value={`${(stats?.impression_ctr || 0).toFixed(1)}%`}
        />
        <MetricRow
          icon="currency-usd"
          label="Estimated revenue"
          value={`$${(stats?.estimated_revenue || 0).toFixed(2)}`}
          change={stats?.revenue_change_percent}
          isLast
        />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function MetricRow({ icon, label, value, change, isLast }: {
  icon: string; label: string; value: string; change?: number; isLast?: boolean;
}) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <View style={[styles.metricRow, !isLast && styles.metricRowBorder]}>
      <MaterialCommunityIcons name={icon as any} size={20} color={COLORS.textSecondary} />
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricRight}>
        <Text style={styles.metricValue}>{value}</Text>
        {change !== undefined && change !== 0 && (
          <Text style={[styles.metricChange, { color: isPositive ? COLORS.positive : COLORS.negative }]}>
            {isPositive ? '↑' : '↓'}{Math.abs(change).toFixed(1)}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  periodRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  periodChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceElevated,
  },
  periodChipActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  periodTextActive: {
    color: COLORS.black,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.white,
  },
  tabText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.white,
  },
  // Chart
  chartCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  chartLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  chartValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    marginTop: 2,
  },
  chartChange: {
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginTop: 16,
    gap: 1.5,
  },
  chartBarWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: COLORS.primary,
    borderRadius: 1,
    width: '100%',
    minHeight: 2,
  },
  // Metrics
  metricsCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  metricRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  metricLabel: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  metricValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  metricChange: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
});
