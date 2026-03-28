import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';

const CID = '00000000-0000-0000-0000-000000000001';
const IC = {
  chart: require('../../assets/figma/stat_icon_chart.png'),
  like: require('../../assets/figma/stat_icon_like.png'),
};

function n(v: number) { if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.', ',')} K`; if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace('.', ',')} K`; return String(v); }

export default function ContentScreen() {
  const router = useRouter();
  useRealtimeSubscription('videos', ['allVids']);

  const { data: videos } = useQuery({ queryKey: ['allVids'], queryFn: async () => {
    const { data } = await supabase.from('videos').select('*').eq('channel_id', CID).order('sort_order', { ascending: true });
    return data ?? [];
  }});

  const published = (videos || []).filter((v: any) => v.status === 'published' && v.visibility === 'public');

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        <TouchableOpacity style={s.filterIcon}><MaterialIcons name="tune" size={18} color={C.text} /></TouchableOpacity>
        <Chip label="Tipo" /><Chip label="Visibilidad" /><Chip label="Visualizaciones" /><Chip label="Momento" />
      </ScrollView>

      {/* Vídeos */}
      <SecHead title="Vídeos" />
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={published} keyExtractor={(i: any) => i.id}
        contentContainerStyle={s.carousel}
        renderItem={({ item }: any) => (
          <TouchableOpacity style={s.vCard} activeOpacity={0.7} onPress={() => router.push(`/video/${item.id}`)}>
            <View style={s.vThumbWrap}>
              <Image source={{ uri: item.thumbnail_url || 'https://picsum.photos/640/360' }} style={s.vThumb} />
              {item.duration && item.duration !== '0:00' && <View style={s.dur}><Text style={s.durTxt}>{item.duration}</Text></View>}
            </View>
            <View style={s.vBot}><Text style={s.vTitle} numberOfLines={1}>{item.title}</Text><MaterialIcons name="more-vert" size={16} color={C.textTer} /></View>
            <View style={s.vStats}>
              <Image source={IC.chart} style={s.sIcon} resizeMode="contain" /><Text style={s.sTxt}>{n(item.view_count)}</Text>
              <Image source={IC.like} style={s.sIcon} resizeMode="contain" /><Text style={s.sTxt}>{n(item.like_count)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Shorts */}
      <SecHead title="Shorts" />
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={published.slice(0, 4)} keyExtractor={(i: any) => i.id + 's'}
        contentContainerStyle={s.carousel}
        renderItem={({ item }: any) => (
          <TouchableOpacity style={s.shortCard} activeOpacity={0.7}>
            <View style={s.shortWrap}>
              <Image source={{ uri: item.thumbnail_url || 'https://picsum.photos/360/640' }} style={s.shortThumb} />
              <TouchableOpacity style={s.shortDots}><MaterialIcons name="more-vert" size={16} color={C.white} /></TouchableOpacity>
            </View>
            <Text style={s.shortTitle} numberOfLines={1}>{item.title}</Text>
            <View style={s.vStats}>
              <Image source={IC.chart} style={s.sIcon} resizeMode="contain" /><Text style={s.sTxt}>{n(item.view_count)}</Text>
              <Image source={IC.like} style={s.sIcon} resizeMode="contain" /><Text style={s.sTxt}>{n(item.like_count)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* En directo */}
      <SecHead title="En directo" />
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={published.slice(0, 3)} keyExtractor={(i: any) => i.id + 'l'}
        contentContainerStyle={s.carousel}
        renderItem={({ item }: any) => (
          <TouchableOpacity style={s.vCard} activeOpacity={0.7}>
            <View style={s.vThumbWrap}>
              <Image source={{ uri: item.thumbnail_url || 'https://picsum.photos/640/360' }} style={s.vThumb} />
              <View style={s.dur}><Text style={s.durTxt}>1:27:29</Text></View>
            </View>
            <View style={s.vBot}><Text style={s.vTitle} numberOfLines={1}>{item.title}</Text><MaterialIcons name="more-vert" size={16} color={C.textTer} /></View>
            <View style={s.vStats}>
              <Image source={IC.chart} style={s.sIcon} resizeMode="contain" /><Text style={s.sTxt}>{n(item.view_count)}</Text>
              <Image source={IC.like} style={s.sIcon} resizeMode="contain" /><Text style={s.sTxt}>{n(item.like_count)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function SecHead({ title }: { title: string }) {
  return (
    <View style={s.secHead}>
      <Text style={s.secTitle}>{title}</Text>
      <TouchableOpacity style={s.verTodo}><Text style={s.verTodoTxt}>Ver todo</Text></TouchableOpacity>
    </View>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <TouchableOpacity style={s.chip}>
      <Text style={s.chipTxt}>{label}</Text>
      <MaterialIcons name="arrow-drop-down" size={16} color={C.text} />
    </TouchableOpacity>
  );
}

const CW = 220;
const SW = 150;
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  chips: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' },
  filterIcon: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: C.divider, justifyContent: 'center', alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: C.divider, gap: 1 },
  chipTxt: { fontSize: F.s14, fontWeight: '500', color: C.text },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  secTitle: { fontSize: F.s17, fontWeight: '700', color: C.text },
  verTodo: { borderWidth: 1, borderColor: C.divider, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  verTodoTxt: { fontSize: F.s12, fontWeight: '500', color: C.text },
  carousel: { paddingHorizontal: 16, gap: 10 },
  vCard: { width: CW },
  vThumbWrap: { width: CW, height: CW * 9 / 16, borderRadius: 12, overflow: 'hidden', backgroundColor: C.sectionBg },
  vThumb: { width: '100%', height: '100%' },
  dur: { position: 'absolute', bottom: 6, right: 6, backgroundColor: C.overlay, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  durTxt: { color: '#fff', fontSize: 11, fontWeight: '500' },
  vBot: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  vTitle: { flex: 1, fontSize: F.s13, fontWeight: '500', color: C.text },
  vStats: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 3 },
  sIcon: { width: 14, height: 14 },
  sTxt: { fontSize: F.s12, fontWeight: '500', color: C.textSec, marginRight: 6 },
  shortCard: { width: SW },
  shortWrap: { width: SW, height: SW * 16 / 9, borderRadius: 12, overflow: 'hidden', backgroundColor: C.sectionBg, position: 'relative' },
  shortThumb: { width: '100%', height: '100%' },
  shortDots: { position: 'absolute', top: 6, right: 6 },
  shortTitle: { fontSize: F.s13, fontWeight: '500', color: C.text, marginTop: 6 },
});
