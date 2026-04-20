import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { C, F } from '../constants/theme';
import { useAdminMode } from '../hooks/useAdminMode';
import { AE } from '../components/AdminEditable';

const PERIODS = ['7D', '28 D', '90 D', '365 D', 'Abr', 'Mar', 'Feb'];

const VIDEOS = [
  { thumb: require('../assets/figma/pop_thumb_1.png'), title: 'Tutorial BRIDGE FLORK a DUMP (Paso a...', views: 464, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_2.png'), title: 'CALCULA TU TIER & RELLENA el FORM...', views: 109, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_3.png'), title: 'Bridge de FLORK a DUMP + PROYECTO...', views: 61, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_4.png'), title: 'TODO SOBRE FLORK Y DUMPFUN', views: 45, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_5.png'), title: 'Así fue el lanzamiento de $Awl I Como c...', views: 33, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_6.png'), title: 'FECHA DEL BRIDGE de FLORK a DUMP...', views: 20, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_7.png'), title: '27 de diciembre de 2024', views: 17, isShort: true },
  { thumb: require('../assets/figma/pop_thumb_8.png'), title: 'El cerebro detras de DumpFun... y n...', views: 14, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_9.png'), title: 'ASÍ GANÉ 200.000$ en 30 DIAS TRADE...', views: 14, isShort: false },
  { thumb: require('../assets/figma/pop_thumb_10.png'), title: '¿Que Esta Pasando con $MOG?', views: 13, isShort: false },
];

const MAX_VIEWS = Math.max(...VIDEOS.map(v => v.views));

// Tab bar icons
const TAB_ICONS = {
  panel: require('../assets/figma/tab_panel_inactive.png'),
  contenido: require('../assets/figma/tab_contenido.png'),
  estadisticas: require('../assets/figma/tab_estadisticas_active.png'),
  comunidad: require('../assets/figma/tab_comunidad.png'),
  ingresos: require('../assets/figma/tab_ingresos.png'),
};

export default function PopularContentScreen() {
  const router = useRouter();
  const isAdmin = useAdminMode();
  const [activePeriod, setActivePeriod] = useState(1); // 28 D by default

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={s.backBtn}>
          <Image source={require('../assets/figma/pop_back_arrow.png')} style={s.backArrow} resizeMode="contain" />
        </TouchableOpacity>
        <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="pop_header" label="Título contenido más popular" value="Contenido mas popular">
          <Text style={s.headerTitle}>Contenido mas popular</Text>
        </AE>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Period chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
          {PERIODS.map((p, i) => (
            <React.Fragment key={p}>
              {i === 4 && <View style={s.chipSeparator} />}
              <TouchableOpacity
                style={[s.chip, activePeriod === i && s.chipActive]}
                onPress={() => setActivePeriod(i)}
              >
                <Text style={[s.chipText, activePeriod === i && s.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </ScrollView>

        {/* Date range + label */}
        <View style={s.dateRow}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="pop_date_range" label="Rango de fechas" value="23 mar-19 abr 2026">
            <Text style={s.dateText}>23 mar-19 abr 2026</Text>
          </AE>
          <Text style={s.dateLabel}>Visualizaciones</Text>
        </View>

        {/* Video list */}
        {VIDEOS.map((vid, i) => {
          const barPct = (vid.views / MAX_VIEWS) * 100;
          return (
            <View key={i}>
              <View style={s.videoRow}>
                <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId={`pop_vid_${i}`} label={`Thumbnail popular ${i+1}`} value="" type="image">
                  <Image source={vid.thumb} style={vid.isShort ? s.shortThumb : s.videoThumb} resizeMode="cover" />
                </AE>
                <View style={s.titleViewsWrap}>
                  <View style={s.titleViewsRow}>
                    <AE isAdmin={isAdmin} table="videos" column="title" rowId={`pop_vid_${i}`} label={`Título popular ${i+1}`} value={vid.title}>
                      <Text style={s.videoTitle} numberOfLines={1}>{vid.title}</Text>
                    </AE>
                    <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={`pop_vid_${i}`} label={`Views popular ${i+1}`} value={String(vid.views)}>
                      <Text style={s.videoViews}>{vid.views}</Text>
                    </AE>
                  </View>
                  {/* Progress bar */}
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${barPct}%` }]} />
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Tab bar */}
      <View style={s.tabBar}>
        <TabBarItem icon={TAB_ICONS.panel} label="Panel" onPress={() => { router.back(); setTimeout(() => router.replace('/(tabs)'), 50); }} />
        <TabBarItem icon={TAB_ICONS.contenido} label="Contenido" onPress={() => { router.back(); setTimeout(() => router.replace('/(tabs)/content'), 50); }} />
        <TabBarItem icon={TAB_ICONS.estadisticas} label="Estadísticas" onPress={() => router.back()} />
        <TabBarItem icon={TAB_ICONS.comunidad} label="Comunidad" onPress={() => { router.back(); setTimeout(() => router.replace('/(tabs)/comments'), 50); }} />
        <TabBarItem icon={TAB_ICONS.ingresos} label="Ingresos" onPress={() => { router.back(); setTimeout(() => router.replace('/(tabs)/revenue'), 50); }} />
      </View>
    </View>
  );
}

function TabBarItem({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={s.tabItem} onPress={onPress} activeOpacity={0.7}>
      <Image source={icon} style={[s.tabIcon, { tintColor: C.tabText }]} resizeMode="contain" />
      <Text style={s.tabLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, gap: 12 },
  backBtn: { padding: 4 },
  backArrow: { width: 12, height: 19 },
  headerTitle: { fontSize: 19, fontWeight: '700', color: C.text },

  scroll: { flex: 1 },

  // Period chips
  chipsRow: { paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f1f1f1' },
  chipActive: { backgroundColor: '#0e0e0e' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#252525' },
  chipTextActive: { color: '#efefef' },
  chipSeparator: { width: 1, height: 32, backgroundColor: '#d5d5d5', marginHorizontal: 4, alignSelf: 'center' },

  // Date row
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  dateText: { fontSize: 12, fontWeight: '400', color: '#757575' },
  dateLabel: { fontSize: 12, fontWeight: '400', color: '#707070' },

  // Video row
  videoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  videoThumb: { width: 56, height: 32, borderRadius: 4, backgroundColor: '#f0f0f0' },
  shortThumb: { width: 32, height: 44, borderRadius: 4, backgroundColor: '#f0f0f0' },

  // Title + views + bar wrapper
  titleViewsWrap: { flex: 1 },
  titleViewsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  videoTitle: { flex: 1, fontSize: 14, fontWeight: '400', color: '#2e2e2e' },
  videoViews: { fontSize: 14, fontWeight: '600', color: '#1f1f1f' },

  // Horizontal progress bar below title (exact Figma colors)
  barBg: { height: 5, backgroundColor: '#f2f2f2', borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#00a7d3', borderRadius: 3 },

  // Tab bar
  tabBar: { flexDirection: 'row', backgroundColor: C.white, borderTopColor: '#c8c8c8', borderTopWidth: 0.8, height: 95, paddingBottom: 34, paddingTop: 8, justifyContent: 'space-around', alignItems: 'flex-start' },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabIcon: { width: 20, height: 20 },
  tabLabel: { fontSize: 10, fontWeight: '400', color: C.tabText },
});
