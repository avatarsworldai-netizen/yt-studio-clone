import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAdminMode } from '../hooks/useAdminMode';
import { AE } from './AdminEditable';

const IC = {
  close: require('../assets/figma/cc2_close.png'),
  checkmark: require('../assets/figma/cc2_checkmark.png'),
  addAccount: require('../assets/figma/cc2_add_account.png'),
  manage: require('../assets/figma/cc2_manage.png'),
};

const CHANNELS = [
  { name: 'Joel Pedroche', handle: '@joelpedroche6206', subs: '1 suscriptor', avatar: require('../assets/figma/cc2_avatar_joel.png'), selected: false, rowId: 'cc2_ch_0' },
  { name: 'CEOCRYPTO | MEME COINS', handle: '@ceocryptomemecoins', subs: '67.400 suscriptores', avatar: require('../assets/figma/cc2_avatar_ceocrypto_meme.png'), selected: true, rowId: 'cc2_ch_1' },
  { name: 'Wild Crypto', handle: '@WildCrypto', subs: '1210 suscriptores', avatar: require('../assets/figma/cc2_avatar_wild.png'), selected: false, rowId: 'cc2_ch_2' },
  { name: 'PEAKY WORLD', handle: '@peakyworld', subs: '3220 suscriptores', avatar: require('../assets/figma/cc2_avatar_peaky.png'), selected: false, rowId: 'cc2_ch_3' },
  { name: 'THENI - Axie Infinity en Español', handle: '@theni-axieinfinityenespano4320', subs: '20 suscriptores', avatar: require('../assets/figma/cc2_avatar_theni.png'), selected: false, rowId: 'cc2_ch_4' },
  { name: 'Bitmoon by Blackmoon', handle: '@BitmoonbyBlackmoon-rj3hb', subs: 'Sin suscriptores', avatar: null, letterAvatar: 'B', rowId: 'cc2_ch_5' },
  { name: 'CEOCRYPTO', handle: '@ceocryptoio', subs: '157.000 suscriptores', avatar: require('../assets/figma/cc2_avatar_ceocrypto.png'), selected: false, rowId: 'cc2_ch_6' },
];

type Props = {
  onClose: () => void;
};

