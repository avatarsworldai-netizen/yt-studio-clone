import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

interface StatCardProps {
  title: string;
  value: string;
  changePercent?: number;
  subtitle?: string;
}

export function StatCard({ title, value, changePercent, subtitle }: StatCardProps) {
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {changePercent !== undefined && (
        <Text style={[styles.change, { color: isPositive ? COLORS.positive : COLORS.negative }]}>
          {isPositive ? '▲' : '▼'} {Math.abs(changePercent).toFixed(1)}%
        </Text>
      )}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '600',
  },
  change: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});
