import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { StatCard } from '../../components/ui/StatCard';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

export default function RevenueScreen() {
  useRealtimeSubscription('revenue', ['revenueData']);
  useRealtimeSubscription('dashboard_stats', ['revenueStats']);

  const { data: stats } = useQuery({
    queryKey: ['revenueStats'],
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

  const { data: revenueData } = useQuery({
    queryKey: ['revenueData'],
    queryFn: async () => {
      const { data } = await supabase
        .from('revenue')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .order('month', { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const latestRevenue = revenueData?.[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Revenue Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Estimated revenue</Text>
        <Text style={styles.summaryValue}>
          ${(stats?.estimated_revenue || 0).toFixed(2)}
        </Text>
        <Text style={styles.summaryPeriod}>Last 28 days</Text>
        {stats?.revenue_change_percent !== undefined && (
          <Text
            style={[
              styles.summaryChange,
              {
                color:
                  stats.revenue_change_percent >= 0
                    ? COLORS.positive
                    : COLORS.negative,
              },
            ]}
          >
            {stats.revenue_change_percent >= 0 ? '▲' : '▼'}{' '}
            {Math.abs(stats.revenue_change_percent).toFixed(1)}% vs previous 28 days
          </Text>
        )}
      </View>

      {/* RPM / CPM */}
      <View style={styles.statsRow}>
        <StatCard
          title="RPM"
          value={`$${(latestRevenue?.rpm || 0).toFixed(2)}`}
          subtitle="Revenue per 1000 views"
        />
        <StatCard
          title="CPM"
          value={`$${(latestRevenue?.cpm || 0).toFixed(2)}`}
          subtitle="Cost per 1000 impressions"
        />
      </View>

      {/* Revenue Sources */}
      <View style={styles.sourcesCard}>
        <Text style={styles.sourcesTitle}>Revenue sources</Text>
        {latestRevenue && (
          <>
            <RevenueSourceRow
              icon="advertisements"
              label="Ads"
              amount={latestRevenue.ad_revenue}
              total={latestRevenue.estimated_revenue}
            />
            <RevenueSourceRow
              icon="account-group"
              label="Memberships"
              amount={latestRevenue.membership_revenue}
              total={latestRevenue.estimated_revenue}
            />
            <RevenueSourceRow
              icon="chat"
              label="Super Chat & Stickers"
              amount={latestRevenue.superchat_revenue}
              total={latestRevenue.estimated_revenue}
            />
            <RevenueSourceRow
              icon="shopping"
              label="Merchandise"
              amount={latestRevenue.merchandise_revenue}
              total={latestRevenue.estimated_revenue}
            />
            <RevenueSourceRow
              icon="youtube-subscription"
              label="YouTube Premium"
              amount={latestRevenue.premium_revenue}
              total={latestRevenue.estimated_revenue}
            />
          </>
        )}
      </View>

      {/* Monthly Revenue */}
      <View style={styles.monthlyCard}>
        <Text style={styles.sourcesTitle}>Monthly revenue</Text>
        {(revenueData || []).map((rev: any) => (
          <View key={rev.id} style={styles.monthRow}>
            <Text style={styles.monthLabel}>
              {new Date(rev.month).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.monthValue}>
              ${rev.estimated_revenue.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

function RevenueSourceRow({
  icon,
  label,
  amount,
  total,
}: {
  icon: string;
  label: string;
  amount: number;
  total: number;
}) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;

  return (
    <View style={styles.sourceRow}>
      <MaterialCommunityIcons
        name={icon as any}
        size={20}
        color={COLORS.textSecondary}
      />
      <View style={styles.sourceInfo}>
        <Text style={styles.sourceLabel}>{label}</Text>
        <View style={styles.sourceBar}>
          <View
            style={[
              styles.sourceBarFill,
              { width: `${Math.min(percentage, 100)}%` },
            ]}
          />
        </View>
      </View>
      <Text style={styles.sourceAmount}>${amount.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  summaryValue: {
    color: COLORS.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
  summaryPeriod: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  summaryChange: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sourcesCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  sourcesTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  sourceInfo: {
    flex: 1,
  },
  sourceLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xs,
  },
  sourceBar: {
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
  },
  sourceBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sourceAmount: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    minWidth: 70,
    textAlign: 'right',
  },
  monthlyCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
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
  bottomSpacer: {
    height: 40,
  },
});
