import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image, RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminMode } from '../../hooks/useAdminMode';
import { AE } from '../../components/AdminEditable';
import { C } from '../../constants/theme';

const IC = {
  like: require('../../assets/figma/com_like.png'),
  dislike: require('../../assets/figma/com_dislike.png'),
  comment: require('../../assets/figma/com_comment.png'),
  heart: require('../../assets/figma/com_heart.png'),
  dots: require('../../assets/figma/com_dots.png'),
  ytBadge: require('../../assets/figma/com_yt_badge.png'),
  vidThumb1: require('../../assets/figma/com_vid_thumb1.png'),
  vidThumb2: require('../../assets/figma/com_vid_thumb2.png'),
  avatar1: require('../../assets/figma/com_avatar1.png'),
  avatar2: require('../../assets/figma/com_avatar2.png'),
};

export default function CommunityScreen() {
  const qc = useQueryClient();
  const isAdmin = useAdminMode();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => { setRefreshing(true); await qc.invalidateQueries(); setRefreshing(false); }, [qc]);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1db4a5" />}>

      {/* ── Metric cards row ── */}
      <View style={s.metricsRow}>
        <View style={s.metricCard}>
          <View style={s.metricLabelRow}>
            <Text style={s.metricLabel}>Comentarios</Text>
            <Text style={s.metricPeriod}>28 d</Text>
          </View>
          <AE isAdmin={isAdmin} table="dashboard_stats" column="views" rowId="metric_comments" label="Comentarios 28d" value="176">
            <Text style={s.metricValue}>176</Text>
          </AE>
        </View>
        <View style={s.metricCard}>
          <View style={s.metricLabelRow}>
            <Text style={s.metricLabel}>Audiencia mensual</Text>
            <Text style={s.metricPeriod}>28 d</Text>
          </View>
          <AE isAdmin={isAdmin} table="dashboard_stats" column="views" rowId="metric_audience" label="Audiencia mensual 28d" value="1,6K">
            <Text style={s.metricValue}>1,6K</Text>
          </AE>
        </View>
      </View>

      {/* ── Comentarios section ── */}
      <View style={s.secHead}>
        <Text style={s.secTitle}>Comentarios</Text>
        <TouchableOpacity style={s.verTodo}><Text style={s.verTodoText}>Ver todo</Text></TouchableOpacity>
      </View>

      {/* All comments inside one shadow card */}
      <View style={s.commentsCard}>
        {/* Comment 1 */}
        <View style={s.commentItem}>
          <View style={s.vidTitleRow}>
            <AE isAdmin={isAdmin} table="videos" column="title" rowId="vid_comment_1" label="Título video comentario 1" value="ASI GANE 200.000$ en 30 DIAS TRADEANDO MEMECOINS">
              <Text style={s.vidTitle}>ASI GANE 200.000$ en 30 DIAS{'\n'}TRADEANDO MEMECOINS</Text>
            </AE>
            <Image source={IC.vidThumb1} style={s.vidThumb} resizeMode="cover" />
          </View>
          <View style={s.commentBody}>
            <Image source={IC.avatar1} style={s.avatar} resizeMode="cover" />
            <View style={s.commentContent}>
              <View style={s.nameRow}>
                <AE isAdmin={isAdmin} table="comments" column="author_name" rowId="comment_1" label="Autor comentario 1" value="@arielhumberto3813">
                  <Text style={s.authorName}>@arielhumberto3813</Text>
                </AE>
                <Text style={s.timeText}> · hace 1 mes</Text>
                <View style={{ flex: 1 }} />
                <Image source={IC.dots} style={s.dotsIcon} resizeMode="contain" />
              </View>
              <AE isAdmin={isAdmin} table="comments" column="content" rowId="comment_1" label="Comentario 1" value="Comp me comunico con tigo tenemos in proyecto para Lanzar algo different que le dará otra vista a las meme">
                <Text style={s.commentText}>Comp me comunico con tigo tenemos in proyecto para Lanzar algo different que le dará otra vista a las meme</Text>
              </AE>
            </View>
          </View>
          <View style={s.actionsRow}>
            <TouchableOpacity><Image source={IC.like} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.dislike} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.comment} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.heart} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
          </View>
        </View>

        <View style={s.commentDivider} />

        {/* Comment 2 */}
        <View style={s.commentItem}>
          <View style={s.vidTitleRow}>
            <AE isAdmin={isAdmin} table="videos" column="title" rowId="vid_comment_2" label="Título video comentario 2" value="Así fue el lanzamiento de $AWI I Cómo crear un proyecto blockchain desde cero...">
              <Text style={s.vidTitle}>Así fue el lanzamiento de $AWI I Cómo crear un proyecto blockchain desde cero...</Text>
            </AE>
            <Image source={IC.vidThumb2} style={s.vidThumb} resizeMode="cover" />
          </View>
          <View style={s.commentBody}>
            <Image source={IC.avatar2} style={s.avatar} resizeMode="cover" />
            <View style={s.commentContent}>
              <View style={s.nameRow}>
                <AE isAdmin={isAdmin} table="comments" column="author_name" rowId="comment_2" label="Autor comentario 2" value="@felixalejb">
                  <Text style={s.authorName}>@felixalejb</Text>
                </AE>
                <Image source={IC.ytBadge} style={s.ytBadge} resizeMode="contain" />
                <Text style={s.timeText}> · hace 1 mes</Text>
                <View style={{ flex: 1 }} />
                <Image source={IC.dots} style={s.dotsIcon} resizeMode="contain" />
              </View>
              <AE isAdmin={isAdmin} table="comments" column="content" rowId="comment_2" label="Comentario 2" value="Se ve muy sano, ojalá siga así y se rompan muchos máximos.">
                <Text style={s.commentText}>Se ve muy sano, ojalá siga así y se rompan muchos máximos.</Text>
              </AE>
            </View>
          </View>
          <View style={s.actionsRow}>
            <TouchableOpacity><Image source={IC.like} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <Text style={s.likeCount}>1</Text>
            <TouchableOpacity><Image source={IC.dislike} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.comment} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.heart} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
          </View>
        </View>

        <View style={s.commentDivider} />

        {/* Comment 3 */}
        <View style={s.commentItem}>
          <View style={s.commentBody}>
            <View style={s.sLetterAvatar}><Text style={s.sLetterText}>S</Text></View>
            <View style={s.commentContent}>
              <View style={s.nameRow}>
                <AE isAdmin={isAdmin} table="comments" column="author_name" rowId="comment_3" label="Autor comentario 3" value="@SebastianLopez-qt8kq">
                  <Text style={s.authorName}>@SebastianLopez-qt8kq</Text>
                </AE>
                <Text style={s.timeText}> · hace 1 mes</Text>
                <View style={{ flex: 1 }} />
                <Image source={IC.dots} style={s.dotsIcon} resizeMode="contain" />
              </View>
              <AE isAdmin={isAdmin} table="comments" column="content" rowId="comment_3" label="Comentario 3" value="Brutal el video de Awi !! Felicitaciones">
                <Text style={s.commentText}>Brutal el video de Awi !! Felicitaciones</Text>
              </AE>
            </View>
          </View>
          <View style={s.actionsRow}>
            <TouchableOpacity><Image source={IC.like} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.dislike} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.comment} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
            <TouchableOpacity><Image source={IC.heart} style={s.actionIcon} resizeMode="contain" /></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Publicaciones de usuarios ── */}
      <View style={[s.secHead, { marginTop: 20 }]}>
        <Text style={s.secTitle}>Publicaciones de usuarios</Text>
        <TouchableOpacity style={s.verTodo}><Text style={s.verTodoText}>Ver todo</Text></TouchableOpacity>
      </View>

      <View style={s.disabledCard}>
        <View style={s.disabledInner}>
          <Text style={s.disabledText}>Tu Comunidad está desactivada</Text>
        </View>
      </View>

      {/* ── Destacados de la comunidad ── */}
      <View style={s.secHead}>
        <Text style={s.secTitle}>Destacados de la comunidad</Text>
        <TouchableOpacity style={s.verTodo}><Text style={s.verTodoText}>Ver todo</Text></TouchableOpacity>
      </View>
      <Text style={s.destDesc}>Actividad semanal destacada de los miembros de tu audiencia que mas han interactuado, incluidos los principales comentadores</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.destRow}>
        {/* Thiago */}
        <View style={s.destCardShadow}>
          <View style={s.destAvatarWrap}>
            <View style={s.destLetterAvatar}><Text style={s.destLetterText}>T</Text></View>
          </View>
          <View style={s.destNameRow}>
            <AE isAdmin={isAdmin} table="comments" column="author_name" rowId="dest_1" label="Nombre destacado 1" value="Thiago Velgua">
              <Text style={s.destName} numberOfLines={1}>Thiago Velgua</Text>
            </AE>
            <Image source={require('../../assets/figma/dest_yt_badge2.png')} style={s.destBadge} resizeMode="contain" />
          </View>
          <Text style={s.destHandle}>@thiagovelgua121</Text>
          <View style={s.destStatRow}>
            <Image source={require('../../assets/figma/dest_comment_icon.png')} style={s.destStatIcon} resizeMode="contain" />
            <Text style={s.destStatText}>43</Text>
          </View>
        </View>

        {/* Felix */}
        <View style={s.destCardShadow}>
          <View style={s.destAvatarWrap}>
            <AE isAdmin={isAdmin} table="comments" column="author_avatar_url" rowId="dest_2" label="Avatar Félix" value="" type="image">
              <Image source={require('../../assets/figma/dest_avatar_felix.png')} style={s.destAvatarImg} resizeMode="cover" />
            </AE>
          </View>
          <View style={s.destNameRow}>
            <AE isAdmin={isAdmin} table="comments" column="author_name" rowId="dest_2" label="Nombre destacado 2" value="Félix Alejand...">
              <Text style={s.destName} numberOfLines={1}>Félix Alejand...</Text>
            </AE>
            <Image source={require('../../assets/figma/dest_yt_badge1.png')} style={s.destBadge} resizeMode="contain" />
          </View>
          <Text style={s.destHandle}>@felixalejb</Text>
          <View style={s.destStatRow}>
            <Image source={require('../../assets/figma/dest_comment_icon.png')} style={s.destStatIcon} resizeMode="contain" />
            <Text style={s.destStatText}>39</Text>
          </View>
        </View>

        {/* Flork */}
        <View style={s.destCardShadow}>
          <View style={s.destAvatarWrap}>
            <AE isAdmin={isAdmin} table="comments" column="author_avatar_url" rowId="dest_3" label="Avatar Flork" value="" type="image">
              <Image source={require('../../assets/figma/dest_avatar_flork.png')} style={s.destAvatarImg} resizeMode="cover" />
            </AE>
          </View>
          <Text style={s.destName}>Flork_Swea</Text>
          <Text style={s.destHandle}>@LiFall</Text>
          <View style={s.destStatRow}>
            <Image source={require('../../assets/figma/dest_comment_icon.png')} style={s.destStatIcon} resizeMode="contain" />
            <Text style={s.destStatText}>11</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Moderación ── */}
      <Text style={s.modTitle}>Moderación</Text>

      <View style={s.modCard}>
        <TouchableOpacity style={s.modRow}>
          <Image source={require('../../assets/figma/mod_controles.png')} style={s.modIcon} resizeMode="contain" />
          <Text style={s.modLabel}>Controles de contenido</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.modRow}>
          <Image source={require('../../assets/figma/mod_info.png')} style={s.modIcon} resizeMode="contain" />
          <Text style={s.modLabel}>Información sobre la configuración de los comentarios</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Metrics row
  metricsRow: { flexDirection: 'row', paddingHorizontal: 13, paddingTop: 10, gap: 8 },
  metricCard: { flex: 1, backgroundColor: C.cardBg, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  metricLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricLabel: { fontSize: 12, fontWeight: '400', color: '#717171' },
  metricPeriod: { fontSize: 12, fontWeight: '400', color: '#9a9a9a' },
  metricValue: { fontSize: 18, fontWeight: '700', color: '#1e1e1e', marginTop: 6 },

  // Section header
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 14 },
  secTitle: { fontSize: 17, fontWeight: '700', color: '#1e1e1e' },
  verTodo: { borderWidth: 1, borderColor: C.divider, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  verTodoText: { fontSize: 12, fontWeight: '600', color: '#2d2d2d' },

  // Comments wrapper card with shadow
  commentsCard: { marginHorizontal: 13, borderRadius: 12, backgroundColor: C.cardBg, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, overflow: 'hidden' },
  commentItem: { paddingHorizontal: 16, paddingVertical: 14 },
  commentDivider: { height: 0.5, backgroundColor: C.divider, marginHorizontal: 16 },
  vidTitleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  vidTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#2b2b2b', lineHeight: 20, marginRight: 12 },
  vidThumb: { width: 79, height: 44, borderRadius: 6 },

  // Comment body
  commentBody: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0' },
  sLetterAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#c4d9e9', justifyContent: 'center', alignItems: 'center' },
  sLetterText: { fontSize: 22, fontWeight: '600', color: '#fff' },
  commentContent: { flex: 1, marginLeft: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: 11, fontWeight: '400', color: '#787878' },
  ytBadge: { width: 16, height: 16, marginLeft: 2, marginRight: 2 },
  timeText: { fontSize: 11, fontWeight: '400', color: '#747474' },
  dotsIcon: { width: 3, height: 12 },
  commentText: { fontSize: 13, fontWeight: '400', color: '#313131', lineHeight: 19, marginTop: 4 },

  // Actions row
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 12, paddingLeft: 50 },
  actionIcon: { width: 15, height: 15 },
  likeCount: { fontSize: 12, fontWeight: '400', color: '#1f1f1f', marginLeft: -14 },


  // Disabled community card with shadow
  disabledCard: { marginHorizontal: 13, borderRadius: 12, backgroundColor: C.cardBg, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, overflow: 'hidden' },
  disabledInner: { backgroundColor: '#f5f5f5', margin: 14, borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  disabledText: { fontSize: 13, fontWeight: '400', color: '#797979' },

  // Destacados
  destDesc: { fontSize: 12, fontWeight: '400', color: '#757575', lineHeight: 17, paddingHorizontal: 16, marginBottom: 16 },
  destRow: { paddingHorizontal: 13, paddingTop: 6, paddingBottom: 10, gap: 10 },
  destCardShadow: { alignItems: 'center', width: 155, backgroundColor: C.cardBg, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 10, marginBottom: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 },
  destAvatarWrap: { width: 73, height: 73, borderRadius: 37, overflow: 'hidden', marginBottom: 8 },
  destLetterAvatar: { width: 73, height: 73, borderRadius: 37, backgroundColor: '#fce3cf', justifyContent: 'center', alignItems: 'center' },
  destLetterText: { fontSize: 30, fontWeight: '600', color: '#e8915a' },
  destAvatarImg: { width: 73, height: 73 },
  destNameRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  destName: { fontSize: 13, fontWeight: '600', color: '#242424' },
  destBadge: { width: 14, height: 14 },
  destHandle: { fontSize: 12, fontWeight: '400', color: '#757575', marginTop: 2 },
  destStatRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  destStatIcon: { width: 14, height: 14 },
  destStatText: { fontSize: 13, fontWeight: '700', color: '#262626' },

  // Moderación
  modTitle: { fontSize: 17, fontWeight: '700', color: '#1d1d1d', paddingHorizontal: 16, marginTop: 28, marginBottom: 14 },
  modCard: { marginHorizontal: 13, borderRadius: 12, backgroundColor: C.cardBg, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, overflow: 'hidden', paddingVertical: 4 },
  modRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  modIcon: { width: 22, height: 22, marginRight: 14 },
  modLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#262626', lineHeight: 21 },
});
