import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';
import { C, F } from '../constants/theme';

const CID = '00000000-0000-0000-0000-000000000001';
function n(v: number) { if (v >= 1e6) return `${(v / 1e6).toFixed(1)} M`; if (v >= 1e3) return `${(v / 1e3).toFixed(1)} K`; return v.toLocaleString('es-ES'); }

export default function ProfileScreen() {
  useRealtimeSubscription('channel', ['cp2']);
  const { data: ch } = useQuery({ queryKey: ['cp2'], queryFn: async () => { const { data } = await supabase.from('channel').select('*').eq('id', CID).single(); return data } });
  if (!ch) return <View style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: C.textTer }}>Cargando...</Text></View>;

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: ch.banner_url || 'https://picsum.photos/1280/320' }} style={s.banner} />
      <View style={s.profile}>
        <Image source={{ uri: ch.avatar_url || 'https://picsum.photos/200/200' }} style={s.ava} />
        <View style={s.nameRow}><Text style={s.name}>{ch.name}</Text>{ch.is_verified && <MaterialIcons name="verified" size={18} color={C.textSec} />}</View>
        <Text style={s.handle}>{ch.handle}</Text>
        <Text style={s.stats}>{n(ch.subscriber_count)} suscriptores · {ch.video_count} vídeos</Text>
      </View>
      {ch.description && <View style={s.card}><Text style={s.secT}>Acerca de</Text><Text style={s.desc}>{ch.description}</Text></View>}
      <View style={s.card}><Text style={s.secT}>Estadísticas del canal</Text>
        <SR l="Visualizaciones totales" v={n(ch.total_views)} /><SR l="Tiempo total" v={`${n(ch.total_watch_time_hours)} h`} /><SR l="Suscriptores" v={n(ch.subscriber_count)} /><SR l="Vídeos" v={String(ch.video_count)} /><SR l="País" v={ch.country} /><SR l="Fecha de creación" v={new Date(ch.joined_date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} last />
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
function SR({ l, v, last }: { l: string; v: string; last?: boolean }) { return <View style={[s.sr, !last && { borderBottomWidth: 0.5, borderBottomColor: C.divider }]}><Text style={s.srL}>{l}</Text><Text style={s.srV}>{v}</Text></View> }

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg }, banner: { width: '100%', height: 120, backgroundColor: C.sectionBg },
  profile: { alignItems: 'center', paddingVertical: 20 }, ava: { width: 80, height: 80, borderRadius: 40, marginTop: -40, borderWidth: 3, borderColor: C.white, backgroundColor: C.sectionBg },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }, name: { fontSize: F.s23, fontWeight: '700', color: C.text },
  handle: { fontSize: F.s14, color: C.textSec, marginTop: 2 }, stats: { fontSize: F.s12, color: C.textTer, marginTop: 4 },
  card: { backgroundColor: C.cardBg, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, marginHorizontal: 16, marginBottom: 12, padding: 16 },
  secT: { fontSize: F.s17, fontWeight: '700', color: C.text, marginBottom: 12 }, desc: { fontSize: F.s14, color: C.textSec, lineHeight: 22 },
  sr: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 }, srL: { fontSize: F.s14, color: C.textSec }, srV: { fontSize: F.s14, fontWeight: '500', color: C.text },
});
