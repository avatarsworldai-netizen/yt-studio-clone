import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAdminMode } from '../hooks/useAdminMode';
import { AE } from './AdminEditable';
import { useChannel } from '../contexts/ChannelContext';

const IC = {
  backArrow: require('../assets/figma/cc_back_arrow.png'),
  editPencil: require('../assets/figma/cc_edit_pencil.png'),
  switchAccount: require('../assets/figma/cc_switch_account.png'),
  google: require('../assets/figma/cc_google.png'),
  gear: require('../assets/figma/cc_gear.png'),
  feedback: require('../assets/figma/cc_feedback.png'),
  help: require('../assets/figma/cc_help.png'),
  youtube: require('../assets/figma/cc_youtube.png'),
  chevronRight: require('../assets/figma/cc_chevron_right.png'),
  externalLink: require('../assets/figma/cc_external_link.png'),
};

const MENU_ITEMS = [
  { icon: IC.gear, label: 'Configuración', rightIcon: 'chevron', rowId: 'cc_config' },
  { icon: IC.feedback, label: 'Enviar comentarios', rightIcon: 'chevron', rowId: 'cc_feedback' },
  { icon: IC.help, label: 'Centro de Ayuda', rightIcon: 'chevron', rowId: 'cc_help' },
  { icon: IC.youtube, label: 'YouTube', rightIcon: 'external', rowId: 'cc_youtube' },
];

type Props = {
  onClose: () => void;
  onOpenCambiarCuenta2?: () => void;
};

export default function CambiarCuenta({ onClose, onOpenCambiarCuenta2 }: Props) {
  const isAdmin = useAdminMode();
  const { activeChannelId: CID } = useChannel();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [channelName, setChannelName] = useState('');
  const [handle, setHandle] = useState('');

  useEffect(() => {
    supabase.from('channel').select('avatar_url, name, handle').eq('id', CID).single()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        if (data?.name) setChannelName(data.name);
        if (data?.handle) setHandle(data.handle);
      });
  }, [CID]);

  return (
    <View style={s.container}>
      {/* Header - back arrow */}
      <View style={s.header}>
        <TouchableOpacity onPress={onClose} hitSlop={16}>
          <Image source={IC.backArrow} style={s.backArrow} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile section */}
        <View style={s.profileSection}>
          <View style={s.profileRow}>
            <AE isAdmin={isAdmin} table="channel" column="avatar_url" rowId={CID} direct label="Avatar del canal" value={avatarUrl || ''} type="image">
              <Image source={{ uri: avatarUrl || 'https://picsum.photos/seed/avatar/200/200' }} style={s.profileAvatar} />
            </AE>
            <View style={s.profileInfo}>
              <AE isAdmin={isAdmin} table="channel" column="name" rowId={CID} direct label="Nombre del canal" value={channelName}>
                <Text style={s.channelName}>{channelName}</Text>
              </AE>
              <AE isAdmin={isAdmin} table="channel" column="handle" rowId={CID} direct label="Handle del canal" value={handle}>
                <Text style={s.handle}>{handle}</Text>
              </AE>
            </View>
            <TouchableOpacity style={s.editBtn}>
              <AE isAdmin={isAdmin} table="ui_account" column="icon" rowId="cc_edit" label="Icono editar perfil" value="" type="image">
                <Image source={IC.editPencil} style={s.editIcon} resizeMode="contain" />
              </AE>
            </TouchableOpacity>
          </View>

          {/* Action buttons - below profile row */}
          <View style={s.buttonsRow}>
            <TouchableOpacity style={s.pillButton} onPress={onOpenCambiarCuenta2}>
              <Image source={IC.switchAccount} style={s.pillIcon} resizeMode="contain" />
              <Text style={s.pillText}>Cambiar de cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.pillButton}>
              <Image source={IC.google} style={s.pillIcon} resizeMode="contain" />
              <Text style={s.pillText}>Cuenta de Google</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={s.divider} />

        {/* Menu items */}
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity key={i} style={s.menuRow}>
            <Image source={item.icon} style={s.menuIcon} resizeMode="contain" />
            <AE isAdmin={isAdmin} table="ui_account" column="label" rowId={item.rowId} label={item.label} value={item.label}>
              <Text style={s.menuLabel}>{item.label}</Text>
            </AE>
            <View style={{ flex: 1 }} />
            <Image
              source={item.rightIcon === 'chevron' ? IC.chevronRight : IC.externalLink}
              style={item.rightIcon === 'chevron' ? s.chevronIcon : s.externalIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}

        {/* Footer - pushed to bottom */}
        <View style={s.footerSpacer} />
        <View style={s.footer}>
          <AE isAdmin={isAdmin} table="ui_account" column="label" rowId="cc_privacy" label="Política de privacidad" value="Política de Privacidad">
            <Text style={s.footerLink}>Política de Privacidad</Text>
          </AE>
          <Text style={s.footerDot}>·</Text>
          <AE isAdmin={isAdmin} table="ui_account" column="label" rowId="cc_terms" label="Términos del servicio" value="Términos del Servicio">
            <Text style={s.footerLink}>Términos del Servicio</Text>
          </AE>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  backArrow: {
    width: 12,
    height: 19,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    flexGrow: 1,
  },
  profileSection: {
    marginTop: 16,
    marginBottom: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#eee',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  channelName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181818',
    lineHeight: 25,
  },
  handle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#323232',
    marginTop: 3,
  },
  editBtn: {
    padding: 8,
  },
  editIcon: {
    width: 22,
    height: 22,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F2F2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  pillIcon: {
    width: 15,
    height: 15,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#303030',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 6,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  menuIcon: {
    width: 22,
    height: 22,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  chevronIcon: {
    width: 9,
    height: 14,
  },
  externalIcon: {
    width: 16,
    height: 16,
  },
  footerSpacer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 20,
    gap: 8,
  },
  footerLink: {
    fontSize: 11,
    fontWeight: '400',
    color: '#747474',
  },
  footerDot: {
    fontSize: 11,
    color: '#747474',
  },
});
