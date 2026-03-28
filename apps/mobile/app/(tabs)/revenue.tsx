import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';

const CID = '00000000-0000-0000-0000-000000000001';
const IC = { arrowDown: require('../../assets/figma/arrow_down.png') };

export default function RevenueScreen() {
  useRealtimeSubscription('revenue', ['rv2']);
  useRealtimeSubscription('dashboard_stats', ['rs2']);

  const { data: st } = useQuery({ queryKey: ['rs2'], queryFn: async () => { const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CID).eq('period', 'last_28_days').single(); return data } });
  const { data: rev } = useQuery({ queryKey: ['rv2'], queryFn: async () => { const { data } = await supabase.from('revenue').select('*').eq('channel_id', CID).order('month', { ascending: false }).limit(6); return data ?? [] } });
  const lat = rev?.[0];

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <Text style={s.heroLbl}>Ingresos estimados</Text>
        <View style={s.heroValRow}>
          <Text style={s.heroVal}>{(st?.estimated_revenue || 0).toFixed(2).replace('.', ',')}€</Text>
          {st?.revenue_change_percent !== undefined && (
            <Image source={IC.arrowDown} style={[s.arrowIcon, (st.revenue_change_percent || 0) >= 0 && { transform: [{ rotate: '180deg' }] }]} resizeMode="contain" />
          )}
        </View>
        <Text style={s.heroPeriod}>Últimos 28 días</Text>
      </View>

      <View style={s.pair}>
        <View style={[s.miniCard, { marginRight: 4 }]}>
          <Text style={s.miniLbl}>RPM</Text>
          <Text style={s.miniVal}>{(lat?.rpm || 0).toFixed(2).replace('.', ',')}€</Text>
        </View>
        <View style={[s.miniCard, { marginLeft: 4 }]}>
          <Text style={s.miniLbl}>CPM</Text>
          <Text style={s.miniVal}>{(lat?.cpm || 0).toFixed(2).replace('.', ',')}€</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.secTitle}>Fuentes de ingresos</Text>
        {lat && <>
          <SrcRow label="Anuncios" amt={lat.ad_revenue} total={lat.estimated_revenue} />
          <SrcRow label="Suscripciones" amt={lat.membership_revenue} total={lat.estimated_revenue} />
          <SrcRow label="Super Chat" amt={lat.superchat_revenue} total={lat.estimated_revenue} />
          <SrcRow label="Merchandising" amt={lat.merchandise_revenue} total={lat.estimated_revenue} />
          <SrcRow label="YouTube Premium" amt={lat.premium_revenue} total={lat.estimated_revenue} last />
        </>}
      </View>

      <View style={s.card}>
        <Text style={s.secTitle}>Ingresos mensuales</Text>
        {(rev || []).map((r: any) => (
          <View key={r.id} style={s.mRow}>
            <Text style={s.mLbl}>{new Date(r.month).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</Text>
            <Text style={s.mVal}>{r.estimated_revenue.toFixed(2).replace('.', ',')}€</Text>
          </View>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function SrcRow({ label, amt, total, last }: { label: string; amt: number; total: number; last?: boolean }) {
  const pct = total > 0 ? (amt / total) * 100 : 0;
  return (
    <View style={[s.srcRow, !last && { borderBottomWidth: 0.5, borderBottomColor: C.divider }]}>
      <View style={s.srcTop}><Text style={s.srcLbl}>{label}</Text><Text style={s.srcAmt}>{amt.toFixed(2).replace('.', ',')}€</Text></View>
      <View style={s.barBg}><View style={[s.barFill, { width: `${Math.min(pct, 100)}%` }]} /></View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  hero: { backgroundColor: C.cardBg, borderRadius: 12, borderWidth: 1, borderColor: C.cardBorder, marginHorizontal: 16, marginTop: 12, padding: 20 },
  heroLbl: { fontSize: F.s12, fontWeight: '400', color: C.textSec },
  heroValRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  heroVal: { fontSize: 28, fontWeight: '700', color: C.text },
  arrowIcon: { width: 15, height: 15 },
  heroPeriod: { fontSize: F.s12, color: C.textTer, marginTop: 2 },
  pair: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8 },
  miniCard: { flex: 1, backgroundColor: C.cardBg, borderRadius: 12, borderWidth: 1, borderColor: C.cardBorder, padding: 14 },
  miniLbl: { fontSize: F.s12, color: C.textSec },
  miniVal: { fontSize: F.s18, fontWeight: '700', color: C.text, marginTop: 4 },
  card: { backgroundColor: C.cardBg, borderRadius: 12, borderWidth: 1, borderColor: C.cardBorder, marginHorizontal: 16, marginTop: 8, padding: 16 },
  secTitle: { fontSize: F.s17, fontWeight: '700', color: C.text, marginBottom: 12 },
  srcRow: { paddingVertical: 12 },
  srcTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  srcLbl: { fontSize: F.s14, color: C.text },
  srcAmt: { fontSize: F.s14, fontWeight: '600', color: C.text },
  barBg: { height: 4, backgroundColor: C.divider, borderRadius: 2 },
  barFill: { height: '100%', backgroundColor: C.blue, borderRadius: 2 },
  mRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.divider },
  mLbl: { fontSize: F.s14, color: C.textSec },
  mVal: { fontSize: F.s14, fontWeight: '600', color: C.text },
});
