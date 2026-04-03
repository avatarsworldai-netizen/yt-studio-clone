import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { C, F } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAdminMode } from '../../hooks/useAdminMode';
import { AE } from '../../components/AdminEditable';

// Figma icon assets
const ICONS = {
  panel: require('../../assets/figma/tab_panel.png'),
  panelInactive: require('../../assets/figma/tab_panel_inactive.png'),
  contenido: require('../../assets/figma/tab_contenido.png'),
  estadisticas: require('../../assets/figma/tab_estadisticas.png'),
  contenidoActive: require('../../assets/figma/tab_contenido_active.png'),
  estadisticasActive: require('../../assets/figma/tab_estadisticas_active.png'),
  comunidadActive: require('../../assets/figma/tab_comunidad_active.png'),
  ingresosActive: require('../../assets/figma/tab_ingresos_active.png'),
  comunidad: require('../../assets/figma/tab_comunidad.png'),
  ingresos: require('../../assets/figma/tab_ingresos.png'),
  ytLogo: require('../../assets/figma/yt_logo.png'),
  studioText: require('../../assets/figma/studio_text.png'),
  plus: require('../../assets/figma/header_plus.png'),
  bell: require('../../assets/figma/header_bell.png'),
};

function Logo() {
  const isAdmin = useAdminMode();
  return (
    <View style={st.logoWrap}>
      <AE isAdmin={isAdmin} table="ui_header" column="yt_logo" rowId="header" label="Logo YouTube" value="" type="image">
        <Image source={ICONS.ytLogo} style={st.ytLogo} resizeMode="contain" />
      </AE>
      <AE isAdmin={isAdmin} table="ui_header" column="studio_text" rowId="header" label="Texto Studio" value="" type="image">
        <Image source={ICONS.studioText} style={st.studioImg} resizeMode="contain" />
      </AE>
    </View>
  );
}

function RightIcons() {
  const isAdmin = useAdminMode();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.from('channel').select('avatar_url').eq('id', '00000000-0000-0000-0000-000000000001').single()
      .then(({ data }) => { if (data?.avatar_url) setAvatarUrl(data.avatar_url); });
  }, []);

  return (
    <View style={st.right}>
      <TouchableOpacity>
        <AE isAdmin={isAdmin} table="ui_header" column="plus_icon" rowId="header" label="Icono crear (+)" value="" type="image">
          <Image source={ICONS.plus} style={st.headerIcon} resizeMode="contain" />
        </AE>
      </TouchableOpacity>
      <TouchableOpacity>
        <AE isAdmin={isAdmin} table="ui_header" column="bell_icon" rowId="header" label="Icono notificaciones" value="" type="image">
          <Image source={ICONS.bell} style={st.headerIcon} resizeMode="contain" />
        </AE>
      </TouchableOpacity>
      <TouchableOpacity>
        <AE isAdmin={isAdmin} table="channel" column="avatar_url" rowId="00000000-0000-0000-0000-000000000001" label="Avatar del canal" value={avatarUrl || ''} type="image">
          <Image source={{ uri: avatarUrl || 'https://picsum.photos/seed/avatar/200/200' }} style={st.avatar} />
        </AE>
      </TouchableOpacity>
    </View>
  );
}

function TabIcon({ source, color }: { source: any; color: string }) {
  return <Image source={source} style={[st.tabIcon, { tintColor: color }]} resizeMode="contain" />;
}

function RippleTabButton({ children, onPress, ...rest }: any) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    opacityAnim.setValue(0);
    Animated.sequence([
      Animated.timing(opacityAnim, { toValue: 0.6, duration: 60, useNativeDriver: false }),
      Animated.timing(opacityAnim, { toValue: 0.6, duration: 120, useNativeDriver: false }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 120, useNativeDriver: false }),
    ]).start();
    if (onPress) onPress();
  };

  return (
    <Pressable onPress={handlePress} style={[rest.style, { overflow: 'visible' }]}>
      <Animated.View style={{
        position: 'absolute', width: 95, height: 95, borderRadius: 48,
        borderWidth: 1, borderColor: '#d0d0d0',
        backgroundColor: '#f0f0f0', opacity: opacityAnim,
        top: '50%', left: '50%', marginTop: -51, marginLeft: -48,
      }} />
      {children}
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: C.white, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
      headerShadowVisible: false,
      tabBarStyle: { backgroundColor: C.white, borderTopColor: C.divider, borderTopWidth: 0.5, height: 95, paddingBottom: 34, paddingTop: 8, overflow: 'hidden' },
      tabBarActiveTintColor: C.tabText,
      tabBarInactiveTintColor: C.tabText,
      tabBarLabelStyle: { fontSize: F.s10, fontWeight: '400', marginTop: 4 },
      tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
      tabBarButton: (props) => <RippleTabButton {...props} />,
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Panel',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color, focused }) => <TabIcon source={focused ? ICONS.panel : ICONS.panelInactive} color={color} />,
      }} />
      <Tabs.Screen name="content" options={{
        title: 'Contenido',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color, focused }) => focused
          ? <Image source={ICONS.contenidoActive} style={st.tabIconActive} resizeMode="contain" />
          : <TabIcon source={ICONS.contenido} color={color} />,
      }} />
      <Tabs.Screen name="analytics" options={{
        title: 'Estadísticas',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color, focused }) => focused
          ? <Image source={ICONS.estadisticasActive} style={st.tabIconActive} resizeMode="contain" />
          : <TabIcon source={ICONS.estadisticas} color={color} />,

      }} />
      <Tabs.Screen name="comments" options={{
        title: 'Comunidad',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color, focused }) => focused
          ? <Image source={ICONS.comunidadActive} style={st.tabIconActive} resizeMode="contain" />
          : <TabIcon source={ICONS.comunidad} color={color} />,
      }} />
      <Tabs.Screen name="revenue" options={{
        title: 'Ingresos',
        headerTitle: () => <Logo />,
        headerLeft: () => <View style={{ width: 6 }} />,
        headerRight: () => <RightIcons />,
        tabBarIcon: ({ color, focused }) => focused
          ? <Image source={ICONS.ingresosActive} style={st.tabIconActive} resizeMode="contain" />
          : <TabIcon source={ICONS.ingresos} color={color} />,
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
  tabIconActive: { width: 24, height: 24, borderRadius: 5 },
});
