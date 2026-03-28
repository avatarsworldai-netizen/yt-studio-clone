import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';

function n(v: number) { if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.', ',')} M`; if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace('.', ',')} K`; return v.toLocaleString('es-ES'); }

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useRealtimeSubscription('videos', ['vd2']);
  const { data: v } = useQuery({ queryKey: ['vd2', id], queryFn: async () => { const { data } = await supabase.from('videos').select('*').eq('id', id).single(); return data }, enabled: !!id });

  if (!v) return <View style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: C.textTer }}>Cargando...</Text></View>;

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: v.thumbnail_url || 'https://picsum.photos/640/360' }} style={s.thumb} />
      <View style={s.titleSec}><Text style={s.title}>{v.title}</Text><Text style={s.date}>{v.published_at ? new Date(v.published_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin publicar'}</Text></View>
      <View style={s.card}><Text style={s.secT}>Métricas clave</Text><View style={s.grid}>
        <MB l="Visualizaciones" v={n(v.view_count)} /><MB l="Tiempo visualización" v={n(v.watch_time_hours)} />
        <MB l="Me gusta" v={n(v.like_count)} /><MB l="Comentarios" v={n(v.comment_count)} />
      </View></View>
      <View style={s.card}><Text style={s.secT}>Alcance</Text>
        <DR l="Impresiones" v={n(v.impressions)} /><DR l="CTR de impresiones" v={`${v.impression_ctr}%`} /><DR l="Duración media" v={v.average_view_duration} /><DR l="Compartidos" v={n(v.share_count)} last />
      </View>
      <View style={s.card}><Text style={s.secT}>Ingresos</Text>
        <DR l="Ingresos estimados" v={`${v.estimated_revenue.toFixed(2).replace('.', ',')}€`} /><DR l="RPM" v={`${v.rpm.toFixed(2).replace('.', ',')}€`} /><DR l="CPM" v={`${v.cpm.toFixed(2).replace('.', ',')}€`} last />
      </View>
      {v.traffic_sources?.length > 0 && <View style={s.card}><Text style={s.secT}>Fuentes de tráfico</Text>{v.traffic_sources.map((t: any, i: number) => <DR key={i} l={t.source} v={`${t.percentage}%`} last={i === v.traffic_sources.length - 1} />)}</View>}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
function MB({ l, v }: { l: string; v: string }) { return <View style={s.mb}><Text style={s.mbV}>{v}</Text><Text style={s.mbL}>{l}</Text></View> }
function DR({ l, v, last }: { l: string; v: string; last?: boolean }) { return <View style={[s.dr, !last && { borderBottomWidth: 0.5, borderBottomColor: C.divider }]}><Text style={s.drL}>{l}</Text><Text style={s.drV}>{v}</Text></View> }

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg }, thumb: { width: '100%', height: 210, backgroundColor: C.sectionBg },
  titleSec: { padding: 16, borderBottomWidth: 0.5, borderBottomColor: C.divider }, title: { fontSize: F.s18, fontWeight: '600', color: C.text }, date: { fontSize: F.s12, color: C.textTer, marginTop: 4 },
  card: { backgroundColor: C.cardBg, borderRadius: 12, borderWidth: 1, borderColor: C.cardBorder, margin: 16, marginBottom: 0, padding: 16 }, secT: { fontSize: F.s17, fontWeight: '700', color: C.text, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, mb: { width: '48%', backgroundColor: C.bg, borderRadius: 8, padding: 12, borderWidth: 0.5, borderColor: C.divider }, mbV: { fontSize: F.s18, fontWeight: '700', color: C.text }, mbL: { fontSize: 10, color: C.textTer, marginTop: 4 },
  dr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13 }, drL: { fontSize: F.s14, color: C.text }, drV: { fontSize: F.s14, fontWeight: '600', color: C.text },
});
