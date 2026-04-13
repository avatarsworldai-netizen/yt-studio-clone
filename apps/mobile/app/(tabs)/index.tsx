import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { useAdminMode, sendEditMessage } from '../../hooks/useAdminMode';
import { AE } from '../../components/AdminEditable';
import { getActiveChannelForOverrides } from '../../hooks/useFieldOverrides';
import { C, F } from '../../constants/theme';
import { useChannel } from '../../contexts/ChannelContext';
import { getOverride } from '../../hooks/useFieldOverrides';

// Figma icon assets
const IC = {
  arrowDown: require('../../assets/figma/arrow_down.png'),
  chart: require('../../assets/figma/stat_icon_chart.png'),
  like: require('../../assets/figma/stat_icon_like.png'),
  comment: require('../../assets/figma/stat_icon_comment.png'),
  money: require('../../assets/figma/stat_icon_money.png'),
  chevDown: require('../../assets/figma/chevron_down_desp.png'),
  chevUp: require('../../assets/figma/chevron_up_desp.png'),
  // Desplegable icons
  greenUp: require('../../assets/figma/arrow_green_up.png'),
  blueDown: require('../../assets/figma/arrow_blue_down.png'),
  checkGreen: require('../../assets/figma/check_green.png'),
  infoCircle: require('../../assets/figma/info_circle.png'),
  chevRight: require('../../assets/figma/chevron_right.png'),
  moneyCircle: require('../../assets/figma/money_circle.png'),
};

function n(v: any) {
  return String(v ?? '');
}

function since(d: string | null) {
  if (!d) return '';
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 36e5);
  const dy = Math.floor(h / 24);
  if (dy === 0) return `Primeras ${h} horas`;
  return `Primeros ${dy} días y ${h % 24} horas`;
}

