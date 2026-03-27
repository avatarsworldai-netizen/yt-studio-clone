import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { CommentCard } from '../../components/ui/CommentCard';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

const FILTERS = ['All', 'Held for review'] as const;

export default function CommentsScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useRealtimeSubscription('comments', ['comments']);

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', activeFilter],
    queryFn: async () => {
      let query = supabase
        .from('comments')
        .select('*, videos!inner(title)')
        .order('published_at', { ascending: false });

      if (activeFilter === 'Held for review') {
        query = query.eq('status', 'held_for_review');
      } else {
        query = query.in('status', ['published', 'held_for_review']);
      }

      const { data } = await query.limit(50);
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
        data={comments}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (
          <CommentCard
            authorName={item.author_name}
            authorAvatarUrl={item.author_avatar_url}
            content={item.content}
            likeCount={item.like_count}
            isHearted={item.is_hearted}
            isPinned={item.is_pinned}
            publishedAt={item.published_at}
            videoTitle={item.videos?.title}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading comments...' : 'No comments yet'}
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
