import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, RefreshControl, FlatList, Dimensions } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminMode } from '../../hooks/useAdminMode';
import { AE } from '../../components/AdminEditable';
import { C } from '../../constants/theme';

const screenW = Dimensions.get('window').width;

const IC = {
  anunciosPage: require('../../assets/figma/ing_anuncios_page.png'),
  anunciosShorts: require('../../assets/figma/ing_anuncios_shorts.png'),
  chevRight: require('../../assets/figma/ing_chevron_right.png'),
  asistencia: require('../../assets/figma/ing_asistencia.png'),
  copyright: require('../../assets/figma/ing_copyright.png'),
  giving: require('../../assets/figma/ing_giving.png'),
  pantallas: require('../../assets/figma/ing_pantallas.png'),
  miembros: require('../../assets/figma/ing_miembros.png'),
  supers: require('../../assets/figma/ing_supers.png'),
  shopping: require('../../assets/figma/ing_shopping.png'),
};

export default function RevenueScreen() {
  const qc = useQueryClient();
  const isAdmin = useAdminMode();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => { setRefreshing(true); await qc.invalidateQueries(); setRefreshing(false); }, [qc]);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1db4a5" />}>

      {/* Title */}
      <Text style={s.pageTitle}>Ingresos</Text>

      {/* ── Tus formas de ganar dinero ── */}
      <Text style={s.secTitle}>Tus formas de ganar dinero</Text>

      <MenuRow icon={IC.anunciosPage} label="Anuncios de la pagina de visualizacion" iconSize={34} />
      <MenuRow icon={IC.anunciosShorts} label="Anuncios del feed de Shorts" iconSize={33} />

      {/* Button */}
      <TouchableOpacity style={s.moreBtn}>
        <Text style={s.moreBtnText}>Mas formas de obtener ingresos</Text>
      </TouchableOpacity>

      {/* ── Recursos y herramientas ── */}
      <Text style={s.secTitle}>Recursos y herramientas para creadores</Text>

      <MenuRow icon={IC.asistencia} label="Asistencia para Creadores de YouTube" iconSize={22} />
      <MenuRow icon={IC.copyright} label="Copyright Match Tool" iconSize={22} />
      <MenuRow icon={IC.giving} label="Recaudacion de fondos con Giving" iconSize={22} />
      <MenuRow icon={IC.pantallas} label="Pantallas finales de video" iconSize={22} />

      {/* ── Mas formas de obtener ingresos (carrusel) ── */}
      <Text style={[s.secTitle, { marginTop: 30 }]}>Mas formas de obtener ingresos</Text>

      <PromoCarousel />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const PROMO_CARDS = [
  { img: IC.miembros, title: 'Miembros del canal', desc: 'Crea un club de fans que paguen una tarifa mensual para acceder a ventajas exclusivas' },
  { img: IC.supers, title: 'Supers', desc: 'Interactua con los fans que te demuestran su apoyo a traves de compras unicas interactivas' },
  { img: IC.shopping, title: 'Shopping', desc: 'Comparte los productos que te encantan y ayuda a los usuarios a comprar' },
];

function PromoCarousel() {
  const [page, setPage] = useState(0);
  const cardW = (screenW - 48) / 2; // two cards visible at a time

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={cardW + 12}
        decelerationRate="fast"
        data={PROMO_CARDS}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onScroll={(e) => {
          const p = Math.round(e.nativeEvent.contentOffset.x / (cardW + 12));
          if (p !== page) setPage(p);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[s.promoCard, { width: cardW }]}>
            <Image source={item.img} style={s.promoImg} resizeMode="contain" />
            <Text style={s.promoTitle}>{item.title}</Text>
            <Text style={s.promoDesc}>{item.desc}</Text>
          </View>
        )}
      />
      <View style={s.dotsRow}>
        {[0, 1].map(i => <View key={i} style={[s.dot, page === i && s.dotActive]} />)}
      </View>
    </View>
  );
}

function MenuRow({ icon, label, iconSize = 22 }: { icon: any; label: string; iconSize?: number }) {
  return (
    <TouchableOpacity style={s.menuRow}>
      <Image source={icon} style={[s.menuIcon, { width: iconSize, height: iconSize }]} resizeMode="contain" />
      <Text style={s.menuLabel}>{label}</Text>
      <Image source={require('../../assets/figma/ing_chevron_right.png')} style={s.menuChevron} resizeMode="contain" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Page title
  pageTitle: { fontSize: 27, fontWeight: '700', color: '#1a1a1a', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },

  // Section title
  secTitle: { fontSize: 17, fontWeight: '700', color: '#222222', paddingHorizontal: 16, marginBottom: 12 },

  // Menu row
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuIcon: { marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#2d2d2d' },
  menuChevron: { width: 9, height: 14 },

  // More button
  moreBtn: { marginHorizontal: 16, marginTop: 10, marginBottom: 28, borderWidth: 1, borderColor: C.divider, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  moreBtnText: { fontSize: 14, fontWeight: '600', color: '#272727' },

  // Promo cards carousel
  promoCard: { alignItems: 'center', paddingTop: 12 },
  promoImg: { width: 86, height: 88 },
  promoTitle: { fontSize: 14, fontWeight: '600', color: '#292929', marginTop: 10, textAlign: 'center' },
  promoDesc: { fontSize: 12, fontWeight: '400', color: '#737373', marginTop: 4, textAlign: 'center', lineHeight: 17, paddingHorizontal: 4 },

  // Dot indicators
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d5d5d5' },
  dotActive: { backgroundColor: '#333' },
});
