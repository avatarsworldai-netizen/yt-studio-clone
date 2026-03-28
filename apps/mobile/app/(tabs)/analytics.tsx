import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';
import Svg, { Polyline } from 'react-native-svg';

const CID = '00000000-0000-0000-0000-000000000001';
const W = Dimensions.get('window').width;
const CARD_W = W * 0.75;
const IC = { arrowDown: require('../../assets/figma/arrow_down.png') };

function n(v: number) { if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.', ',')} M`; if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace('.', ',')} K`; return v.toLocaleString('es-ES'); }

const TABS = ['Vista General', 'Contenido', 'Audiencia', 'Ingresos', 'Tendencias'];

export default function AnalyticsScreen() {
  const [tab, setTab] = useState(0);
  useRealtimeSubscription('dashboard_stats', ['as2']);
  useRealtimeSubscription('analytics_timeseries', ['ts2']);

  const { data: st } = useQuery({ queryKey: ['as2'], queryFn: async () => { const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CID).eq('period', 'last_28_days').single(); return data } });
  const { data: ts } = useQuery({ queryKey: ['ts2'], queryFn: async () => { const { data } = await supabase.from('analytics_timeseries').select('*').eq('channel_id', CID).order('date', { ascending: true }).limit(120); return data ?? [] } });
  const { data: topVids } = useQuery({ queryKey: ['topV'], queryFn: async () => { const { data } = await supabase.from('videos').select('title,view_count,thumbnail_url').eq('channel_id', CID).eq('status', 'published').order('view_count', { ascending: false }).limit(4); return data ?? [] } });

  const viewsTs = (ts || []).filter((t: any) => t.metric_type === 'views');
  const watchTs = (ts || []).filter((t: any) => t.metric_type === 'watch_time');

  const metrics = [
    { label: 'Visualizaciones', value: n(st?.views || 0), sub: `${n(Math.abs(st?.views_change_percent || 0))} menos de lo habitual`, data: viewsTs, down: (st?.views_change_percent || 0) < 0 },
    { label: 'Tiempo de visualización (h)', value: n(st?.watch_time_hours || 0), sub: `${n(Math.abs(st?.watch_time_change_percent || 0))} menos de lo habitual`, data: watchTs, down: (st?.watch_time_change_percent || 0) < 0 },
    { label: 'Suscriptores', value: `+${n(st?.subscribers_net || 0)}`, sub: '', data: viewsTs, down: false },
    { label: 'Ingresos', value: `${(st?.estimated_revenue || 0).toFixed(2).replace('.', ',')}€`, sub: '', data: viewsTs, down: false },
  ];

  function pts(data: any[]) {
    if (!data.length) return '';
    const vals = data.map((d: any) => Number(d.value));
    const mx = Math.max(...vals, 1); const mn = Math.min(...vals, 0); const rng = mx - mn || 1;
    return vals.map((v, i) => `${(i / (vals.length - 1)) * (CARD_W - 32)},${90 - ((v - mn) / rng) * 80}`).join(' ');
  }

  const fd = viewsTs.length ? new Date(viewsTs[0].date).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '';
  const ld = viewsTs.length ? new Date(viewsTs[viewsTs.length - 1].date).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '';

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      {/* Sub-tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={[s.tab, tab === i && s.tabOn]} onPress={() => setTab(i)}>
            <Text style={[s.tabTxt, tab === i && s.tabTxtOn]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Metric cards carousel */}
      <FlatList horizontal pagingEnabled={false} showsHorizontalScrollIndicator={false} snapToInterval={CARD_W + 16} decelerationRate="fast"
        data={metrics} keyExtractor={(_, i) => String(i)} contentContainerStyle={s.carousel}
        renderItem={({ item }) => (
          <View style={s.chartCard}>
            <Text style={s.cLabel}>{item.label}</Text>
            <View style={s.cValRow}>
              <Text style={s.cVal}>{item.value}</Text>
              <Image source={IC.arrowDown} style={[s.arrowIcon, !item.down && { transform: [{ rotate: '180deg' }] }]} resizeMode="contain" />
            </View>
            {item.sub ? <Text style={s.cSub}>{item.sub}</Text> : null}
            <View style={s.chartWrap}>
              <Svg width={CARD_W - 32} height={100}>
                <Polyline points={pts(item.data)} fill="none" stroke="#4fc3f7" strokeWidth="2" />
              </Svg>
            </View>
            <View style={s.xAxis}><Text style={s.axLbl}>{fd}</Text><Text style={s.axLbl}>{ld}</Text></View>
          </View>
        )}
      />
      <View style={s.dots}>{metrics.map((_, i) => <View key={i} style={[s.dot, i === 0 && s.dotOn]} />)}</View>

      {/* Contenido más popular */}
      <View style={s.popCard}>
        <Text style={s.popTitle}>Contenido más popular</Text>
        <Text style={s.popSub}>Visualizaciones · Últimos 28 días</Text>
        {(topVids || []).map((v: any, i: number) => (
          <View key={i} style={s.popRow}>
            <Image source={{ uri: v.thumbnail_url || 'https://picsum.photos/640/360' }} style={s.popThumb} />
            <Text style={s.popVTitle} numberOfLines={1}>{v.title}</Text>
            <Text style={s.popViews}>{n(v.view_count)}</Text>
          </View>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  tabs: { paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: C.divider },
  tab: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: C.black },
  tabTxt: { fontSize: F.s14, fontWeight: '500', color: C.textTer },
  tabTxtOn: { color: C.text, fontWeight: '600' },
  carousel: { paddingHorizontal: 16, paddingTop: 12, gap: 16 },
  chartCard: { width: CARD_W, backgroundColor: C.cardBg, borderRadius: 16, borderWidth: 1, borderColor: C.cardBorder, padding: 16 },
  cLabel: { fontSize: F.s13, color: C.textSec },
  cValRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cVal: { fontSize: 26, fontWeight: '700', color: C.text },
  arrowIcon: { width: 15, height: 15 },
  cSub: { fontSize: F.s12, color: C.textTer, marginTop: 2 },
  chartWrap: { marginTop: 12 },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  axLbl: { fontSize: 10, color: C.textTer },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.divider },
  dotOn: { backgroundColor: C.text },
  popCard: { backgroundColor: C.cardBg, borderRadius: 16, borderWidth: 1, borderColor: C.cardBorder, marginHorizontal: 16, marginTop: 16, padding: 16 },
  popTitle: { fontSize: F.s17, fontWeight: '700', color: C.text },
  popSub: { fontSize: F.s12, color: C.textSec, marginTop: 2, marginBottom: 12 },
  popRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  popThumb: { width: 56, height: 32, borderRadius: 6, backgroundColor: C.divider },
  popVTitle: { flex: 1, fontSize: F.s13, color: C.text },
  popViews: { fontSize: F.s13, fontWeight: '600', color: C.text },
});
