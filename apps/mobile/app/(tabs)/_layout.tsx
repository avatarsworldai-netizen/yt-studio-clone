import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { C, F } from '../../constants/theme';

// Figma icon assets
const ICONS = {
  panel: require('../../assets/figma/tab_panel.png'),
  contenido: require('../../assets/figma/tab_contenido.png'),
  estadisticas: require('../../assets/figma/tab_estadisticas.png'),
  comunidad: require('../../assets/figma/tab_comunidad.png'),
  ingresos: require('../../assets/figma/tab_ingresos.png'),
  ytLogo: require('../../assets/figma/yt_logo.png'),
  studioText: require('../../assets/figma/studio_text.png'),
  plus: require('../../assets/figma/header_plus.png'),
  bell: require('../../assets/figma/header_bell.png'),
};

function Logo() {
  return (
    <View style={st.logoWrap}>
      <Image source={ICONS.ytLogo} style={st.ytLogo} resizeMode="contain" />
      <Image source={ICONS.studioText} style={st.studioImg} resizeMode="contain" />
    </View>
  );
}

function RightIcons() {
  return (
    <View style={st.right}>
      <TouchableOpacity><Image source={ICONS.plus} style={st.headerIcon} resizeMode="contain" /></TouchableOpacity>
      <TouchableOpacity><Image source={ICONS.bell} style={st.headerIcon} resizeMode="contain" /></TouchableOpacity>
      <TouchableOpacity>
        <Image source={{ uri: 'https://picsum.photos/seed/avatar/200/200' }} style={st.avatar} />
      </TouchableOpacity>
    </View>
  );
}

function TabIcon({ source, color }: { source: any; color: string }) {
  return <Image source={source} style={[st.tabIcon, { tintColor: color }]} resizeMode="contain" />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: C.white, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
      headerShadowVisible: false,
      tabBarStyle: { backgroundColor: C.white, borderTopColor: C.divider, borderTopWidth: 0.5, height: 95, paddingBottom: 34, paddingTop: 8 },
      tabBarActiveTintColor: C.tabText,
      tabBarInactiveTintColor: C.tabText,
      tabBarLabelStyle: { fontSize: F.s10, fontWeight: '400', marginTop: 4 },
      tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Panel',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color }) => <TabIcon source={ICONS.panel} color={color} />,
      }} />
      <Tabs.Screen name="content" options={{
        title: 'Contenido',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color }) => <TabIcon source={ICONS.contenido} color={color} />,
      }} />
      <Tabs.Screen name="analytics" options={{
        title: 'Estadísticas',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color }) => <TabIcon source={ICONS.estadisticas} color={color} />,
      }} />
      <Tabs.Screen name="comments" options={{
        title: 'Comunidad',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color }) => <TabIcon source={ICONS.comunidad} color={color} />,
      }} />
      <Tabs.Screen name="revenue" options={{
        title: 'Ingresos',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color }) => <TabIcon source={ICONS.ingresos} color={color} />,
      }} />
    </Tabs>
  );
}

const st = StyleSheet.create({
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ytLogo: { width: 29, height: 20 },
  studioImg: { width: 50, height: 22, marginLeft: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingRight: 14 },
  headerIcon: { width: 22, height: 22 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.sectionBg },
  tabIcon: { width: 20, height: 20 },
});
