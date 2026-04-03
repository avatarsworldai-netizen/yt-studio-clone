import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const SKY_BLUE = '#64b5f6';
const GRID_COLOR = '#ececec';

type LineChartProps = {
  value: string | number;
  points?: number[];
  numPoints?: number;
  width?: number;
  height?: number;
  yLabels?: string[];
  xLabels?: string[];
  color?: string;
  filled?: boolean;
  /** If true, value is a total (e.g. monthly) and daily values are derived */
  isCurrency?: boolean;
};

/**
 * Parse a formatted value string to a number.
 */
function parseValue(v: string | number): number {
  if (typeof v === 'number') return v;
  let s = String(v).replace(/[€$\s]/g, '').trim();
  const hasK = s.toUpperCase().includes('K');
  s = s.replace(/[kK]/gi, '');
  if (s.includes(',')) {
    const parts = s.split(',');
    if (parts.length === 2) {
      s = parts[0].replace(/\./g, '') + '.' + parts[1];
    }
  }
  let num = parseFloat(s) || 0;
  if (hasK) num *= 1000;
  return num;
}

/** Check if value string contains € or currency indicators */
function isCurrencyValue(v: string | number): boolean {
  return String(v).includes('€') || String(v).includes('$');
}

/**
 * Pick a "nice" round step for Y-axis given the max value.
 * E.g. max=4.2 → step=1.40, max=900 → step=300, max=15 → step=5
 */