export default function Dashboard() {
  const r = useRouter();
  const qc = useQueryClient();
  const isAdmin = useAdminMode();
  const { activeChannelId: CID } = useChannel();
  const [exp, setExp] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await qc.invalidateQueries();
    setRefreshing(false);
  }, [qc]);

  useRealtimeSubscription('dashboard_stats', ['ds']);
  useRealtimeSubscription('channel', ['ch']);
  useRealtimeSubscription('videos', ['lv']);

  const { data: ch } = useQuery({ queryKey: ['ch', CID], queryFn: async () => { const { data } = await supabase.from('channel').select('*').eq('id', CID).single(); return data } });
  const { data: st } = useQuery({ queryKey: ['ds', CID], queryFn: async () => { const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CID).eq('period', 'last_28_days').single(); return data } });
  const { data: vids } = useQuery({ queryKey: ['lv', CID], queryFn: async () => { const { data } = await supabase.from('videos').select('*').eq('channel_id', CID).eq('status', 'published').eq('visibility', 'public').order('published_at', { ascending: false }).limit(3); return data ?? [] } });

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1db4a5" />}>
      {/* ── Channel row ── */}
      <TouchableOpacity style={s.chRow} activeOpacity={0.7} onPress={() => !isAdmin && r.push('/profile')}>
        <AE isAdmin={isAdmin} table="channel" column="avatar_url" rowId={CID} direct label="Avatar del canal" value={ch?.avatar_url || ''} type="image">
          <Image source={{ uri: ch?.avatar_url || undefined }} style={s.chAva} />
        </AE>
        <View style={s.chMeta}>
          <AE isAdmin={isAdmin} table="channel" column="name" rowId={CID} direct label="Nombre del canal" value={ch?.name || ''}>
            <Text style={s.chName} numberOfLines={1}>{ch?.name || ''}</Text>
          </AE>
          <AE isAdmin={isAdmin} table="channel" column="subscriber_count" rowId={CID} direct label="Suscriptores" value={ch?.subscriber_count || 0} type="number">
            <Text style={s.chSubs}>{n(ch?.subscriber_count || 0)}</Text>
          </AE>
          <Text style={s.chLabel}>Suscriptores totales</Text>
        </View>
      </TouchableOpacity>

      {/* ── Estadísticas del canal ── */}
      <View style={s.sec}>
        <View style={s.secHead}>
          <Text style={s.secTitle}>Estadísticas del canal</Text>
          <Text style={s.secRight}>Últimos 28 días</Text>
        </View>
        <View style={s.grid}>
          <AE isAdmin={isAdmin} table="dashboard_stats" direct column="views" rowId={st?.id || ''} label="Visualizaciones" value={st?.views || 0} type="number">
            <MCard label="Visualizaciones" value={n(st?.views || 0)} down={Number(st?.views_change_percent || 0) < 0} arrowId="arrow_views" isAdmin={isAdmin} />
          </AE>
          <AE isAdmin={isAdmin} table="dashboard_stats" direct column="watch_time_hours" rowId={st?.id || ''} label="Tiempo de visualización" value={st?.watch_time_hours || 0} type="number">
            <MCard label="Tiempo de visualización (ho..." value={n(st?.watch_time_hours || 0)} down={Number(st?.watch_time_change_percent || 0) < 0} arrowId="arrow_watch" isAdmin={isAdmin} />
          </AE>
          <AE isAdmin={isAdmin} table="dashboard_stats" direct column="subscribers_net" rowId={st?.id || ''} label="Suscriptores neto" value={st?.subscribers_net || 0} type="number">
            <MCard label="Suscriptores" value={n(st?.subscribers_net || 0)} down={Number(st?.subscribers_net || 0) < 0} arrowId="arrow_subs" isAdmin={isAdmin} />
          </AE>
          <AE isAdmin={isAdmin} table="dashboard_stats" direct column="estimated_revenue" rowId={st?.id || ''} label="Ingresos estimados" value={st?.estimated_revenue || 0} type="number">
            <MCard label="Ingresos estimados" value={`${st?.estimated_revenue || 0}€`} down={Number(st?.revenue_change_percent || 0) < 0} arrowId="arrow_revenue" isAdmin={isAdmin} />
          </AE>
        </View>
      </View>

      {/* ── Último contenido publicado ── */}
      <View style={s.sec}>
        <Text style={s.secTitle}>Último contenido publicado</Text>
        {(vids || []).map((v: any) => {
          const open = exp === v.id;
          return (
            <View key={v.id} style={s.vCard}>
              {/* Thumbnail + title */}
              <TouchableOpacity style={s.vTop} activeOpacity={0.7} onPress={() => !isAdmin && r.push(`/video/${v.id}`)}>
                <AE isAdmin={isAdmin} table="videos" direct column="thumbnail_url" rowId={v.id} label="Thumbnail" value={v.thumbnail_url || ''} type="image">
                  <Image source={{ uri: v.thumbnail_url || undefined }} style={s.vThumb} />
                </AE>
                <View style={s.vInfo}>
                  <AE isAdmin={isAdmin} table="videos" direct column="title" rowId={v.id} label="Título del video" value={v.title}>
                    <Text style={s.vTitle} numberOfLines={2}>{v.title}</Text>
                  </AE>
                  <Text style={s.vDate}>{since(v.published_at)}</Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View style={s.vDiv} />

              {/* Quick stats — exact Figma gaps: money-18-chart-6-views-25-like-6-likes-25-comment-5-text */}
              <View style={s.vQuick}>
                {v.estimated_revenue > 0 && <Image source={IC.money} style={s.qIcon} resizeMode="contain" />}
                <Image source={IC.chart} style={s.qIconSm} resizeMode="contain" />
                <AE isAdmin={isAdmin} table="videos" direct column="view_count" rowId={v.id} label="Visualizaciones" value={v.view_count}>
                  <Text style={s.qText}>{n(v.view_count)}</Text>
                </AE>
                <Image source={IC.like} style={s.qIconSm} resizeMode="contain" />
                <AE isAdmin={isAdmin} table="videos" direct column="like_count" rowId={v.id} label="Likes" value={v.like_count}>
                  <Text style={[s.qText, { marginRight: 25 }]}>{n(v.like_count)}</Text>
                </AE>
                <Image source={IC.comment} style={[s.qIconSm, { marginRight: 5 }]} resizeMode="contain" />
                <AE isAdmin={isAdmin} table="videos" direct column="comment_count" rowId={v.id} label="Comentarios" value={v.comment_count}>
                  <Text style={[s.qText, { marginRight: 0 }]}>{v.comment_count}</Text>
                </AE>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => setExp(open ? null : v.id)} hitSlop={12}>
                  <Image source={IC.chevUp} style={[s.chevron, !open && { transform: [{ rotate: '180deg' }] }]} resizeMode="contain" />
                </TouchableOpacity>
              </View>

              {/* Expanded — exact Figma desplegable design */}
              {open && (
                <View style={s.vExp}>
                  <View style={s.eRow}>
                    <Text style={s.eLabel}>Clasificacion por visualizaciones</Text>
                    <Text style={s.eVal}>2 de 10</Text>
                    <Image source={IC.chevRight} style={s.chevRightIcon} resizeMode="contain" />
                  </View>
                  <View style={s.eRow}>
                    <Text style={s.eLabel}>Visualizaciones</Text>
                    <Text style={s.eVal}>{n(v.view_count)}</Text>
                    <EditableArrow id={`desp_views_${v.id}`} label="Flecha Visualizaciones desp." defaultDown={false} isAdmin={isAdmin} style={s.eCircleIcon} />
                  </View>
                  <View style={s.eRow}>
                    <View style={s.eLabelWrap}>
                      <Text style={s.eLabel}>Porcentaje de clics de las impresiones</Text>
                      <Image source={IC.infoCircle} style={s.eInfoIcon} resizeMode="contain" />
                    </View>
                    <Text style={s.eVal}>{v.impression_ctr}%</Text>
                    <EditableArrow id={`desp_ctr_${v.id}`} label="Flecha CTR desp." defaultDown={Number(v.impression_ctr) < 10} isAdmin={isAdmin} style={s.eCircleIcon} />
                  </View>
                  <View style={s.eRow}>
                    <Text style={s.eLabel}>Duracion media de las visualizaciones</Text>
                    <Text style={s.eVal}>{v.average_view_duration}</Text>
                    <EditableArrow id={`desp_dur_${v.id}`} label="Flecha Duración desp." defaultDown={Number(v.average_view_duration?.split(':')[0]) < 5} isAdmin={isAdmin} style={s.eCircleIcon} />
                  </View>
                  <View style={{ height: 12 }} />
                  <View style={s.eRow}>
                    <Text style={s.eLabel}>Comentarios</Text>
                    <Text style={s.eVal}>{v.comment_count}</Text>
                  </View>
                  <Text style={s.noReply}>No hay comentarios sin responder</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ── Components ── */

function EditableArrow({ id, label, defaultDown, isAdmin, style }: { id: string; label: string; defaultDown: boolean; isAdmin: boolean; style?: any }) {
  const override = getOverride('ui_panel', 'arrow', id);
  const isDown = override ? override === 'down' : defaultDown;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (!isAdmin) return;
        const ch = getActiveChannelForOverrides();
        const scopedId = ch ? `${ch}_${id}` : id;
        sendEditMessage({ id: `ui_panel_arrow_${scopedId}`, label: `${label} (escribe: up o down)`, value: isDown ? 'down' : 'up', type: 'text', table: 'ui_panel', column: 'arrow', rowId: scopedId });
      }}
    >
      <Image source={isDown ? IC.arrowDown : IC.greenUp} style={style || s.arrowIcon} resizeMode="contain" />
    </TouchableOpacity>
  );
}

function MCard({ label, value, down, arrowId, isAdmin }: { label: string; value: string; down?: boolean; arrowId?: string; isAdmin?: boolean }) {
  const override = arrowId ? getOverride('ui_panel', 'arrow', arrowId) : undefined;
  const isDown = override ? override === 'down' : down;

  return (
    <View style={s.mBox}>
      <Text style={s.mLabel} numberOfLines={1}>{label}</Text>
      <View style={s.mValRow}>
        <Text style={s.mValue}>{value}</Text>
        {arrowId && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (!isAdmin) return;
              const ch = getActiveChannelForOverrides();
              const scopedId = ch ? `${ch}_${arrowId}` : arrowId;
              sendEditMessage({ id: `ui_panel_arrow_${scopedId}`, label: `Flecha ${label} (escribe: up o down)`, value: isDown ? 'down' : 'up', type: 'text', table: 'ui_panel', column: 'arrow', rowId: scopedId });
            }}
          >
            <Image source={isDown ? IC.arrowDown : IC.greenUp} style={s.arrowIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


/* ── Styles (exact Figma values / 3) ── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Channel — avatar at 15pt from left, text at 109pt from left
  chRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 20, paddingTop: 10, paddingBottom: 28 },
  chAva: { width: 77, height: 77, borderRadius: 39, backgroundColor: C.sectionBg },
  chMeta: { marginLeft: 17, flex: 1 },
  chName: { fontSize: F.s18, fontWeight: '700', color: C.text },
  chSubs: { fontSize: F.s23, fontWeight: '700', color: '#1d1d1d', marginTop: 2 },
  chLabel: { fontSize: F.s14, fontWeight: '400', color: '#757575', marginTop: 1 },

  // Section — 13pt horizontal padding, 28pt gap between channel and title
  sec: { paddingHorizontal: 13, marginBottom: 16 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  secTitle: { fontSize: F.s17, fontWeight: '700', color: '#202020' },
  secRight: { fontSize: F.s12, fontWeight: '400', color: '#707070' },

  // 2x2 metric grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  mBox: { width: '48.8%', backgroundColor: C.cardBg, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, height: 81, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  mLabel: { fontSize: F.s12, fontWeight: '400', color: '#737373', marginBottom: 6 },
  mValRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mValue: { fontSize: F.s18, fontWeight: '700', color: '#171717' },
  arrowIcon: { width: 15, height: 15 },
  arrowIconSm: { width: 14, height: 14 },

  // Video card — 12pt gap between cards
  vCard: { backgroundColor: C.cardBg, borderRadius: 12, marginTop: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  vTop: { flexDirection: 'row', padding: 19, paddingBottom: 14, gap: 12 },
  vThumb: { width: 79, height: 44, borderRadius: 6, backgroundColor: C.sectionBg },
  vInfo: { flex: 1, justifyContent: 'center' },
  vTitle: { fontSize: F.s14, fontWeight: '400', color: '#323232', lineHeight: 18 },
  vDate: { fontSize: F.s14, fontWeight: '400', color: '#727272', marginTop: 3 },
  vDiv: { height: 1, backgroundColor: C.divider, marginHorizontal: 19 },
  vQuick: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 19, paddingVertical: 10 },
  qIcon: { width: 17, height: 17, marginRight: 18 },
  qIconSm: { width: 15, height: 15, marginRight: 6 },
  qText: { fontSize: F.s14, fontWeight: '400', color: '#272727', marginRight: 25 },
  chevron: { width: 14, height: 9 },

  // Expanded desplegable — exact Figma icons & spacing
  vExp: { paddingHorizontal: 19, paddingBottom: 14, borderTopWidth: 0.5, borderTopColor: C.divider },
  eRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: C.divider },
  eLabelWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  eLabel: { fontSize: 14, fontWeight: '400', color: '#323232', flex: 1, marginRight: 8 },
  eVal: { fontSize: 14, fontWeight: '600', color: '#252525', marginRight: 8 },
  eCircleIcon: { width: 19, height: 19 },
  eInfoIcon: { width: 19, height: 19, marginLeft: 4 },
  chevRightIcon: { width: 7, height: 12 },
  noReply: { fontSize: 14, fontWeight: '400', color: '#767676', marginTop: 6 },
});
