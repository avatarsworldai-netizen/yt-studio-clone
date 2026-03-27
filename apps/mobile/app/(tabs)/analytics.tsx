import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { StatCard } from '../../components/ui/StatCard';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';
const screenWidth = Dimensions.get('window').width;

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
  return num.toString();
}

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('last_28_days');
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Overview');

  useRealtimeSubscription('dashboard_stats', ['analyticsStats']);
  useRealtimeSubscription('analytics_timeseries', ['timeseries']);

  const { data: stats } = useQuery({
    queryKey: ['analyticsStats', selectedPeriod],
    queryFn: async () => {
      const { data } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .eq('period', selectedPeriod)
        .single();
      return data;
    },
  });

  const { data: timeseries } = useQuery({
    queryKey: ['timeseries'],
    queryFn: async () => {
      const { data } = await supabase
        .from('analytics_timeseries')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .eq('metric_type', 'views')
        .order('date', { ascending: true })
        .limit(30);
      return data ?? [];
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Period Selector */}
      <View style={styles.periodRow}>
        {PERIODS.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodChip,
              selectedPeriod === period.key && styles.periodChipActive,
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period.key && styles.periodTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sub Tabs */}
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

      {/* Mini Chart Placeholder */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Views</Text>
        <Text style={styles.chartValue}>{formatNumber(stats?.views || 0)}</Text>
        <View style={styles.chartPlaceholder}>
          {(timeseries || []).map((point: any, index: number) => {
            const maxVal = Math.max(...(timeseries || []).map((p: any) => Number(p.value)));
            const height = maxVal > 0 ? (Number(point.value) / maxVal) * 100 : 0;
            return (
              <View
                key={index}
                style={[
                  styles.chartBar,
                  {
                    height: Math.max(height, 2),
                    backgroundColor: COLORS.primary,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Stats Grid */}
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
          title="Impressions"
          value={formatNumber(stats?.impressions || 0)}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Impressions CTR"
          value={`${(stats?.impression_ctr || 0).toFixed(1)}%`}
        />
        <StatCard
          title="Revenue"
          value={`$${(stats?.estimated_revenue || 0).toFixed(0)}`}
          changePercent={stats?.revenue_change_percent}
        />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  periodRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  periodChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
  },
  periodChipActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  periodTextActive: {
    color: COLORS.black,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.textPrimary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.textPrimary,
  },
  chartContainer: {
    margin: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  chartTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  chartValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
  },
  chartBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 2,
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