function niceStep(maxVal: number): number {
  if (maxVal <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const normalized = maxVal / magnitude;
  let step: number;
  if (normalized <= 1.5) step = 0.5 * magnitude;
  else if (normalized <= 3) step = magnitude;
  else if (normalized <= 7) step = 2 * magnitude;
  else step = 5 * magnitude;
  return step;
}

/**
 * Format Y-axis label with appropriate precision and unit.
 */
function formatYLabel(val: number, currency: boolean): string {
  let str: string;
  if (Math.abs(val) >= 1000) {
    str = (val / 1000).toFixed(1).replace('.', ',') + ' K';
  } else if (Math.abs(val) >= 100) {
    str = Math.round(val).toString();
  } else if (Math.abs(val) >= 10) {
    str = val.toFixed(1).replace('.', ',');
  } else {
    str = val.toFixed(2).replace('.', ',');
  }
  // Remove trailing ,0 or ,00
  str = str.replace(',00', '').replace(/,0$/, '');
  if (currency) str += ' €';
  return str;
}

/**
 * Generate plausible DAILY chart data points from a total/period value.
 * Creates a smooth, natural-looking curve like the original YT Studio.
 * The sum of daily values approximates the total.
 */
function generatePoints(totalValue: number, count: number): number[] {
  const daily = Math.abs(totalValue) / count;
  const pts: number[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    // Base: relatively flat with gentle waves (like real daily revenue)
    const base = daily;
    // Gentle sine waves at different frequencies for natural variation
    const wave1 = daily * 0.3 * Math.sin(t * Math.PI * 3.2 + 1.2);
    const wave2 = daily * 0.15 * Math.sin(t * Math.PI * 7.1 + 0.5);
    const wave3 = daily * 0.08 * Math.sin(t * Math.PI * 12.4 + 2.8);
    pts.push(Math.max(0, base + wave1 + wave2 + wave3));
  }

  return pts;
}

export function DynamicLineChart({
  value,
  points: inputPoints,
  numPoints = 28,
  width = 250,
  height = 100,
  yLabels: inputYLabels,
  xLabels,
  color = SKY_BLUE,
  filled = false,
  isCurrency: forceCurrency,
}: LineChartProps) {
  const numericValue = parseValue(value);
  const currency = forceCurrency !== undefined ? forceCurrency : isCurrencyValue(value);
  const pts = inputPoints || generatePoints(numericValue, numPoints);

  const maxVal = Math.max(...pts, 0.01);
  const minVal = Math.min(...pts, 0);

  // Compute nice Y-axis scale
  const step = niceStep(maxVal);
  const yMax = Math.ceil(maxVal / step) * step;
  const ySteps = [yMax, yMax * 2 / 3, yMax / 3, 0];

  // Build SVG polyline points — scale to yMax
  const polyPoints = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * width;
      const y = height - (v / yMax) * (height - 6);
      return `${x},${y}`;
    })
    .join(' ');

  const yLabels = inputYLabels || ySteps.map(v => formatYLabel(v, currency));

  return (
    <View>
      <View style={{ flexDirection: 'row', height }}>
        {/* Y-axis */}
        <View style={{ width: 42, justifyContent: 'space-between', paddingRight: 4 }}>
          {yLabels.map((l, i) => (
            <Text key={i} style={cs.axisText}>{l}</Text>
          ))}
        </View>
        {/* Chart area */}
        <View style={{ flex: 1, position: 'relative', height }}>
          {/* Grid lines (behind) */}
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * (height / 3), height: 1, backgroundColor: GRID_COLOR, zIndex: 0 }} />
          ))}
          {/* SVG line (on top) */}
          <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}>
            <Polyline points={polyPoints} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </Svg>
        </View>
      </View>
      {/* X-axis */}
      {xLabels && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 42, marginTop: 4 }}>
          {xLabels.map((l, i) => (
            <Text key={i} style={cs.axisText}>{l}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

type BarChartProps = {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  yLabels?: string[];
  onBarPress?: (index: number) => void;
  selectedBar?: number | null;
};

export function DynamicBarChart({
  data,
  height = 170,
  activeColor = '#1db4a5',
  inactiveColor = '#a8e6cf',
  yLabels: inputYLabels,
  onBarPress,
  selectedBar,
}: BarChartProps) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const step = niceStep(maxVal);
  const yMax = Math.ceil(maxVal / step) * step;

  const yLabels = inputYLabels || [
    formatYLabel(yMax, true),
    formatYLabel(yMax * 2 / 3, true),
    formatYLabel(yMax / 3, true),
    '0 €',
  ];

  return (
    <View>
      <View style={{ flexDirection: 'row', height, marginTop: 16 }}>
        {/* Y-axis */}
        <View style={{ width: 45, justifyContent: 'space-between', paddingRight: 6 }}>
          {yLabels.map((l, i) => (
            <Text key={i} style={cs.axisText}>{l}</Text>
          ))}
        </View>
        {/* Bars area */}
        <View style={{ flex: 1, height, position: 'relative' }}>
          {/* Grid lines */}
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * (height / 3), height: 1, backgroundColor: GRID_COLOR }} />
          ))}
          {/* Bars */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 4 }}>
            {data.map((bar, i) => {
              const h = (bar.value / yMax) * (height - 20);
              const isLast = i === data.length - 1;
              return (
                <View
                  key={i}
                  style={{ alignItems: 'center', flex: 1 }}
                  onTouchEnd={() => onBarPress?.(i)}
                >
                  <View style={{ width: '65%', height: Math.max(h, 2), backgroundColor: bar.color || (isLast ? activeColor : inactiveColor), borderRadius: 3 }} />
                </View>
              );
            })}
          </View>
          {/* Tooltip */}
          {selectedBar !== null && selectedBar !== undefined && selectedBar >= 0 && (() => {
            const bar = data[selectedBar];
            if (!bar) return null;
            const barH = (bar.value / yMax) * (height - 20);
            const barCenterX = ((selectedBar + 0.5) / data.length) * 100;
            return (
              <View style={{ position: 'absolute', left: `${barCenterX - 12}%` as any, top: height - barH - 30, backgroundColor: '#fefefe', borderWidth: 1, borderColor: '#e4e4e4', borderRadius: 2, paddingHorizontal: 12, paddingVertical: 6, zIndex: 99, minWidth: 100 }} pointerEvents="none">
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#2c2c2c' }}>{bar.label}: {Number(bar.value || 0).toFixed(2).replace('.', ',')} €</Text>
              </View>
            );
          })()}
        </View>
      </View>
      {/* X-axis labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 45, marginTop: 4 }}>
        {data.map((bar, i) => (
          <Text key={i} style={cs.axisText}>{bar.label}</Text>
        ))}
      </View>
    </View>
  );
}

const cs = StyleSheet.create({
  axisText: { fontSize: 10, fontWeight: '500', color: '#7a7a7a' },
});
