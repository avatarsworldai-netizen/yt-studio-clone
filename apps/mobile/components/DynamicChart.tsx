import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, Platform } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Path, Circle, Line } from 'react-native-svg';
import { sendEditMessage } from '../hooks/useAdminMode';
import { getOverride, useFieldOverrides } from '../hooks/useFieldOverrides';

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
  /** If true, hide built-in Y labels (caller renders them externally) */
  hideYLabels?: boolean;
  /** If true, hide built-in X labels (caller renders them externally) */
  hideXLabels?: boolean;
  /** Pattern ID (1-10) for chart shape */
  pattern?: string;
  /** Enable tap-to-show-tooltip on data points */
  interactive?: boolean;
  /** Date labels for tooltip (one per data point, e.g. ["1 mar", "2 mar", ...]) */
  dateLabels?: string[];
  /** ID prefix for editable tooltip (e.g. "chart_main" → allows editing point values) */
  tooltipId?: string;
};

/**
 * Parse a formatted value string to a number.
 */
export function parseValue(v: string | number): number {
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
export function niceStep(maxVal: number): number {
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
export function formatYLabel(val: number, currency: boolean): string {
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
 * 10 chart patterns — each is a function that takes (t: 0→1) and returns a multiplier (0→1).
 */
/**
 * Seeded random for deterministic noise per pattern.
 */
function seededRand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Build a pattern function with sharp daily noise (like real YT Studio data).
 * `shape` defines the overall trend, noise adds daily randomness.
 */
function makePattern(shape: (t: number) => number, seed: number = 0) {
  return (t: number, i: number, count: number): number => {
    const base = shape(t);
    // Sharp daily noise — each "day" gets a random spike/dip
    const noise = (seededRand(i * 13.37 + seed) - 0.5) * 0.3;
    return Math.max(0, base + noise);
  };
}

export const CHART_PATTERNS: Record<string, { name: string; fn: (t: number, i: number, count: number) => number }> = {
  '1': { name: 'Estable bajo', fn: makePattern((t) => 0.15, 1) },
  '2': { name: 'Subida gradual', fn: makePattern((t) => 0.05 + t * 0.6, 2) },
  '3': { name: 'Bajada gradual', fn: makePattern((t) => 0.7 - t * 0.6, 3) },
  '4': { name: 'Pico al inicio', fn: makePattern((t) => t < 0.15 ? t * 6.5 : Math.max(0.05, 0.8 - (t - 0.15) * 0.9), 4) },
  '5': { name: 'Pico al final', fn: makePattern((t) => t > 0.85 ? 0.1 + (t - 0.85) * 6 : 0.08 + t * 0.05, 5) },
  '6': { name: 'Pico en el medio', fn: makePattern((t) => {
    const d = Math.abs(t - 0.45);
    return d < 0.08 ? 1.0 - d * 5 : 0.1 + 0.15 * (1 - d);
  }, 6) },
  '7': { name: 'Valle en el medio', fn: makePattern((t) => {
    const d = Math.abs(t - 0.5);
    return d < 0.15 ? 0.05 + d * 2 : 0.4 + d * 0.3;
  }, 7) },
  '8': { name: 'Dos picos', fn: makePattern((t) => {
    const d1 = Math.abs(t - 0.3);
    const d2 = Math.abs(t - 0.75);
    const p1 = d1 < 0.08 ? 0.9 - d1 * 8 : 0;
    const p2 = d2 < 0.06 ? 0.5 - d2 * 6 : 0;
    return 0.08 + Math.max(p1, p2);
  }, 8) },
  '9': { name: 'Crecimiento explosivo', fn: makePattern((t) => 0.03 + 0.9 * (t ** 3), 9) },
  '10': { name: 'Dientes de sierra', fn: makePattern((t) => {
    const cycle = (t * 5) % 1;
    return 0.1 + cycle * 0.5;
  }, 10) },
};

export const PATTERN_LIST = Object.entries(CHART_PATTERNS).map(([id, p]) => ({ id, name: p.name }));

/**
 * 10 bar chart patterns — each returns an array of 6 multipliers (0→1) for monthly bars.
 * The multipliers scale relative to the max value.
 */
export const BAR_PATTERNS: Record<string, { name: string; values: number[] }> = {
  '1': { name: 'Estable', values: [0.4, 0.45, 0.5, 0.42, 0.48, 0.44] },
  '2': { name: 'Crecimiento', values: [0.1, 0.2, 0.35, 0.5, 0.7, 0.95] },
  '3': { name: 'Decrecimiento', values: [0.95, 0.75, 0.55, 0.35, 0.2, 0.1] },
  '4': { name: 'Pico diciembre', values: [0.15, 0.08, 0.95, 0.3, 0.65, 0.25] },
  '5': { name: 'Pico febrero', values: [0.12, 0.06, 0.2, 0.15, 0.9, 0.3] },
  '6': { name: 'Doble pico', values: [0.1, 0.85, 0.15, 0.9, 0.2, 0.12] },
  '7': { name: 'Valle central', values: [0.7, 0.6, 0.1, 0.08, 0.55, 0.8] },
  '8': { name: 'Escalera', values: [0.15, 0.3, 0.45, 0.6, 0.75, 0.9] },
  '9': { name: 'Dientes de sierra', values: [0.8, 0.15, 0.7, 0.1, 0.9, 0.2] },
  '10': { name: 'Todo alto', values: [0.75, 0.85, 0.9, 0.8, 0.88, 0.82] },
};

export const BAR_PATTERN_LIST = Object.entries(BAR_PATTERNS).map(([id, p]) => ({ id, name: p.name }));

/**
 * Generate bar data from a total value and a bar pattern.
 */
export function generateBarData(
  totalValue: number,
  labels: string[],
  patternId: string = '1',
  activeColor: string = '#1db4a5',
  inactiveColor: string = '#a8e6cf',
): { label: string; value: number; color: string }[] {
  const pattern = BAR_PATTERNS[patternId] || BAR_PATTERNS['1'];
  const maxMultiplier = Math.max(...pattern.values);

  return labels.map((label, i) => {
    const multiplier = pattern.values[i % pattern.values.length];
    const value = (totalValue / labels.length) * (multiplier / maxMultiplier) * 2;
    const isLast = i === labels.length - 1;
    return { label, value, color: isLast ? activeColor : inactiveColor };
  });
}

/**
 * Generate chart data points from a total value using a named pattern.
 */
function generatePoints(totalValue: number, count: number, patternId?: string): number[] {
  const pattern = CHART_PATTERNS[patternId || '1'] || CHART_PATTERNS['1'];
  const pts: number[] = [];
  const peak = Math.abs(totalValue) / count;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const multiplier = pattern.fn(t, i, count);
    pts.push(Math.max(0, peak * 2.5 * multiplier));
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
  hideYLabels = false,
  hideXLabels = false,
  pattern,
  interactive = true,
  dateLabels,
  tooltipId,
}: LineChartProps) {
  useFieldOverrides(); // Subscribe to override changes
  const numericValue = parseValue(value);
  const currency = forceCurrency !== undefined ? forceCurrency : isCurrencyValue(value);
  const rawPts = inputPoints || generatePoints(numericValue, numPoints, pattern);

  // Apply per-point overrides — parse numeric value from full tooltip text like "1 abr 2026: 5,00 €"
  const pts = tooltipId ? rawPts.map((v, i) => {
    const override = getOverride('ui_analytics', 'point_value', `${tooltipId}_${i}`);
    if (override) {
      // Extract the value after the last ":" if present
      const parts = override.split(':');
      const valuePart = parts.length > 1 ? parts[parts.length - 1].trim() : override;
      const parsed = parseValue(valuePart);
      return parsed > 0 ? parsed : v;
    }
    return v;
  }) : rawPts;

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

  // Interactive state
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  }, []);

  const chartRef = useRef<View>(null);
  const touchLayerId = useRef(`chart-touch-${Math.random().toString(36).slice(2)}`).current;

  // Attach native click listener for web
  useEffect(() => {
    if (Platform.OS !== 'web' || !interactive) return;
    const el = document.getElementById(touchLayerId);
    if (!el) return;
    const handler = (e: MouseEvent) => {
      if (chartWidth === 0) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const idx = Math.round((x / chartWidth) * (pts.length - 1));
      const clamped = Math.max(0, Math.min(pts.length - 1, idx));
      setSelectedIdx(prev => prev === clamped ? null : clamped);
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [interactive, chartWidth, pts.length]);

  // Click on tooltip → open editor
  useEffect(() => {
    if (Platform.OS !== 'web' || selectedIdx === null || !tooltipId) return;
    const tooltipEl = document.getElementById(`tooltip-${touchLayerId}-${selectedIdx}`);
    if (!tooltipEl) return;
    const handler = (e: MouseEvent) => {
      e.stopPropagation();
      const dateLabel = getDateLabel(selectedIdx);
      const valueStr = formatYLabel(pts[selectedIdx], currency);
      const fullText = `${dateLabel}: ${valueStr}`;
      sendEditMessage({
        id: `${tooltipId}_point_${selectedIdx}`,
        label: `Tooltip gráfica — punto ${selectedIdx + 1}`,
        value: fullText,
        type: 'text',
        table: 'ui_analytics',
        column: 'point_value',
        rowId: `${tooltipId}_${selectedIdx}`,
      });
    };
    tooltipEl.addEventListener('click', handler);
    return () => tooltipEl.removeEventListener('click', handler);
  }, [selectedIdx, tooltipId]);

  const handleTouch = useCallback((evt: any) => {
    if (!interactive || chartWidth === 0 || Platform.OS === 'web') return;
    try {
      const x = evt?.nativeEvent?.locationX;
      if (x === undefined) return;
      const idx = Math.round((x / chartWidth) * (pts.length - 1));
      const clamped = Math.max(0, Math.min(pts.length - 1, idx));
      setSelectedIdx(prev => prev === clamped ? null : clamped);
    } catch (e) {}
  }, [interactive, chartWidth, pts.length]);

  // Generate default date labels if not provided
  const getDateLabel = (idx: number): string => {
    if (dateLabels && dateLabels[idx]) return dateLabels[idx];
    // Auto-generate based on today's date going backwards
    const d = new Date();
    d.setDate(d.getDate() - (pts.length - 1 - idx));
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Selected point position
  const selX = selectedIdx !== null ? (selectedIdx / (pts.length - 1)) * 100 : 0;
  const selY = selectedIdx !== null ? (pts[selectedIdx] / yMax) * (height - 6) : 0;
  const selValue = selectedIdx !== null ? pts[selectedIdx] : 0;

  // Get tooltip override text (full content like "1 abr 2026: 0,50 €")
  const tooltipOverride = selectedIdx !== null && tooltipId
    ? getOverride('ui_analytics', 'point_value', `${tooltipId}_${selectedIdx}`)
    : undefined;
  const tooltipText = tooltipOverride || (selectedIdx !== null ? `${getDateLabel(selectedIdx)}: ${formatYLabel(selValue, currency)}` : '');

  return (
    <View>
      <View style={{ flexDirection: 'row', height }}>
        {/* Y-axis */}
        {!hideYLabels && (
          <View style={{ width: 42, justifyContent: 'space-between', paddingRight: 4 }}>
            {yLabels.map((l, i) => (
              <Text key={i} style={cs.axisText}>{l}</Text>
            ))}
          </View>
        )}
        {/* Chart area */}
        <View
          ref={chartRef}
          style={{ flex: 1, position: 'relative', height }}
          onLayout={onLayout}
        >
          {/* Grid lines (behind) */}
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * (height / 3), height: 1, backgroundColor: GRID_COLOR, zIndex: 0 }} />
          ))}
          {/* SVG line */}
          <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <Polyline points={polyPoints} fill="none" stroke={color} strokeWidth="2" />
          </Svg>
          {/* Touch/click layer on top of everything */}
          <View
            nativeID={touchLayerId}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, cursor: 'pointer' } as any}
            onTouchEnd={handleTouch}
            onStartShouldSetResponder={() => true}
          />

          {/* Selected point indicator */}
          {selectedIdx !== null && (
            <>
              {/* Vertical line + dot (non-interactive) */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }} pointerEvents="none">
                <View style={{ position: 'absolute', left: `${selX}%` as any, top: 0, bottom: 0, width: 1, backgroundColor: '#ccc', opacity: 0.6 }} />
                <View style={{
                  position: 'absolute',
                  left: `${selX}%` as any,
                  bottom: selY - 5,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: color,
                  borderWidth: 2,
                  borderColor: '#fff',
                  marginLeft: -5,
                }} />
              </View>
              {/* Tooltip (clickeable to edit) */}
              <View
                nativeID={`tooltip-${touchLayerId}-${selectedIdx}`}
                style={{
                  position: 'absolute',
                  left: selX > 65 ? undefined : (`${selX}%` as any),
                  right: selX > 65 ? 0 : undefined,
                  bottom: selY + 14,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  marginLeft: selX > 65 ? 0 : -40,
                  zIndex: 25,
                  cursor: 'pointer',
                } as any}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#2c2c2c' }}>
                  {tooltipText}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
      {/* X-axis */}
      {xLabels && !hideXLabels && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: hideYLabels ? 0 : 42, marginTop: 4 }}>
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
