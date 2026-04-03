import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminMode } from '../../hooks/useAdminMode';
import { AE } from '../../components/AdminEditable';
import { C } from '../../constants/theme';

const IC = {
  filter: require('../../assets/figma/filter_icon.png'),
  dropdown: require('../../assets/figma/dropdown_arrow.png'),
  chart: require('../../assets/figma/content_chart.png'),
  like: require('../../assets/figma/content_like.png'),
  dots: require('../../assets/figma/three_dots.png'),
  moneyGreen: require('../../assets/figma/money_green.png'),
  copyrightRed: require('../../assets/figma/copyright_red.png'),
};

// Exact data from Figma design
const VIDEOS = [
  { id: '1', thumb: require('../../assets/figma/vid_thumb_1.png'), title: 'Tutorial BRIDGE FLORK...', views: '1,9K', likes: '91', dur: '17:43', money: true },
  { id: '2', thumb: require('../../assets/figma/vid_thumb_2.png'), title: 'Bridge de FLORK a DUM...', views: '2,2K', likes: '65', dur: '17:13', money: false, copyright: true },
];

const SHORTS = [
  { id: 's1', thumb: require('../../assets/figma/short_thumb_1.png'), title: '27 de diciemb...', views: '4,3K', likes: '392' },
  { id: 's2', thumb: require('../../assets/figma/short_thumb_2.png'), title: 'SCAM The sug...', views: '339', likes: '' },
  { id: 's3', thumb: require('../../assets/figma/short_thumb_3.png'), title: 'Trump maga...', views: '841', likes: '' },
  { id: 's4', thumb: require('../../assets/figma/short_thumb_4.png'), title: '$PENG...', views: '1', likes: '' },
];

const LIVES = [
  { id: 'l1', thumb: require('../../assets/figma/live_thumb_1.png'), title: 'Creando tokens en Dum...', views: '2K', likes: '127', dur: '1:27:29' },
  { id: 'l2', thumb: require('../../assets/figma/live_thumb_2.png'), title: 'SE VIENEN COSITAS!G...', views: '992', likes: '', dur: '1:16:37' },
];