export default function CambiarCuenta2({ onClose }: Props) {
  const isAdmin = useAdminMode();

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={onClose} hitSlop={16} style={s.closeIconWrap}>
          <Image source={IC.close} style={s.closeIcon} resizeMode="contain" />
        </TouchableOpacity>
        <AE isAdmin={isAdmin} table="ui_account" column="title" rowId="cc2_title" label="Título Cuentas" value="Cuentas">
          <Text style={s.headerTitle}>Cuentas</Text>
        </AE>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Current account info */}
        <View style={s.accountInfo}>
          <AE isAdmin={isAdmin} table="ui_account" column="label" rowId="cc2_user_name" label="Nombre usuario" value="Joel Pedroche">
            <Text style={s.accountName}>Joel Pedroche</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_account" column="label" rowId="cc2_user_email" label="Email usuario" value="TheNiPuTaYdEa@gmail.com">
            <Text style={s.accountEmail}>TheNiPuTaYdEa@gmail.com</Text>
          </AE>
        </View>

        <View style={s.dividerThin} />

        {/* Channel list */}
        {CHANNELS.map((ch, i) => (
          <TouchableOpacity key={i} style={s.channelRow}>
            {ch.avatar ? (
              <AE isAdmin={isAdmin} table="ui_account" column="avatar" rowId={ch.rowId} label={`Avatar ${ch.name}`} value="" type="image">
                <Image source={ch.avatar} style={s.channelAvatar} resizeMode="cover" />
              </AE>
            ) : (
              <View style={s.letterAvatar}>
                <Text style={s.letterAvatarText}>{ch.letterAvatar}</Text>
              </View>
            )}
            <View style={s.channelInfo}>
              <AE isAdmin={isAdmin} table="ui_account" column="name" rowId={ch.rowId} label={`Nombre canal ${i+1}`} value={ch.name}>
                <Text style={s.channelName} numberOfLines={1}>{ch.name}</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_account" column="handle" rowId={ch.rowId} label={`Handle canal ${i+1}`} value={ch.handle}>
                <Text style={s.channelMeta} numberOfLines={1}>{ch.handle}</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_account" column="subs" rowId={ch.rowId} label={`Suscriptores canal ${i+1}`} value={ch.subs}>
                <Text style={s.channelMeta}>{ch.subs}</Text>
              </AE>
            </View>
            {ch.selected && (
              <Image source={IC.checkmark} style={s.checkmark} resizeMode="contain" />
            )}
          </TouchableOpacity>
        ))}

        {/* Thick divider / shadow separator */}
        <View style={s.shadowSeparator} />

        {/* Otras cuentas */}
        <View style={s.otrasSection}>
          <AE isAdmin={isAdmin} table="ui_account" column="title" rowId="cc2_otras" label="Título otras cuentas" value="Otras cuentas">
            <Text style={s.otrasTitle}>Otras cuentas</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_account" column="label" rowId="cc2_otras_email" label="Email otra cuenta" value="ceocryptomemecoin@gmail.com">
            <Text style={s.otrasEmail}>ceocryptomemecoin@gmail.com</Text>
          </AE>
        </View>

        {/* Second account channel (CEOCRYPTO under Otras cuentas) */}
        <TouchableOpacity style={s.channelRow}>
          <AE isAdmin={isAdmin} table="ui_account" column="avatar" rowId="cc2_otras_ch" label="Avatar otra cuenta" value="" type="image">
            <Image source={require('../assets/figma/cc2_avatar_ceocrypto.png')} style={s.channelAvatar} resizeMode="cover" />
          </AE>
          <View style={s.channelInfo}>
            <AE isAdmin={isAdmin} table="ui_account" column="name" rowId="cc2_otras_ch" label="Nombre canal otra cuenta" value="CEOCRYPTO">
              <Text style={s.channelName}>CEOCRYPTO</Text>
            </AE>
            <AE isAdmin={isAdmin} table="ui_account" column="handle" rowId="cc2_otras_ch_handle" label="Handle otra cuenta" value="@ceocryptoio">
              <Text style={s.channelMeta}>@ceocryptoio</Text>
            </AE>
            <AE isAdmin={isAdmin} table="ui_account" column="subs" rowId="cc2_otras_ch_subs" label="Subs otra cuenta" value="157.000 suscriptores">
              <Text style={s.channelMeta}>157.000 suscriptores</Text>
            </AE>
          </View>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Fixed bottom actions */}
      <View style={s.fixedBottom}>
        <TouchableOpacity style={s.actionRow}>
          <Image source={IC.addAccount} style={s.actionIcon} resizeMode="contain" />
          <AE isAdmin={isAdmin} table="ui_account" column="label" rowId="cc2_add" label="Añadir cuenta" value="Añadir cuenta">
            <Text style={s.actionText}>Añadir cuenta</Text>
          </AE>
        </TouchableOpacity>

        <TouchableOpacity style={s.actionRow}>
          <Image source={IC.manage} style={s.actionIcon} resizeMode="contain" />
          <AE isAdmin={isAdmin} table="ui_account" column="label" rowId="cc2_manage" label="Gestionar cuentas" value="Gestionar las cuentas de este dispositivo">
            <Text style={s.actionText}>Gestionar las cuentas de este dispositivo</Text>
          </AE>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 14,
    zIndex: 10,
    // @ts-ignore
    boxShadow: '0px 3px 6px rgba(0,0,0,0.08)',
  },
  closeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  closeIcon: {
    width: 42,
    height: 42,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  scroll: {
    flex: 1,
  },
  accountInfo: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#252525',
  },
  accountEmail: {
    fontSize: 12,
    fontWeight: '400',
    color: '#747474',
    marginTop: 3,
  },
  dividerThin: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginHorizontal: 18,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  channelAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  letterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5C69BE',
    borderWidth: 1.5,
    borderColor: '#848BC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E3E6F6',
  },
  channelInfo: {
    flex: 1,
    marginLeft: 14,
  },
  channelName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2B2B2B',
  },
  channelMeta: {
    fontSize: 13,
    fontWeight: '400',
    color: '#737373',
    marginTop: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  shadowSeparator: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
    marginTop: 8,
  },
  otrasSection: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 6,
  },
  otrasTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  otrasEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6F6F6F',
    marginTop: 6,
  },
  fixedBottom: {
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 44,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 18,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#282828',
  },
});
