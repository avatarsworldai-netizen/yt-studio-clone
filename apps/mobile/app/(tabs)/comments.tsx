import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { COLORS, FONT_SIZE } from '../../constants/theme';

const FILTERS = ['All', 'Held for review'] as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
}

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

  const renderComment = ({ item }: { item: any }) => (
    <View style={styles.commentItem}>
      {item.is_pinned && (
        <View style={styles.pinnedRow}>
          <MaterialCommunityIcons name="pin" size={12} color={COLORS.textTertiary} />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}
      <View style={styles.commentHeader}>
        <Image
          source={{ uri: item.author_avatar_url || 'https://picsum.photos/40/40' }}
          style={styles.avatar}
        />
        <View style={styles.commentHeaderInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName}>{item.author_name}</Text>
            <Text style={styles.timeText}>{timeAgo(item.published_at)}</Text>
          </View>
          <Text style={styles.videoRef} numberOfLines={1}>
            {item.videos?.title}
          </Text>
        </View>
      </View>

      <Text style={styles.commentContent} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="thumb-up-outline" size={16} color={COLORS.textTertiary} />
          {item.like_count > 0 && (
            <Text style={styles.actionCount}>{item.like_count}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="thumb-down-outline" size={16} color={COLORS.textTertiary} />
        </TouchableOpacity>
        {item.is_hearted && (
          <View style={styles.heartedBadge}>
            <MaterialCommunityIcons name="heart" size={14} color={COLORS.youtubeRed} />
          </View>
        )}
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.replyBtn}>
          <MaterialCommunityIcons name="reply" size={16} color={COLORS.primary} />
          <Text style={styles.replyText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.chip, activeFilter === filter && styles.chipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item: any) => item.id}
        renderItem={renderComment}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="comment-outline" size={48} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>{isLoading ? 'Loading...' : 'No comments'}</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceElevated,
  },
  chipActive: {
    backgroundColor: COLORS.white,
  },
  chipText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.black,
  },
  commentItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pinnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  pinnedText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceElevated,
  },
  commentHeaderInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  timeText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  videoRef: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  commentContent: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
    marginTop: 8,
    marginLeft: 46,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 46,
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  heartedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  empty: {
    padding: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.md,
  },
});
