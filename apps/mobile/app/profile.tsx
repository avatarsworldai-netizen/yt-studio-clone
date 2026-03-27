import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export default function ProfileScreen() {
  useRealtimeSubscription('channel', ['channelProfile']);

  const { data: channel } = useQuery({
    queryKey: ['channelProfile'],
    queryFn: async () => {
      const { data } = await supabase
        .from('channel')
        .select('*')
        .eq('id', CHANNEL_ID)
        .single();
      return data;
    },
  });

  if (!channel) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <Image
        source={{ uri: channel.banner_url || 'https://picsum.photos/1280/320' }}
        style={styles.banner}
      />

      {/* Avatar & Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: channel.avatar_url || 'https://picsum.photos/200/200' }}
          style={styles.avatar}
        />
        <View style={styles.nameRow}>
          <Text style={styles.name}>{channel.name}</Text>
          {channel.is_verified && (
            <MaterialCommunityIcons name="check-decagram" size={20} color={COLORS.textSecondary} />
          )}
        </View>
        <Text style={styles.handle}>{channel.handle}</Text>
        <Text style={styles.statsText}>
          {formatNumber(channel.subscriber_count)} subscribers · {channel.video_count} videos
        </Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {channel.description || 'No description'}
        </Text>
      </View>

      {/* Channel Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Channel stats</Text>
        <StatRow label="Total views" value={formatNumber(channel.total_views)} />
        <StatRow label="Total watch time" value={`${formatNumber(channel.total_watch_time_hours)} hours`} />
        <StatRow label="Subscribers" value={formatNumber(channel.subscriber_count)} />
        <StatRow label="Videos" value={channel.video_count.toString()} />
        <StatRow label="Country" value={channel.country} />
        <StatRow label="Joined" value={new Date(channel.joined_date).toLocaleDateString()} />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
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
  banner: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.surfaceLight,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: -40,
    borderWidth: 3,
    borderColor: COLORS.background,
    backgroundColor: COLORS.surfaceLight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  handle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  statsText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  descriptionSection: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  statsSection: {
    padding: SPACING.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
