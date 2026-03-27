import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { COLORS, FONT_SIZE } from '../../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

export default function RevenueScreen() {
  useRealtimeSubscription('revenue', ['revenueData']);
  useRealtimeSubscription('dashboard_stats', ['revenueStats']);

  const { data: stats } = useQuery({
    queryKey: ['revenueStats'],
    queryFn: async () => {
      const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CHANNEL_ID).eq('period', 'last_28_days').single();
      return data;
    },
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenueData'],
    queryFn: async () => {
      const { data } = await supabase.from('revenue').select('*').eq('channel_id', CHANNEL_ID).order('month', { ascending: false }).limit(6);
      return data ?? [];
    },
  });

  const latestRevenue = revenueData?.[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Revenue Hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Estimated revenue</Text>
        <Text style={styles.heroValue}>
          ${(stats?.estimated_revenue || 0).toFixed(2)}
        </Text>
        <Text style={styles.heroPeriod}>Last 28 days</Text>
        {stats?.revenue_change_percent !== undefined && (
          <View style={styles.heroChangeRow}>
            <MaterialCommunityIcons
              name={stats.revenue_change_percent >= 0 ? 'trending-up' : 'trending-down'}
              size={16}
              color={stats.revenue_change_percent >= 0 ? COLORS.positive : COLORS.negative}
            />
            <Text style={[styles.heroChange, { color: stats.revenue_change_percent >= 0 ? COLORS.positive : COLORS.negative }]}>
              {Math.abs(stats.revenue_change_percent).toFixed(1)}%
            </Text>
            <Text style={styles.heroChangeSub}>vs previous period</Text>
          </View>
        )}

        {/* Mini chart from monthly data */}
        <View style={styles.miniChart}>
          {(revenueData || []).reverse().map((rev: any, i: number) => {
            const max = Math.max(...(revenueData || []).map((r: any) => r.estimated_revenue), 1);
            const h = (rev.estimated_revenue / max) * 50;
            return (
              <View key={rev.id} style={styles.miniBarWrap}>
                <View style={[styles.miniBar, { height: Math.max(h, 2) }]} />
                <Text style={styles.miniBarLabel}>
                  {new Date(rev.month).toLocaleDateString('en', { month: 'short' })}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* RPM / CPM */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { marginRight: 6 }]}>
          <Text style={styles.metricLabel}>RPM</Text>
          <Text style={styles.metricValue}>${(latestRevenue?.rpm || 0).toFixed(2)}</Text>
          <Text style={styles.metricSub}>Revenue per mille</Text>
        </View>
        <View style={[styles.metricCard, { marginLeft: 6 }]}>
          <Text style={styles.metricLabel}>CPM</Text>
          <Text style={styles.metricValue}>${(latestRevenue?.cpm || 0).toFixed(2)}</Text>
          <Text style={styles.metricSub}>Cost per mille</Text>
        </View>
      </View>

      {/* Revenue sources */}
      <View style={styles.sourcesCard}>
        <Text style={styles.sectionTitle}>Revenue sources</Text>
        {latestRevenue && (
          <>
            <SourceRow label="Ads" amount={latestRevenue.ad_revenue} total={latestRevenue.estimated_revenue} icon="television-play" />
            <SourceRow label="Memberships" amount={latestRevenue.membership_revenue} total={latestRevenue.estimated_revenue} icon="account-group" />
            <SourceRow label="Super Chat" amount={latestRevenue.superchat_revenue} total={latestRevenue.estimated_revenue} icon="chat" />
            <SourceRow label="Merchandise" amount={latestRevenue.merchandise_revenue} total={latestRevenue.estimated_revenue} icon="shopping" />
            <SourceRow label="YouTube Premium" amount={latestRevenue.premium_revenue} total={latestRevenue.estimated_revenue} icon="youtube-subscription" isLast />
          </>
        )}
      </View>

      {/* Monthly breakdown */}
      <View style={styles.monthlyCard}>
        <Text style={styles.sectionTitle}>Monthly earnings</Text>
        {(revenueData || []).map((rev: any) => (
          <View key={rev.id} style={styles.monthRow}>
            <Text style={styles.monthLabel}>
              {new Date(rev.month).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
            </Text>
            <Text style={styles.monthValue}>${rev.estimated_revenue.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function SourceRow({ label, amount, total, icon, isLast }: {
  label: string; amount: number; total: number; icon: string; isLast?: boolean;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <View style={[styles.sourceRow, !isLast && styles.sourceRowBorder]}>
      <MaterialCommunityIcons name={icon as any} size={20} color={COLORS.textSecondary} />
      <View style={styles.sourceInfo}>
        <View style={styles.sourceTop}>
          <Text style={styles.sourceLabel}>{label}</Text>
          <Text style={styles.sourceAmount}>${amount.toFixed(2)}</Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Hero
  heroCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  heroLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  heroValue: {
    color: COLORS.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    marginTop: 4,
  },
  heroPeriod: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  heroChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  heroChange: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  heroChangeSub: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
    gap: 4,
  },
  miniBarWrap: {
    flex: 1,
    alignItems: 'center',
  },
  miniBar: {
    width: '80%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    minHeight: 2,
  },
  miniBarLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xxs,
    marginTop: 4,
  },
  // Metrics row
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  metricValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '600',
    marginTop: 4,
  },
  metricSub: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xxs,
    marginTop: 2,
  },
  // Sources
  sourcesCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: 14,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  sourceRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  sourceInfo: {
    flex: 1,
  },
  sourceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sourceLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
  },
  sourceAmount: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  barBg: {
    height: 3,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 2,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  // Monthly
  monthlyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  monthLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  monthValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
