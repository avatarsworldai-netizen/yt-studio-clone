import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { VideoListItem } from '../../components/ui/VideoListItem';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

const CHANNEL_ID = '00000000-0000-0000-0000-000000000001';
const FILTERS = ['Videos', 'Shorts', 'Live', 'Posts'] as const;

export default function ContentScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Videos');

  useRealtimeSubscription('videos', ['videos']);

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .order('sort_order', { ascending: true });
      return data ?? [];
    },
  });

  return (
    <View style={styles.container}>
      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (
          <VideoListItem
            title={item.title}
            thumbnailUrl={item.thumbnail_url}
            viewCount={item.view_count}
            publishedAt={item.published_at}
            duration={item.duration}
            status={item.status}
            visibility={item.visibility}
            onPress={() => router.push(`/video/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading videos...' : 'No videos yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
  },
  filterChipActive: {
    backgroundColor: COLORS.textPrimary,
  },
  filterText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.background,
  },
  empty: {
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
});
