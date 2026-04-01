import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';

const screenW = Dimensions.get('window').width;

interface CarouselProps {
  children: React.ReactNode[];
  itemWidth?: number;
  showDots?: boolean;
}

export function Carousel({ children, itemWidth, showDots = true }: CarouselProps) {
  const [page, setPage] = useState(0);
  const w = itemWidth || screenW;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={Platform.OS !== 'web'}
        decelerationRate="fast"
        onScroll={(e) => {
          const p = Math.round(e.nativeEvent.contentOffset.x / w);
          if (p !== page && p >= 0 && p < children.length) setPage(p);
        }}
        scrollEventThrottle={16}
        // @ts-ignore - web only CSS
        style={Platform.OS === 'web' ? {
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        } : undefined}
      >
        {children.map((child, i) => (
          <View
            key={i}
            style={[
              { width: w },
              // @ts-ignore - web only CSS
              Platform.OS === 'web' ? { scrollSnapAlign: 'start' } : undefined,
            ]}
          >
            {child}
          </View>
        ))}
      </ScrollView>
      {showDots && children.length > 1 && (
        <View style={st.dotsRow}>
          {children.map((_, i) => (
            <View key={i} style={[st.dot, page === i && st.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 14 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d5d5d5' },
  dotActive: { backgroundColor: '#333' },
});
