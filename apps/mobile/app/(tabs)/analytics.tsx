import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';
import Svg, { Polyline } from 'react-native-svg';

const CID = '00000000-0000-0000-0000-000000000001';

function fmt(v: number) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.', ',')} M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace('.', ',')} K`;
  return v.toLocaleString('es-ES');
}

const TABS = ['Vista General', 'Contenido', 'Audiencia', 'Ingresos', 'Te...'];
const FILTER_CHIPS = ['Todo', 'Anuncios de la página de vi...', 'Anuncios del feed'];

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState(3); // Ingresos active by default
  const [activeChip, setActiveChip] = useState(0);

  useRealtimeSubscription('dashboard_stats', ['as3']);
  useRealtimeSubscription('analytics_timeseries', ['ts3']);
  useRealtimeSubscription('revenue', ['rv3']);

  const { data: st } = useQuery({ queryKey: ['as3'], queryFn: async () => { const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CID).eq('period', 'last_28_days').single(); return data } });
  const { data: ts } = useQuery({ queryKey: ['ts3'], queryFn: async () => { const { data } = await supabase.from('analytics_timeseries').select('*').eq('channel_id', CID).eq('metric_type', 'revenue').order('date', { ascending: true }).limit(30); return data ?? [] } });
  const { data: rev } = useQuery({ queryKey: ['rv3'], queryFn: async () => { const { data } = await supabase.from('revenue').select('*').eq('channel_id', CID).order('month', { ascending: false }).limit(6); return data ?? [] } });

  // Build SVG line chart points
  const chartW = 338;
  const chartH = 100;
  function buildPoints() {
    if (!ts || !ts.length) return '';
    const vals = ts.map((d: any) => Number(d.value));
    const mx = Math.max(...vals, 1);
    const mn = Math.min(...vals, 0);
    const rng = mx - mn || 1;
    return vals.map((v, i) => `${(i / (vals.length - 1)) * chartW},${chartH - ((v - mn) / rng) * (chartH - 10)}`).join(' ');
  }

  // Y-axis labels
  const vals = (ts || []).map((d: any) => Number(d.value));
  const maxVal = Math.max(...vals, 1);
  const yLabels = [maxVal, maxVal * 0.66, maxVal * 0.33, 0].map(v => `${v.toFixed(2).replace('.', ',')} €`);

  // X-axis labels
  const firstDate = ts?.length ? new Date(ts[0].date).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '';
  const lastDate = ts?.length ? new Date(ts[ts.length - 1].date).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '';

  // Max revenue for progress bars
  const maxRev = Math.max(...(rev || []).map((r: any) => r.estimated_revenue), 1);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      {/* ── Sub-tabs ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsRow}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={s.tabItem} onPress={() => setActiveTab(i)}>
            <Text style={[s.tabText, activeTab === i && s.tabTextActive]}>{t}</Text>
            {activeTab === i && <View style={s.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={s.tabDivider} />

      {/* ── Filter chips ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
        {FILTER_CHIPS.map((chip, i) => (
          <TouchableOpacity
            key={chip}
            style={[s.chip, activeChip === i && s.chipActive]}
            onPress={() => setActiveChip(i)}
          >
            <Text style={[s.chipText, activeChip === i && s.chipTextActive]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Revenue chart card ── */}
      <View style={s.chartCard}>
        <Text style={s.chartLabel}>Ingresos estimados</Text>
        <Text style={s.chartValue}>{(st?.estimated_revenue || 0).toFixed(2).replace('.', ',')} €</Text>

        {/* Chart with Y-axis */}
        <View style={s.chartArea}>
          <View style={s.yAxisLabels}>
            {yLabels.map((label, i) => (
              <Text key={i} style={s.axisText}>{label}</Text>
            ))}
          </View>
          <View style={s.chartSvgWrap}>
            {/* Grid lines */}
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[s.gridLine, { top: i * (chartH / 3) }]} />
            ))}
            <Svg width={chartW} height={chartH}>
              <Polyline points={buildPoints()} fill="none" stroke="#1db4a5" strokeWidth="2.5" />
            </Svg>
          </View>
        </View>

        {/* X-axis */}
        <View style={s.xAxisRow}>
          <Text style={s.axisText}>{firstDate}</Text>
          <Text style={s.axisText}>{lastDate}</Text>
        </View>
      </View>

      {/* ── Monthly earnings card ── */}
      <View style={s.earningsCard}>
        <Text style={s.earningsTitle}>Cuánto estás ganando</Text>
        <Text style={s.earningsSub}>Estimación · Últimos 6 meses</Text>

        {(rev || []).map((r: any, i: number) => {
          const pct = (r.estimated_revenue / maxRev) * 100;
          const monthName = new Date(r.month).toLocaleDateString('es-ES', { month: 'long', year: i >= 3 ? 'numeric' : undefined });
          const isCurrentMonth = i === 0;
          return (
            <View key={r.id} style={s.monthRow}>
              <View style={s.monthTop}>
                <Text style={s.monthName}>
                  {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                  {isCurrentMonth ? ' (en curso)' : ''}
                </Text>
                <Text style={s.monthValue}>{r.estimated_revenue.toFixed(2).replace('.', ',')} €</Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${Math.min(pct, 100)}%` }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const TEAL = '#1db4a5';

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Sub-tabs — fs=15pt, inactive=#6c6c6c, active=#2b2b2b with underline
  tabsRow: { paddingHorizontal: 12 },
  tabItem: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 10, position: 'relative' },
  tabText: { fontSize: 15, fontWeight: '500', color: '#6c6c6c' },
  tabTextActive: { color: '#2b2b2b', fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 10, right: 10, height: 3, backgroundColor: C.black, borderRadius: 1.5 },
  tabDivider: { height: 1, backgroundColor: C.divider },

  // Filter chips — active: bg=#0e0e0e text=#efefef, inactive: bg=#f1f1f1 text=#252525
  chipsRow: { paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f1f1f1' },
  chipActive: { backgroundColor: '#0e0e0e' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#252525' },
  chipTextActive: { color: '#efefef' },

  // Revenue chart card
  chartCard: { backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 4, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  chartLabel: { fontSize: 14, fontWeight: '600', color: '#717171' },
  chartValue: { fontSize: 23, fontWeight: '700', color: '#1e1e1e', marginTop: 4 },

  // Chart area
  chartArea: { flexDirection: 'row', marginTop: 16, height: 100 },
  yAxisLabels: { width: 45, justifyContent: 'space-between', paddingRight: 6 },
  chartSvgWrap: { flex: 1, position: 'relative' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#ececec' },
  axisText: { fontSize: 10, fontWeight: '500', color: '#7a7a7a' },
  xAxisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingLeft: 45 },

  // Monthly earnings card
  earningsCard: { backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  earningsTitle: { fontSize: 17, fontWeight: '700', color: '#212121' },
  earningsSub: { fontSize: 14, fontWeight: '400', color: '#747474', marginTop: 4, marginBottom: 16 },

  // Month rows
  monthRow: { marginBottom: 16 },
  monthTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  monthName: { fontSize: 13, fontWeight: '400', color: '#313131' },
  monthValue: { fontSize: 14, fontWeight: '600', color: '#2b2b2b' },
  barBg: { height: 9, backgroundColor: '#ececec', borderRadius: 5 },
  barFill: { height: '100%', backgroundColor: TEAL, borderRadius: 5 },
});
