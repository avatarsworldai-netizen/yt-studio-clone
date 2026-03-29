import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';

const CID = '00000000-0000-0000-0000-000000000001';

// Figma icon assets
const IC = {
  arrowDown: require('../../assets/figma/arrow_down.png'),
  chart: require('../../assets/figma/stat_icon_chart.png'),
  like: require('../../assets/figma/stat_icon_like.png'),
  comment: require('../../assets/figma/stat_icon_comment.png'),
  money: require('../../assets/figma/stat_icon_money.png'),
  chevDown: require('../../assets/figma/chevron_down.png'),
  chevUp: require('../../assets/figma/chevron_up.png'),
};

function n(v: number) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.', ',')} M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace('.', ',')} K`;
  return v.toLocaleString('es-ES');
}

function since(d: string | null) {
  if (!d) return '';
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 36e5);
  const dy = Math.floor(h / 24);
  if (dy === 0) return `Primeras ${h} horas`;
  return `Primeros ${dy} días y ${h % 24} horas`;
}

export default function Dashboard() {
  const r = useRouter();
  const [exp, setExp] = useState<string | null>(null);

  useRealtimeSubscription('dashboard_stats', ['ds']);
  useRealtimeSubscription('channel', ['ch']);
  useRealtimeSubscription('videos', ['lv']);

  const { data: ch } = useQuery({ queryKey: ['ch'], queryFn: async () => { const { data } = await supabase.from('channel').select('*').eq('id', CID).single(); return data } });
  const { data: st } = useQuery({ queryKey: ['ds'], queryFn: async () => { const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CID).eq('period', 'last_28_days').single(); return data } });
  const { data: vids } = useQuery({ queryKey: ['lv'], queryFn: async () => { const { data } = await supabase.from('videos').select('*').eq('channel_id', CID).eq('status', 'published').eq('visibility', 'public').order('published_at', { ascending: false }).limit(3); return data ?? [] } });

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      {/* ── Channel row ── */}
      <TouchableOpacity style={s.chRow} activeOpacity={0.7} onPress={() => r.push('/profile')}>
        <Image source={{ uri: ch?.avatar_url || 'https://picsum.photos/200/200' }} style={s.chAva} />
        <View style={s.chMeta}>
          <Text style={s.chName} numberOfLines={1}>{ch?.name || ''}</Text>
          <Text style={s.chSubs}>{n(ch?.subscriber_count || 0)}</Text>
          <Text style={s.chLabel}>Suscriptores totales</Text>
        </View>
      </TouchableOpacity>

      {/* ── Estadísticas del canal ── */}
      <View style={s.sec}>
        <View style={s.secHead}>
          <Text style={s.secTitle}>Estadísticas del canal</Text>
          <Text style={s.secRight}>Últimos 28 días</Text>
        </View>
        <View style={s.grid}>
          <MCard label="Visualizaciones" value={n(st?.views || 0)} down={(st?.views_change_percent || 0) < 0} />
          <MCard label="Tiempo de visualización (ho..." value={n(st?.watch_time_hours || 0)} down={(st?.watch_time_change_percent || 0) < 0} />
          <MCard label="Suscriptores" value={`${(st?.subscribers_net || 0) >= 0 ? '' : ''}${n(st?.subscribers_net || 0)}`} hideArrow />
          <MCard label="Ingresos estimados" value={`${(st?.estimated_revenue || 0).toFixed(2).replace('.', ',')}€`} down={(st?.revenue_change_percent || 0) < 0} />
        </View>
      </View>

      {/* ── Último contenido publicado ── */}
      <View style={s.sec}>
        <Text style={s.secTitle}>Último contenido publicado</Text>
        {(vids || []).map((v: any) => {
          const open = exp === v.id;
          return (
            <View key={v.id} style={s.vCard}>
              {/* Thumbnail + title */}
              <TouchableOpacity style={s.vTop} activeOpacity={0.7} onPress={() => r.push(`/video/${v.id}`)}>
                <Image source={{ uri: v.thumbnail_url || 'https://picsum.photos/640/360' }} style={s.vThumb} />
                <View style={s.vInfo}>
                  <Text style={s.vTitle} numberOfLines={2}>{v.title}</Text>
                  <Text style={s.vDate}>{since(v.published_at)}</Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View style={s.vDiv} />

              {/* Quick stats — exact Figma gaps: money-18-chart-6-views-25-like-6-likes-25-comment-5-text */}
              <View style={s.vQuick}>
                {v.estimated_revenue > 0 && <Image source={IC.money} style={s.qIcon} resizeMode="contain" />}
                <Image source={IC.chart} style={s.qIconSm} resizeMode="contain" />
                <Text style={s.qText}>{n(v.view_count)}</Text>
                <Image source={IC.like} style={s.qIconSm} resizeMode="contain" />
                <Text style={[s.qText, { marginRight: 25 }]}>{n(v.like_count)}</Text>
                <Image source={IC.comment} style={[s.qIconSm, { marginRight: 5 }]} resizeMode="contain" />
                <Text style={[s.qText, { marginRight: 0 }]}>{v.comment_count}</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => setExp(open ? null : v.id)} hitSlop={12}>
                  <Image source={open ? IC.chevUp : IC.chevDown} style={s.chevron} resizeMode="contain" />
                </TouchableOpacity>
              </View>

              {/* Expanded */}
              {open && (
                <View style={s.vExp}>
                  <ERow label="Clasificación por visualizaciones" value="2 de 10" chevron />
                  <ERow label="Visualizaciones" value={n(v.view_count)} up />
                  <ERow label="Porcentaje de clics de las impresiones" value={`${v.impression_ctr} %`} up />
                  <ERow label="Duración media de las visualizaciones" value={v.average_view_duration} up />
                  <View style={{ height: 10 }} />
                  <ERow label="Comentarios" value={String(v.comment_count)} />
                  <Text style={s.noReply}>No hay comentarios sin responder</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ── Components ── */

function MCard({ label, value, down, hideArrow }: { label: string; value: string; down?: boolean; hideArrow?: boolean }) {
  return (
    <View style={s.mBox}>
      <Text style={s.mLabel} numberOfLines={1}>{label}</Text>
      <View style={s.mValRow}>
        <Text style={s.mValue}>{value}</Text>
        {!hideArrow && (
          <Image source={IC.arrowDown} style={[s.arrowIcon, !down && { transform: [{ rotate: '180deg' }] }]} resizeMode="contain" />
        )}
      </View>
    </View>
  );
}

function ERow({ label, value, up, chevron }: { label: string; value: string; up?: boolean; chevron?: boolean }) {
  return (
    <View style={s.eRow}>
      <Text style={s.eLabel} numberOfLines={1}>{label}</Text>
      <View style={s.eRight}>
        <Text style={s.eVal}>{value}</Text>
        {chevron && <Text style={{ fontSize: 16, color: C.textSec }}>{'>'}</Text>}
        {up && (
          <Image source={IC.arrowDown} style={[s.arrowIconSm, { transform: [{ rotate: '180deg' }] }]} resizeMode="contain" />
        )}
      </View>
    </View>
  );
}

/* ── Styles (exact Figma values / 3) ── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Channel — avatar at 15pt from left, text at 109pt from left
  chRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 20, paddingTop: 10, paddingBottom: 18 },
  chAva: { width: 77, height: 77, borderRadius: 39, backgroundColor: C.sectionBg },
  chMeta: { marginLeft: 17, flex: 1 },
  chName: { fontSize: F.s18, fontWeight: '700', color: C.text },
  chSubs: { fontSize: F.s23, fontWeight: '700', color: '#1d1d1d', marginTop: 2 },
  chLabel: { fontSize: F.s14, fontWeight: '400', color: '#757575', marginTop: 1 },

  // Section
  sec: { paddingHorizontal: 13, marginBottom: 10 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  secTitle: { fontSize: F.s17, fontWeight: '700', color: '#202020' },
  secRight: { fontSize: F.s12, fontWeight: '400', color: '#707070' },

  // 2x2 metric grid — 204x80pt cards, 4pt gap, 13pt margin
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  mBox: { width: '49%', backgroundColor: C.cardBg, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, height: 80, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  mLabel: { fontSize: F.s12, fontWeight: '400', color: '#737373', marginBottom: 6 },
  mValRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mValue: { fontSize: F.s18, fontWeight: '700', color: '#171717' },
  arrowIcon: { width: 15, height: 15 },
  arrowIconSm: { width: 14, height: 14 },

  // Video card — padding 19pt, thumb 79x44, gap 12pt
  vCard: { backgroundColor: C.cardBg, borderRadius: 12, marginTop: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  vTop: { flexDirection: 'row', padding: 19, paddingBottom: 14, gap: 12 },
  vThumb: { width: 79, height: 44, borderRadius: 6, backgroundColor: C.sectionBg },
  vInfo: { flex: 1, justifyContent: 'center' },
  vTitle: { fontSize: F.s14, fontWeight: '400', color: '#323232', lineHeight: 18 },
  vDate: { fontSize: F.s14, fontWeight: '400', color: '#727272', marginTop: 3 },
  vDiv: { height: 1, backgroundColor: C.divider, marginHorizontal: 19 },
  vQuick: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 19, paddingVertical: 10 },
  qIcon: { width: 17, height: 17, marginRight: 18 },
  qIconSm: { width: 15, height: 15, marginRight: 6 },
  qText: { fontSize: F.s14, fontWeight: '400', color: '#272727', marginRight: 25 },
  chevron: { width: 14, height: 9 },

  // Expanded
  vExp: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: C.divider },
  eRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: C.divider },
  eLabel: { fontSize: F.s14, fontWeight: '400', color: C.text, flex: 1, marginRight: 8 },
  eRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eVal: { fontSize: F.s14, fontWeight: '600', color: C.text },
  noReply: { fontSize: F.s12, fontWeight: '400', color: '#757575', marginTop: 4 },
});