export default function ContentScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const isAdmin = useAdminMode();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => { setRefreshing(true); await qc.invalidateQueries(); setRefreshing(false); }, [qc]);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1db4a5" />}>

      {/* ── Filter chips ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtersRow}>
        <TouchableOpacity style={s.filterBtn}>
          <Image source={IC.filter} style={s.filterIcon} resizeMode="contain" />
        </TouchableOpacity>
        <FilterChip label="Tipo" />
        <FilterChip label="Visibilidad" />
        <FilterChip label="Visualizaciones" />
        <FilterChip label="M" />
      </ScrollView>

      {/* ── Vídeos ── */}
      <SectionHead title="Vídeos" />
      <FlatList
        horizontal showsHorizontalScrollIndicator={false}
        data={VIDEOS} keyExtractor={i => i.id}
        contentContainerStyle={s.carousel}
        renderItem={({ item }) => (
          <View style={s.videoCard}>
            <View style={s.thumbWrap}>
              <Image source={item.thumb} style={s.thumb} resizeMode="cover" />
              <AE isAdmin={isAdmin} table="videos" column="duration" rowId={item.id} label="Duración" value={item.dur}>
                <View style={s.durBadge}><Text style={s.durText}>{item.dur}</Text></View>
              </AE>
            </View>
            <View style={s.titleRow}>
              <AE isAdmin={isAdmin} table="videos" column="title" rowId={item.id} label="Título video" value={item.title}>
                <Text style={s.videoTitle} numberOfLines={1}>{item.title}</Text>
              </AE>
              <TouchableOpacity><Image source={IC.dots} style={s.dotsIcon} resizeMode="contain" /></TouchableOpacity>
            </View>
            <View style={s.statsRow}>
              {item.money && <Image source={IC.moneyGreen} style={s.statusIcon} resizeMode="contain" />}
              {item.copyright && <Image source={IC.copyrightRed} style={s.statusIcon} resizeMode="contain" />}
              <Image source={IC.chart} style={s.statIcon} resizeMode="contain" />
              <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={item.id} label="Visualizaciones" value={item.views}>
                <Text style={s.statText}>{item.views}</Text>
              </AE>
              <Image source={IC.like} style={s.statIcon} resizeMode="contain" />
              <AE isAdmin={isAdmin} table="videos" column="like_count" rowId={item.id} label="Likes" value={item.likes}>
                <Text style={s.statText}>{item.likes}</Text>
              </AE>
            </View>
          </View>
        )}
      />

      {/* ── Shorts ── */}
      <SectionHead title="Shorts" />
      <FlatList
        horizontal showsHorizontalScrollIndicator={false}
        data={SHORTS} keyExtractor={i => i.id}
        contentContainerStyle={s.carousel}
        renderItem={({ item }) => (
          <View style={s.shortCard}>
            <View style={s.shortThumbWrap}>
              <Image source={item.thumb} style={s.shortThumb} resizeMode="cover" />
              <TouchableOpacity style={s.shortDotsBtn}>
                <Image source={IC.dots} style={[s.dotsIcon, { tintColor: '#fff' }]} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <AE isAdmin={isAdmin} table="videos" column="title" rowId={item.id} label="Título short" value={item.title}>
              <Text style={s.shortTitle} numberOfLines={1}>{item.title}</Text>
            </AE>
            <View style={s.statsRow}>
              <Image source={IC.chart} style={s.statIcon} resizeMode="contain" />
              <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={item.id} label="Visualizaciones" value={item.views}>
                <Text style={s.statText}>{item.views}</Text>
              </AE>
              {item.likes ? <>
                <Image source={IC.like} style={s.statIcon} resizeMode="contain" />
                <AE isAdmin={isAdmin} table="videos" column="like_count" rowId={item.id} label="Likes" value={item.likes}>
                  <Text style={s.statText}>{item.likes}</Text>
                </AE>
              </> : null}
            </View>
          </View>
        )}
      />

      {/* ── En directo ── */}
      <SectionHead title="En directo" />
      <FlatList
        horizontal showsHorizontalScrollIndicator={false}
        data={LIVES} keyExtractor={i => i.id}
        contentContainerStyle={s.carousel}
        renderItem={({ item }) => (
          <View style={s.videoCard}>
            <View style={s.thumbWrap}>
              <Image source={item.thumb} style={s.thumb} resizeMode="cover" />
              <AE isAdmin={isAdmin} table="videos" column="duration" rowId={item.id} label="Duración" value={item.dur}>
                <View style={s.durBadge}><Text style={s.durText}>{item.dur}</Text></View>
              </AE>
            </View>
            <View style={s.titleRow}>
              <AE isAdmin={isAdmin} table="videos" column="title" rowId={item.id} label="Título directo" value={item.title}>
                <Text style={s.videoTitle} numberOfLines={1}>{item.title}</Text>
              </AE>
              <TouchableOpacity><Image source={IC.dots} style={s.dotsIcon} resizeMode="contain" /></TouchableOpacity>
            </View>
            <View style={s.statsRow}>
              <Image source={IC.chart} style={s.statIcon} resizeMode="contain" />
              <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={item.id} label="Visualizaciones" value={item.views}>
                <Text style={s.statText}>{item.views}</Text>
              </AE>
              {item.likes ? <>
                <Image source={IC.like} style={s.statIcon} resizeMode="contain" />
                <AE isAdmin={isAdmin} table="videos" column="like_count" rowId={item.id} label="Likes" value={item.likes}>
                  <Text style={s.statText}>{item.likes}</Text>
                </AE>
              </> : null}
            </View>
          </View>
        )}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <TouchableOpacity style={s.chip}>
      <Text style={s.chipText}>{label}</Text>
      <Image source={require('../../assets/figma/dropdown_arrow.png')} style={s.dropdownIcon} resizeMode="contain" />
    </TouchableOpacity>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <View style={s.secHead}>
      <Text style={s.secTitle}>{title}</Text>
      <TouchableOpacity style={s.verTodo}><Text style={s.verTodoText}>Ver todo</Text></TouchableOpacity>
    </View>
  );
}

const CARD_W = 192;
const SHORT_W = 112;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Filters
  filtersRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterBtn: { width: 40, height: 32, borderRadius: 8, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' },
  filterIcon: { width: 20, height: 20 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f2f2f2', gap: 4 },
  chipText: { fontSize: 14, fontWeight: '600', color: '#252525' },
  dropdownIcon: { width: 10, height: 6 },

  // Section header
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 },
  secTitle: { fontSize: 17, fontWeight: '700', color: '#1f1f1f' },
  verTodo: { borderWidth: 1, borderColor: C.divider, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  verTodoText: { fontSize: 12, fontWeight: '600', color: '#2c2c2c' },

  // Carousel
  carousel: { paddingHorizontal: 12, gap: 10 },

  // Video card
  videoCard: { width: CARD_W },
  thumbWrap: { width: CARD_W, height: CARD_W * 9 / 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f0f0f0' },
  thumb: { width: '100%', height: '100%' },
  durBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  durText: { color: '#e6e2dd', fontSize: 12, fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  videoTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#252525' },
  dotsIcon: { width: 4, height: 12, marginLeft: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 3 },
  statIcon: { width: 15, height: 15 },
  statusIcon: { width: 17, height: 17, marginRight: 4 },
  statText: { fontSize: 12, fontWeight: '400', color: '#717171', marginRight: 6 },

  // Short card
  shortCard: { width: SHORT_W },
  shortThumbWrap: { width: SHORT_W, height: SHORT_W * 16 / 9, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f0f0f0', position: 'relative' },
  shortThumb: { width: '100%', height: '100%' },
  shortDotsBtn: { position: 'absolute', top: 6, right: 6 },
  shortTitle: { fontSize: 13, fontWeight: '600', color: '#282828', marginTop: 6 },
});
