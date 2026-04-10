import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

interface CommentCardProps {
  authorName: string;
  authorAvatarUrl: string | null;
  content: string;
  likeCount: number;
  isHearted: boolean;
  isPinned: boolean;
  publishedAt: string;
  videoTitle?: string;
}

export function CommentCard({
  authorName,
  authorAvatarUrl,
  content,
  likeCount,
  isHearted,
  isPinned,
  publishedAt,
  videoTitle,
}: CommentCardProps) {
  return (
    <View style={styles.container}>
      {isPinned && (
        <View style={styles.pinnedBadge}>
          <MaterialCommunityIcons name="pin" size={12} color={COLORS.textSecondary} />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}
      <View style={styles.header}>
        <Image
          source={{ uri: authorAvatarUrl || undefined }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.date}>
            {new Date(publishedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {videoTitle && (
        <Text style={styles.videoTitle} numberOfLines={1}>
          On: {videoTitle}
        </Text>
      )}
      <Text style={styles.content} numberOfLines={3}>
        {content}
      </Text>
      <View style={styles.actions}>
        <View style={styles.actionItem}>
          <MaterialCommunityIcons name="thumb-up-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.actionText}>{likeCount}</Text>
        </View>
        <View style={styles.actionItem}>
          <MaterialCommunityIcons name="thumb-down-outline" size={16} color={COLORS.textSecondary} />
        </View>
        {isHearted && (
          <View style={styles.actionItem}>
            <MaterialCommunityIcons name="heart" size={16} color={COLORS.negative} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 4,
  },
  pinnedText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
  },
  headerInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  authorName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  date: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  videoTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  content: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
});
