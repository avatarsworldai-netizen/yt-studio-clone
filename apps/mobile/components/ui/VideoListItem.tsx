import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

interface VideoListItemProps {
  title: string;
  thumbnailUrl: string | null;
  viewCount: number;
  publishedAt: string | null;
  duration: string | null;
  status: string;
  visibility: string;
  onPress?: () => void;
}

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'No date';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

const STATUS_COLORS: Record<string, string> = {
  published: COLORS.positive,
  draft: COLORS.textSecondary,
  unlisted: COLORS.textSecondary,
  private: COLORS.negative,
  scheduled: '#ff8c00',
};

export function VideoListItem({
  title,
  thumbnailUrl,
  viewCount,
  publishedAt,
  duration,
  status,
  visibility,
  onPress,
}: VideoListItemProps) {
  const displayStatus = visibility !== 'public' ? visibility : status;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: thumbnailUrl || undefined }}
          style={styles.thumbnail}
        />
        {duration && duration !== '0:00' && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.meta}>
          {displayStatus !== 'published' && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[displayStatus] + '20' },
              ]}
            >
              <Text
                style={[styles.statusText, { color: STATUS_COLORS[displayStatus] }]}
              >
                {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
              </Text>
            </View>
          )}
          <Text style={styles.metaText}>
            {formatViews(viewCount)} · {formatTimeAgo(publishedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 120,
    height: 68,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceLight,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
});
