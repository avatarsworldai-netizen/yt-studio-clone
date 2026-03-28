import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';

const IC = {
  like: require('../../assets/figma/stat_icon_like.png'),
  comment: require('../../assets/figma/stat_icon_comment.png'),
};

export default function CommunityScreen() {
  useRealtimeSubscription('comments', ['allCom']);

  const { data: comments, isLoading } = useQuery({ queryKey: ['allCom'], queryFn: async () => {
    const { data } = await supabase.from('comments').select('*,videos!inner(title,thumbnail_url)').in('status', ['published', 'held_for_review']).order('published_at', { ascending: false }).limit(30);
    return data ?? [];
  }});

  return (
    <FlatList style={s.root} data={comments} keyExtractor={(i: any) => i.id}
      showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }: any) => (
        <View style={s.card}>
          {/* Video title + thumb */}
          <View style={s.vidRow}>
            <Text style={s.vidTitle} numberOfLines={2}>{item.videos?.title}</Text>
            <Image source={{ uri: item.videos?.thumbnail_url || 'https://picsum.photos/640/360' }} style={s.vidThumb} />
          </View>
          {/* Comment body */}
          <View style={s.comRow}>
            <Image source={{ uri: item.author_avatar_url || 'https://picsum.photos/40/40' }} style={s.ava} />
            <View style={s.comBody}>
              <View style={s.nameRow}>
                <Text style={s.author}>@{item.author_name.toLowerCase().replace(/\s+/g, '')}</Text>
                <Text style={s.dot}> · </Text>
                <Text style={s.time}>hace 1 mes</Text>
                <View style={{ flex: 1 }} />
                <MaterialIcons name="more-vert" size={18} color={C.textTer} />
              </View>
              <Text style={s.comText} numberOfLines={3}>{item.content}</Text>
              <View style={s.actions}>
                <TouchableOpacity><Image source={IC.like} style={s.actIcon} resizeMode="contain" /></TouchableOpacity>
                <TouchableOpacity><Image source={IC.like} style={[s.actIcon, { transform: [{ scaleY: -1 }] }]} resizeMode="contain" /></TouchableOpacity>
                <TouchableOpacity><Image source={IC.comment} style={s.actIcon} resizeMode="contain" /></TouchableOpacity>
                <TouchableOpacity><MaterialIcons name="favorite-border" size={20} color={C.textTer} /></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={s.div} />
        </View>
      )}
      ListEmptyComponent={
        <View style={s.empty}><Text style={s.emptyTxt}>{isLoading ? 'Cargando...' : 'Sin comentarios'}</Text></View>
      }
    />
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  card: { paddingHorizontal: 20, paddingTop: 16 },
  vidRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  vidTitle: { flex: 1, fontSize: F.s14, fontWeight: '600', color: C.text, lineHeight: 20, marginRight: 12 },
  vidThumb: { width: 80, height: 45, borderRadius: 8, backgroundColor: C.sectionBg },
  comRow: { flexDirection: 'row', alignItems: 'flex-start' },
  ava: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.sectionBg, marginRight: 10 },
  comBody: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  author: { fontSize: F.s13, fontWeight: '500', color: C.textSec },
  dot: { fontSize: F.s13, color: C.textTer },
  time: { fontSize: F.s13, color: C.textTer },
  comText: { fontSize: F.s14, color: C.text, lineHeight: 20, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 10, paddingBottom: 4 },
  actIcon: { width: 20, height: 20 },
  div: { height: 0.5, backgroundColor: C.divider, marginTop: 12 },
  empty: { padding: 60, alignItems: 'center' },
  emptyTxt: { fontSize: F.s14, color: C.textTer },
});
