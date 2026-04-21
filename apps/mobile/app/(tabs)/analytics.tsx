import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl, Dimensions } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useAdminMode, sendEditMessage } from '../../hooks/useAdminMode';
import { AE } from '../../components/AdminEditable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Carousel } from '../../components/ui/Carousel';
import { supabase } from '../../lib/supabase';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { C, F } from '../../constants/theme';
import Svg, { Polyline } from 'react-native-svg';
import { DynamicLineChart, DynamicBarChart, parseValue, niceStep, formatYLabel, PATTERN_LIST, BAR_PATTERN_LIST, generateBarData } from '../../components/DynamicChart';
import { getOverride, useFieldOverrides, getActiveChannelForOverrides } from '../../hooks/useFieldOverrides';
import { useChannel } from '../../contexts/ChannelContext';

function fmt(v: any) {
  return String(v ?? '');
}

const TABS = ['Vista General', 'Contenido', 'Audiencia', 'Ingresos', 'Tendencias'];

// Tendencias data
const TEND_SEARCHES = [
  'useless coin price\nprediction',
  'how to create\ncoin/token',
];

const TEND_VIDEOS = [
  { title: 'Bitcoin NO VOLVERA a los 80.000$ hasta 2027|Esto NAD...', channel: 'Plan BTC', views: '40,8 K visualizaciones', time: 'hace 3 sema...', duration: '29:37', thumb: require('../../assets/figma/tend_vid1.png') },
  { title: 'Bitcoin a 74k: ER trampa institucio', channel: 'KManuS88', views: '21,9K visu', time: '', duration: '', thumb: require('../../assets/figma/tend_vid2.png') },
];
const FILTER_CHIPS = ['Todo', 'Anuncios de la página de vi...', 'Anuncios del feed de Shorts', 'Supers'];

const AD_TYPES = [
  { label: 'Anuncios de video saltables (subasta)', pct: '70,7%' },
  { label: 'Anuncios de display (subasta)', pct: '17,0 %' },
  { label: 'Anuncios de bumper (subasta)', pct: '7,9 %' },
  { label: 'Anuncios de video no saltables (subasta)', pct: '3,9 %' },
  { label: 'Anuncios de video no saltables (reservado)', pct: '0,2 %' },
];

const TEAL = '#1db4a5';

// Vista General data
const VG_CHARTS = [
  { label: 'Visualizaciones', value: '4,2K', sub: '2,2 K menos de lo habitual', chart: require('../../assets/figma/vg_chart_views.png'), arrow: require('../../assets/figma/vg_arrow_down_sm.png'), yLabels: ['990', '660', '330', '0'], xLabels: ['2 mar', '29mar'] },
  { label: 'Tiempo de visualización (horas)', value: '294', sub: '225 menos de lo habitual', chart: require('../../assets/figma/vg_chart_time_real.png'), arrow: require('../../assets/figma/vg_arrow_down_sm.png'), yLabels: ['108', '72,2', '36,1', '0,0'], xLabels: ['3 mar', '29 mar'] },
  { label: 'Suscriptores', value: '-74', sub: '37 % más que los últimos 28 días', chart: require('../../assets/figma/vg_chart_subs_real.png'), arrow: require('../../assets/figma/arrow_green_up.png'), yLabels: ['5', '0', '-5', '-10'], xLabels: ['2 mar', '29 mar'], subGreen: true, fullImage: require('../../assets/figma/vg_subs_card_full.png') },
  { label: 'Ingresos estimados', value: '15,24€', sub: '', chart: require('../../assets/figma/vg_chart_ingresos.png'), arrow: null, yLabels: ['4,20€', '2,80€', '1,40€', '0€'], xLabels: ['2 mar', '29 mar'] },
];

const VG_TIPS = [
  { title: 'Cómo encuentran tus\nvídeos los usuarios', icon: require('../../assets/figma/vg_binoculars.png') },
  { fullImg: require('../../assets/figma/vg_tip2_card.png') },
  { fullImg: require('../../assets/figma/vg_tip3_card.png') },
];

const VG_POPULAR = [
  { thumb: require('../../assets/figma/vg_vid1.png'), title: 'Tutorial BRIDGE FLORK a DUMP (Pa...', views: '1,9K' },
  { thumb: require('../../assets/figma/vg_vid2.png'), title: 'CALCULA TU TIER & RELLENA el FO...', views: '923' },
  { thumb: require('../../assets/figma/vg_vid3.png'), title: 'Bridge de FLORK a DUMP + PROYE...', views: '708' },
  { thumb: require('../../assets/figma/vg_vid4.png'), title: 'Así fue el lanzamiento de $Awl I C6...', views: '111' },
];

// Contenido tab data
// Audiencia tab data
const AUD_CHARTS = [
  { fullImage: require('../../assets/figma/aud_card_mensual.png') },
  { fullImage: require('../../assets/figma/vg_subs_card_full.png') },
];
const AUD_POPULAR_NUEVOS = [
  { thumb: require('../../assets/figma/vg_vid1.png'), title: 'Tutorial BRIDGE FLORK...', views: '157' },
  { thumb: require('../../assets/figma/vg_vid2.png'), title: 'CALCULA TU TIER & RE...', views: '115' },
  { thumb: require('../../assets/figma/vg_vid3.png'), title: 'Bridge de FLORK a DUM...', views: '71' },
];

const CV_CHIPS = ['Todo', 'Vídeos', 'Shorts', 'En directo', 'Publicaciones'];
const CV_CHARTS = [
  { label: 'Visualizaciones', value: '4,2K', sub: '957 menos de lo habitual', chart: require('../../assets/figma/vg_chart_views.png'), arrow: require('../../assets/figma/vg_arrow_down_sm.png'), yLabels: ['990', '660', '330', '0'], xLabels: ['2 mar', '29mar'] },
  { label: 'Impresiones', value: '40,5K', sub: '61 % menos que', chart: require('../../assets/figma/cv_chart_impresiones.png'), arrow: require('../../assets/figma/vg_arrow_down_sm.png'), yLabels: ['5,7K', '3,8 K', '1,9K', '0'], xLabels: ['2 mar', ''] },
];
const CV_VIDEOS = [
  { thumb: require('../../assets/figma/vg_vid1.png'), title: 'Tutorial BRIDGE FLORK a DUMP (Pa...', views: '1,9K' },
  { thumb: require('../../assets/figma/vg_vid2.png'), title: 'CALCULA TU TIER & RELLENA el FO...', views: '923' },
  { thumb: require('../../assets/figma/vg_vid3.png'), title: 'Bridge de FLORK a DUMP + PROYE...', views: '708' },
  { thumb: require('../../assets/figma/vg_vid4.png'), title: 'Así fue el lanzamiento de $Awl 1 C6...', views: '111' },
  { thumb: require('../../assets/figma/cv_vid5.png'), title: 'Descubre en que TIER calificas y co...', views: '70' },
];

const IE_VIDEOS = [
  { thumb: require('../../assets/figma/ie_vid1.png'), title: 'Tutorial BRIDGE FLORK a DUMP (Paso a...', amount: '8,26 €' },
  { thumb: require('../../assets/figma/ie_vid2.png'), title: 'CALCULA TU TIER & RELLENA el FORM...', amount: '3,69€' },
  { thumb: require('../../assets/figma/ie_vid3.png'), title: 'Bridge de FLORK a DUMP + PROYECTO...', amount: '2,25€' },
  { thumb: require('../../assets/figma/ie_vid4.png'), title: '$FLORK Revoluciona el Juego: ¡Des...', amount: '0,45 €' },
  { thumb: require('../../assets/figma/ie_vid5.png'), title: 'FECHA DEL BRIDGE de FLORK a DUMP...', amount: '0,35€' },
];
const IE_PERIODS = ['7D', '28 D', '90 D', '365 D', 'Mar', 'Feb', 'Ene', '2026', '2025', 'Total'];
const IE_Y_LABELS = ['4,20€', '2,80€', '1,40€', '0€'];
const IE_X_LABELS = ['1mar', '14 mar', '28 mar'];

// Popular content detail data
const POP_PERIODS = ['7D', '28 D', '90 D', '365 D', 'Abr', 'Mar', 'Feb'];
const POP_VIDEOS = [
  { thumb: require('../../assets/figma/pop_thumb_1.png'), title: 'Tutorial BRIDGE FLORK a DUMP (Paso a...', views: 464, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_2.png'), title: 'CALCULA TU TIER & RELLENA el FORM...', views: 109, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_3.png'), title: 'Bridge de FLORK a DUMP + PROYECTO...', views: 61, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_4.png'), title: 'TODO SOBRE FLORK Y DUMPFUN', views: 45, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_5.png'), title: 'Así fue el lanzamiento de $Awl I Como c...', views: 33, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_6.png'), title: 'FECHA DEL BRIDGE de FLORK a DUMP...', views: 20, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_7.png'), title: '27 de diciembre de 2024', views: 17, isShort: true },
  { thumb: require('../../assets/figma/pop_thumb_8.png'), title: 'El cerebro detras de DumpFun... y n...', views: 14, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_9.png'), title: 'ASÍ GANÉ 200.000$ en 30 DIAS TRADE...', views: 14, isShort: false },
  { thumb: require('../../assets/figma/pop_thumb_10.png'), title: '¿Que Esta Pasando con $MOG?', views: 13, isShort: false },
];
const POP_MAX_VIEWS = Math.max(...POP_VIDEOS.map(v => v.views));

export default function AnalyticsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const qc = useQueryClient();
  const isAdmin = useAdminMode();
  const { activeChannelId: CID } = useChannel();
  useFieldOverrides(); // Subscribe to override changes for instant chart updates
  const screenW = Dimensions.get('window').width;
  const [activeTab, setActiveTab] = useState(0);
  const [activeChip, setActiveChip] = useState(0);
  const [showIngresosDetail, setShowIngresosDetail] = useState(false);
  const [showPopularContent, setShowPopularContent] = useState(false);
  const [showVideoDetail, setShowVideoDetail] = useState<number | null>(null); // index into POP_VIDEOS
  const [videoDetailTab, setVideoDetailTab] = useState(0);
  const [popPeriod, setPopPeriod] = useState(1);
  const [iePeriod, setIePeriod] = useState(1);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: !showIngresosDetail && !showPopularContent && showVideoDetail === null });
  }, [showIngresosDetail, showPopularContent, showVideoDetail, navigation]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => { setRefreshing(true); await qc.invalidateQueries(); setRefreshing(false); }, [qc]);

  useRealtimeSubscription('dashboard_stats', ['as3']);
  useRealtimeSubscription('analytics_timeseries', ['ts3']);
  useRealtimeSubscription('revenue', ['rv3']);

  const { data: st } = useQuery({ queryKey: ['as3', CID], queryFn: async () => { const { data } = await supabase.from('dashboard_stats').select('*').eq('channel_id', CID).eq('period', 'last_28_days').single(); return data } });
  const { data: ts } = useQuery({ queryKey: ['ts3', CID], queryFn: async () => { const { data } = await supabase.from('analytics_timeseries').select('*').eq('channel_id', CID).eq('metric_type', 'revenue').order('date', { ascending: true }).limit(30); return data ?? [] } });
  const { data: rev } = useQuery({ queryKey: ['rv3', CID], queryFn: async () => { const { data } = await supabase.from('revenue').select('*').eq('channel_id', CID).order('month', { ascending: false }).limit(6); return data ?? [] } });

  const chartW = 338;
  const chartH = 100;
  function buildPoints() {
    if (!ts || !ts.length) return '';
    const vals = ts.map((d: any) => Number(d.value));
    const mx = Math.max(...vals, 1);
    const mn = Math.min(...vals, 0);
    const rng = mx - mn || 1;
    return vals.map((v, i) => `${(i / (vals.length - 1)) * chartW},${chartH - ((v - mn) / rng) * (chartH - 10)}`).join(' ');
  }

  const yLabels = ['4,20 €', '2,80 €', '1,40 €', '0 €'];
  const firstDate = ts?.length ? new Date(ts[0].date).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '';
  const lastDate = ts?.length ? new Date(ts[ts.length - 1].date).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '';
  const maxRev = Math.max(...(rev || []).map((r: any) => Number(r.estimated_revenue) || 0), 1);

  /* ── Shared chart component ── */
  function ChartCard() {
    const revenueVal = st?.estimated_revenue || '0';
    const tsPoints = ts?.length ? ts.map((d: any) => Number(d.value)) : undefined;
    const chartPattern = getOverride('ui_analytics', 'chart_pattern', 'chart_main') || '1';
    // Compute Y labels for editable rendering
    const pts = tsPoints || [];
    const maxPt = Math.max(...(pts.length ? pts : [parseValue(revenueVal) / 28]), 0.01);
    const stepVal = niceStep(maxPt);
    const yMax = Math.ceil(maxPt / stepVal) * stepVal;
    const defaultYLabels = [
      formatYLabel(yMax, true),
      formatYLabel(yMax * 2 / 3, true),
      formatYLabel(yMax / 3, true),
      '0 €',
    ];
    const patternName = PATTERN_LIST.find(p => p.id === chartPattern)?.name || 'Estable';
    return (
      <View style={s.chartCard}>
        <AE isAdmin={isAdmin} table="ui_analytics" column="chart_label" rowId="chart_main" label="Etiqueta gráfica principal" value="Ingresos estimados">
          <Text style={s.chartLabel}>Ingresos estimados</Text>
        </AE>
        <AE isAdmin={isAdmin} table="dashboard_stats" column="estimated_revenue" rowId={st?.id || ''} label="Ingresos estimados" value={revenueVal}>
          <Text style={s.chartValue}>{revenueVal} €</Text>
        </AE>
        {/* Editable chart pattern selector */}
        {isAdmin && <AE isAdmin={isAdmin} table="ui_analytics" column="chart_pattern" rowId="chart_main" label={`Patrón gráfica (1-80): ${patternName}`} value={chartPattern}>
          <Text style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>{'📈 ' + (PATTERN_LIST.find(p => p.id === chartPattern)?.name || chartPattern)}</Text>
        </AE>}
        <View style={{ marginTop: 20, flexDirection: 'row' }}>
          {/* Editable Y-axis labels */}
          <View style={{ width: 42, justifyContent: 'space-between', paddingRight: 4, height: chartH }}>
            {defaultYLabels.map((label, i) => (
              <AE key={i} isAdmin={isAdmin} table="ui_analytics" column="y_label" rowId={`chart_main_y${i}`} label={`Eje Y gráfica: ${label}`} value={label}>
                <Text style={{ fontSize: 10, fontWeight: '500', color: '#7a7a7a' }}>{label}</Text>
              </AE>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <DynamicLineChart
              value={revenueVal}
              points={tsPoints}
              xLabels={[firstDate, lastDate]}
              height={chartH}
              color="#1db4a5"
              hideYLabels
              pattern={chartPattern}
              tooltipId="chart_main"
            />
          </View>
        </View>
      </View>
    );
  }

  /* ── "Todo" content ── */
  function TodoContent() {
    return (
      <>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowIngresosDetail(true)}>
          <ChartCard />
        </TouchableOpacity>
        <View style={s.earningsCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="earnings_title" label="Título: Cuánto estás ganando" value="Cuánto estás ganando">
            <Text style={s.earningsTitle}>Cuánto estás ganando</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="earnings_sub" label="Subtítulo ganancias" value="Estimación · Últimos 6 meses">
            <Text style={s.earningsSub}>Estimación · Últimos 6 meses</Text>
          </AE>
          {(rev || []).map((r: any, i: number) => {
            const pct = ((Number(r.estimated_revenue) || 0) / maxRev) * 100;
            const monthName = new Date(r.month).toLocaleDateString('es-ES', { month: 'long', year: i >= 3 ? 'numeric' : undefined });
            return (
              <View key={r.id} style={s.monthRow}>
                <View style={s.monthTop}>
                  <AE isAdmin={isAdmin} table="revenue" column="month" rowId={r.id} label={`Mes: ${monthName}`} value={monthName.charAt(0).toUpperCase() + monthName.slice(1) + (i === 0 ? ' (en curso)' : '')}>
                    <Text style={s.monthName}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}{i === 0 ? ' (en curso)' : ''}</Text>
                  </AE>
                  <AE isAdmin={isAdmin} table="revenue" column="estimated_revenue" rowId={r.id} label={`Ingresos ${new Date(r.month).toLocaleDateString('es', {month:'long'})}`} value={r.estimated_revenue}>
                    <Text style={s.monthValue}>{r.estimated_revenue} €</Text>
                  </AE>
                </View>
                <View style={s.barBg}><View style={[s.barFill, { width: `${Math.min(pct, 100)}%` }]} /></View>
              </View>
            );
          })}
        </View>

        {/* ── Rendimiento carrusel ── */}
        <Carousel itemWidth={Math.round(screenW * 0.72)}>
          {/* Card 1: Rendimiento de los vídeos */}
          <View style={s.vgChartOuter}>
            <View style={s.rendCard}>
              <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="rend_vid_title" label="Título rendimiento vídeos" value="Rendimiento de los vídeos">
                <Text style={s.rendTitle}>Rendimiento de los vídeos</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="rend_vid_sub" label="Sub rendimiento vídeos" value="Últimos 28 días">
                <Text style={s.rendSub}>Últimos 28 días</Text>
              </AE>
              <AE isAdmin={isAdmin} table="revenue" column="estimated_revenue" rowId="rend_vid" label="Rendimiento vídeos total" value="13,21€">
                <Text style={s.rendValue}>13,21€</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_analytics" column="label" rowId="rend_vid_label" label="Etiqueta ingresos vídeos" value="Ingresos estimados">
                <Text style={s.rendLabel}>Ingresos estimados</Text>
              </AE>
              <View style={s.rendVidRow}>
                <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId="rend_v1" label="Thumbnail rend. vídeo 1" value="" type="image">
                  <Image source={require('../../assets/figma/rend_vid1.png')} style={s.rendThumb} resizeMode="cover" />
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="title" rowId="rend_v1" label="Título rend. vídeo 1" value="Tutorial BRIDGE FLO...">
                  <Text style={s.rendVidTitle} numberOfLines={1}>Tutorial BRIDGE FLO...</Text>
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="estimated_revenue" rowId="rend_v1" label="Ingresos rend. vídeo 1" value="8,43€">
                  <Text style={s.rendVidAmount}>8,43€</Text>
                </AE>
              </View>
              <View style={s.rendVidRow}>
                <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId="rend_v2" label="Thumbnail rend. vídeo 2" value="" type="image">
                  <Image source={require('../../assets/figma/rend_vid2.png')} style={s.rendThumb} resizeMode="cover" />
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="title" rowId="rend_v2" label="Título rend. vídeo 2" value="CALCULA TU TIER &...">
                  <Text style={s.rendVidTitle} numberOfLines={1}>CALCULA TU TIER &...</Text>
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="estimated_revenue" rowId="rend_v2" label="Ingresos rend. vídeo 2" value="3,40€">
                  <Text style={s.rendVidAmount}>3,40€</Text>
                </AE>
              </View>
              <View style={s.rendVidRow}>
                <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId="rend_v3" label="Thumbnail rend. vídeo 3" value="" type="image">
                  <Image source={require('../../assets/figma/rend_vid3.png')} style={s.rendThumb} resizeMode="cover" />
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="title" rowId="rend_v3" label="Título rend. vídeo 3" value="Bridge de FLORK a D...">
                  <Text style={s.rendVidTitle} numberOfLines={1}>Bridge de FLORK a D...</Text>
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="estimated_revenue" rowId="rend_v3" label="Ingresos rend. vídeo 3" value="1,86€">
                  <Text style={s.rendVidAmount}>1,86€</Text>
                </AE>
              </View>
            </View>
          </View>
          {/* Card 2: Rendimiento de los Shorts */}
          <View style={s.vgChartOuter}>
            <View style={s.rendCard}>
              <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="rend_short_title" label="Título rendimiento Shorts" value="Rendimiento de los Shorts">
                <Text style={s.rendTitle}>Rendimiento de los Shorts</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="rend_short_sub" label="Sub rendimiento Shorts" value="Últimos 28 días">
                <Text style={s.rendSub}>Últimos 28 días</Text>
              </AE>
              <AE isAdmin={isAdmin} table="revenue" column="estimated_revenue" rowId="rend_short" label="Rendimiento Shorts total" value="0€">
                <Text style={s.rendValue}>0€</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_analytics" column="label" rowId="rend_short_label" label="Etiqueta ingresos Shorts" value="Ingresos estimados">
                <Text style={s.rendLabel}>Ingresos estimados</Text>
              </AE>
              <View style={s.rendVidRow}>
                <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId="rend_s1" label="Thumbnail rend. short" value="" type="image">
                  <Image source={require('../../assets/figma/rend_short1.png')} style={s.rendThumbShort} resizeMode="cover" />
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="title" rowId="rend_s1" label="Título rend. short 1" value="27 de diciembre de 2024">
                  <Text style={s.rendVidTitle} numberOfLines={1}>27 de diciembre de 2024</Text>
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="estimated_revenue" rowId="rend_s1" label="Ingresos rend. short 1" value="0,00€">
                  <Text style={s.rendVidAmount}>0,00€</Text>
                </AE>
              </View>
            </View>
          </View>
          {/* Card 3: Actuaciones en directo */}
          <View style={s.vgChartOuter}>
            <View style={s.rendCard}>
              <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="rend_live_title" label="Título actuaciones directo" value="Actuaciones en directo">
                <Text style={s.rendTitle}>Actuaciones en directo</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="rend_live_sub" label="Sub actuaciones directo" value="Últimos 28 días">
                <Text style={s.rendSub}>Últimos 28 días</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_analytics" column="value" rowId="rend_live_val" label="Valor actuaciones directo" value="—">
                <Text style={[s.rendValue, { fontSize: 20 }]}>—</Text>
              </AE>
              <AE isAdmin={isAdmin} table="ui_analytics" column="label" rowId="rend_live_label" label="Etiqueta ingresos directo" value="Ingresos estimados">
                <Text style={s.rendLabel}>Ingresos estimados</Text>
              </AE>
              <View style={s.noDataBox}>
                <View style={s.noDataIcon}>
                  <Text style={{ fontSize: 16, color: '#888' }}>ⓘ</Text>
                </View>
                <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="nodata_live" label="Texto sin datos directo" value="No hay nada que mostrar para estas fechas">
                  <Text style={s.noDataText}>No hay nada que mostrar para estas fechas</Text>
                </AE>
              </View>
            </View>
          </View>
        </Carousel>

        {/* ── Cómo ganas dinero ── */}
        <View style={s.earningsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="como_ganas" label="Título: Cómo ganas dinero" value="Cómo ganas dinero">
              <Text style={s.earningsTitle}>Cómo ganas dinero</Text>
            </AE>
            <Image source={require('../../assets/figma/rend_clock.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
          </View>
          <Text style={s.earningsSub}>Estimación · Últimos 28 días</Text>

          {/* Progress bar */}
          <View style={{ height: 10, backgroundColor: TEAL, borderRadius: 5, marginBottom: 16 }} />

          <View style={s.rendSourceRow}>
            <View style={[s.rendDot, { backgroundColor: TEAL }]} />
            <AE isAdmin={isAdmin} table="revenue" column="ad_revenue" rowId="source_1" label="Fuente ingreso 1" value="Anuncios de la pagina de visualización">
              <Text style={s.rendSourceLabel}>Anuncios de la pagina de visualización</Text>
            </AE>
            <AE isAdmin={isAdmin} table="revenue" column="ad_revenue" rowId="source_1_pct" label="% Fuente 1" value="100,0%">
              <Text style={s.rendSourcePct}>100,0%</Text>
            </AE>
          </View>
          <View style={s.rendSourceRow}>
            <View style={[s.rendDot, { backgroundColor: TEAL }]} />
            <AE isAdmin={isAdmin} table="revenue" column="ad_revenue" rowId="source_2" label="Fuente ingreso 2" value="Anuncios del feed de Shorts">
              <Text style={s.rendSourceLabel}>Anuncios del feed de Shorts</Text>
            </AE>
            <AE isAdmin={isAdmin} table="revenue" column="ad_revenue" rowId="source_2_pct" label="% Fuente 2" value="< 0,1 %">
              <Text style={s.rendSourcePct}>{'< 0,1 %'}</Text>
            </AE>
          </View>
        </View>
      </>
    );
  }

  /* ── "Anuncios de la página de vídeo" content ── */
  function AnunciosVideoContent() {
    return (
      <>
        <ChartCard />
        <View style={s.earningsCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="anunciantes_title" label="Título anunciantes" value="Cuánto pagan los anunciantes">
            <Text style={s.earningsTitle}>Cuánto pagan los anunciantes</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="anunciantes_sub" label="Sub anunciantes" value="Últimos 28 días">
            <Text style={s.earningsSub}>Últimos 28 días</Text>
          </AE>
          <AE isAdmin={isAdmin} table="revenue" column="cpm" rowId="cpm_val" label="CPM valor" value="6,55 €">
            <Text style={s.cpmValue}>6,55 €</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="cpm_desc" label="Descripción CPM" value="Coste por cada 1000 reproducciones (CPM basado en reproducciones)">
            <Text style={s.cpmDesc}>Coste por cada 1000 reproducciones (CPM basado en reproducciones)</Text>
          </AE>
        </View>
        <View style={s.earningsCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="adtype_title" label="Título tipos anuncio" value="Earnings by ad type">
            <Text style={s.earningsTitle}>Earnings by ad type</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="adtype_sub" label="Sub tipos anuncio" value="Ingresos publicitarios de YouTube · Últimos 28 días">
            <Text style={s.earningsSub}>Ingresos publicitarios de YouTube · Últimos 28 días</Text>
          </AE>
          {AD_TYPES.map((ad, i) => (
            <View key={i} style={s.adRow}>
              <AE isAdmin={isAdmin} table="revenue" column="ad_revenue" rowId={`adtype_${i}`} label={`Tipo anuncio ${i+1}`} value={ad.label}>
                <Text style={s.adLabel}>{ad.label}</Text>
              </AE>
              <AE isAdmin={isAdmin} table="revenue" column="ad_revenue" rowId={`adtype_pct_${i}`} label={`% Tipo anuncio ${i+1}`} value={ad.pct}>
                <Text style={s.adPct}>{ad.pct}</Text>
              </AE>
            </View>
          ))}
        </View>
      </>
    );
  }

  /* ── "Anuncios del feed de Shorts" content ── */
  function AnunciosFeedContent() {
    return (
      <>
        {/* Chart card with 0€ values */}
        <View style={s.chartCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="chart_label" rowId="feed_chart" label="Etiqueta gráfica Shorts" value="Ingresos estimados">
            <Text style={s.chartLabel}>Ingresos estimados</Text>
          </AE>
          {(() => {
            const feedOverride = getOverride('revenue', 'estimated_revenue', 'feed_val');
            const feedVal = feedOverride || '0€';
            const feedPattern = getOverride('ui_analytics', 'chart_pattern', 'feed_chart') || '1';
            const feedPatternName = PATTERN_LIST.find(p => p.id === feedPattern)?.name || 'Estable';
            return (
              <>
                <AE isAdmin={isAdmin} table="revenue" column="estimated_revenue" rowId="feed_val" label="Ingresos Shorts feed" value={feedVal}>
                  <Text style={[s.chartValue, { fontSize: 20 }]}>{feedVal}</Text>
                </AE>
                {isAdmin && <AE isAdmin={isAdmin} table="ui_analytics" column="chart_pattern" rowId="feed_chart" label={`Patrón gráfica feed (1-80): ${feedPatternName}`} value={feedPattern}>
                  <Text style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>{'📈 ' + feedPatternName}</Text>
                </AE>}
                <DynamicLineChart value={feedVal} xLabels={[firstDate, lastDate]} height={chartH} color="#1db4a5" pattern={feedPattern} tooltipId="feed_chart" />
              </>
            );
          })()}
        </View>

        {/* Shorts con mayores ingresos */}
        <View style={s.earningsCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="shorts_mayores" label="Título shorts mayores ingresos" value="Shorts con mayores ingresos">
            <Text style={s.earningsTitle}>Shorts con mayores ingresos</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="shorts_mayores_sub" label="Sub shorts mayores" value="Anuncios del feed de Shorts · Últimos 28 días">
            <Text style={s.earningsSub}>Anuncios del feed de Shorts · Últimos 28 días</Text>
          </AE>
          <View style={s.shortRow}>
            <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId="feed_short1" label="Thumbnail short feed" value="" type="image">
              <Image source={{ uri: undefined }} style={s.shortThumb} />
            </AE>
            <View style={s.shortInfo}>
              <AE isAdmin={isAdmin} table="videos" column="published_at" rowId="feed_short1" label="Fecha short" value="27 de diciembre de 2024">
                <Text style={s.shortDate}>27 de diciembre de 2024</Text>
              </AE>
              <AE isAdmin={isAdmin} table="videos" column="estimated_revenue" rowId="feed_short1" label="Ingresos short" value="0,00€">
                <Text style={s.shortAmount}>0,00€</Text>
              </AE>
            </View>
          </View>
        </View>
      </>
    );
  }

  /* ── "Audiencia" tab content ── */
  function AudienciaTabContent() {
    return (
      <>
        {/* Chart cards carousel */}
        <Carousel itemWidth={Math.round(screenW * 0.75)}>
          {AUD_CHARTS.map((item, idx) => (
            <View key={idx} style={s.vgChartOuter}>
              <View style={s.vgChartCardFixed}>
                <Image source={item.fullImage} style={s.vgFullCardImg} resizeMode="contain" />
              </View>
            </View>
          ))}
        </Carousel>

        {/* Audiencia por comportamiento */}
        <View style={s.vgPopCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="aud_comportamiento" label="Título audiencia comportamiento" value="Audiencia por comportamiento de visualización">
              <Text style={s.vgPopTitle}>Audiencia por comportamiento de visualización</Text>
            </AE>
          </View>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="aud_comportamiento_sub" label="Sub audiencia comportamiento" value="Audiencia mensual · 29 mar 2026">
            <Text style={s.vgPopSub}>Audiencia mensual · 29 mar 2026</Text>
          </AE>
          <View style={s.audNoDataBox}>
            <Image source={require('../../assets/figma/info_icon.png')} style={s.noDataInfoIcon} resizeMode="contain" />
            <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="aud_nodata" label="Texto sin datos audiencia" value="No hay suficientes datos para mostrar este informe">
              <Text style={s.audNoDataText}>No hay suficientes datos para mostrar este informe</Text>
            </AE>
          </View>
        </View>

        {/* Popular entre usuarios nuevos */}
        <View style={s.vgPopCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="aud_popular" label="Título popular usuarios nuevos" value="Popular entre usuarios nuevos">
            <Text style={s.vgPopTitle}>Popular entre usuarios nuevos</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="aud_popular_sub" label="Sub popular usuarios nuevos" value="Visualizaciones · Últimos 28 dias">
            <Text style={s.vgPopSub}>Visualizaciones · Últimos 28 dias</Text>
          </AE>
          {AUD_POPULAR_NUEVOS.map((vid, i) => (
            <View key={i} style={s.vgPopRow}>
              <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId={`audpop_${i}`} label={`Thumbnail popular nuevo ${i+1}`} value="" type="image">
                <Image source={vid.thumb} style={s.vgPopThumb} resizeMode="cover" />
              </AE>
              <AE isAdmin={isAdmin} table="videos" column="title" rowId={`audpop_${i}`} label={`Título popular nuevo ${i+1}`} value={vid.title}>
                <Text style={s.vgPopVidTitle} numberOfLines={1}>{vid.title}</Text>
              </AE>
              <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={`audpop_${i}`} label={`Views popular nuevo ${i+1}`} value={vid.views}>
                <Text style={s.vgPopViews}>{vid.views}</Text>
              </AE>
            </View>
          ))}
        </View>
      </>
    );
  }

  /* ── "Contenido" tab content ── */
  const [cvChip, setCvChip] = useState(1); // Vídeos active by default

  function ContenidoTabContent() {
    return (
      <>
        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
          {CV_CHIPS.map((chip, i) => (
            <TouchableOpacity key={chip} style={[s.chip, cvChip === i && s.chipActive]} onPress={() => setCvChip(i)}>
              <AE isAdmin={isAdmin} table="ui_analytics" column="chip_label" rowId={`cvchip_${i}`} label={`Filtro contenido: ${chip}`} value={chip}>
                <Text style={[s.chipText, cvChip === i && s.chipTextActive]}>{chip}</Text>
              </AE>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Chart cards carousel */}
        <Carousel itemWidth={Math.round(screenW * 0.75)}>
          {CV_CHARTS.map((item, idx) => {
            const overrideVal = getOverride('dashboard_stats', 'views', `vgchart_${idx}`);
            const displayVal = overrideVal || item.value;
            const cvPattern = getOverride('ui_analytics', 'chart_pattern', `cv_chart_${idx}`) || '1';
            const cvPatternName = PATTERN_LIST.find(p => p.id === cvPattern)?.name || 'Estable';
            return (
              <View key={idx} style={s.vgChartOuter}>
                <View style={s.vgChartCardFixed}>
                  <Text style={s.vgChartLabel}>{item.label}</Text>
                  <View style={s.vgValRow}>
                    <AE isAdmin={isAdmin} table="dashboard_stats" column="views" rowId={`vgchart_${idx}`} label={`${item.label}`} value={displayVal}>
                      <Text style={s.vgChartVal}>{displayVal}</Text>
                    </AE>
                    {item.arrow && (() => {
                      const cvId = `cv_arrow_${idx}`;
                      const cvOverride = getOverride('ui_panel', 'arrow', cvId);
                      const cvDown = cvOverride ? cvOverride === 'down' : !String(item.arrow).includes('green');
                      return (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                          if (!isAdmin) return;
                          const ch = getActiveChannelForOverrides();
                          const scopedId = ch ? `${ch}_${cvId}` : cvId;
                          sendEditMessage({ id: `ui_panel_arrow_${scopedId}`, label: `Flecha CV ${idx+1} (up o down)`, value: cvDown ? 'down' : 'up', type: 'text', table: 'ui_panel', column: 'arrow', rowId: scopedId });
                        }}>
                          <Image source={cvDown ? require('../../assets/figma/vg_arrow_down_sm.png') : require('../../assets/figma/arrow_green_up.png')} style={s.vgArrow} resizeMode="contain" />
                        </TouchableOpacity>
                      );
                    })()}
                  </View>
                  {item.sub ? <AE isAdmin={isAdmin} table="dashboard_stats" column="views_change_percent" rowId={`vgchartsub_${idx}`} label={`${item.label} - subtexto`} value={item.sub}>
                    <Text style={s.vgChartSub}>{item.sub}</Text>
                  </AE> : null}
                  {isAdmin && <AE isAdmin={isAdmin} table="ui_analytics" column="chart_pattern" rowId={`cv_chart_${idx}`} label={`Patrón gráfica contenido ${idx+1} (1-80): ${cvPatternName}`} value={cvPattern}>
                    <Text style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>{'📈 ' + cvPatternName}</Text>
                  </AE>}
                  <View style={{ marginTop: 12, flex: 1 }}>
                    <DynamicLineChart value={displayVal} xLabels={item.xLabels} height={90} pattern={cvPattern} />
                  </View>
                </View>
              </View>
            );
          })}
        </Carousel>

        {/* Vídeos principales */}
        <View style={s.vgPopCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="cv_principales" label="Título vídeos principales" value="Vídeos principales">
            <Text style={s.vgPopTitle}>Vídeos principales</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="cv_principales_sub" label="Sub vídeos principales" value="Visualizaciones · Últimos 28 dias">
            <Text style={s.vgPopSub}>Visualizaciones · Últimos 28 dias</Text>
          </AE>
          {CV_VIDEOS.map((vid, i) => (
            <View key={i} style={s.vgPopRow}>
              <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId={`cvvid_${i}`} label={`Thumbnail vídeo principal ${i+1}`} value="" type="image">
                <Image source={vid.thumb} style={s.vgPopThumb} resizeMode="cover" />
              </AE>
              <AE isAdmin={isAdmin} table="videos" column="title" rowId={`cvvid_${i}`} label={`Título vídeo principal ${i+1}`} value={vid.title}>
                <Text style={s.vgPopVidTitle} numberOfLines={1}>{vid.title}</Text>
              </AE>
              <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={`cvvid_${i}`} label={`Views vídeo principal ${i+1}`} value={vid.views}>
                <Text style={s.vgPopViews}>{vid.views}</Text>
              </AE>
            </View>
          ))}
        </View>

        {/* Bottom bar */}
        <View style={s.cvBottomBar}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="cv_bottom" label="Texto inferior contenido" value="Cómo encuentran tus vídeos los">
            <Text style={s.cvBottomText}>Cómo encuentran tus vídeos los</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="link" rowId="cv_bottom" label="Link inferior contenido" value="Términos">
            <Text style={s.cvBottomLink}>Términos</Text>
          </AE>
        </View>
      </>
    );
  }

  /* ── "Vista General" content ── */

  function VistaGeneralContent() {
    return (
      <>
        {/* Chart cards carousel — 72% width, 6pt gap to peek next card */}
        <Carousel itemWidth={Math.round(screenW * 0.75)}>
          {VG_CHARTS.map((item, idx) => {
            const overrideVal = getOverride('dashboard_stats', 'views', `cvchart_${idx}`);
            const displayVal = overrideVal || item.value;
            const vgPattern = getOverride('ui_analytics', 'chart_pattern', `vg_chart_${idx}`) || '1';
            const vgPatternName = PATTERN_LIST.find(p => p.id === vgPattern)?.name || 'Estable';
            return (
              <View key={idx} style={s.vgChartOuter}>
                <View style={s.vgChartCardFixed}>
                  <AE isAdmin={isAdmin} table="ui_analytics" column="chart_label" rowId={`vg_label_${idx}`} label={`Etiqueta gráfica VG: ${item.label}`} value={item.label}>
                    <Text style={s.vgChartLabel}>{item.label}</Text>
                  </AE>
                  <View style={s.vgValRow}>
                    <AE isAdmin={isAdmin} table="dashboard_stats" column="views" rowId={`cvchart_${idx}`} label={`${item.label}`} value={displayVal}>
                      <Text style={s.vgChartVal}>{displayVal}</Text>
                    </AE>
                    {item.arrow && (() => {
                      const aId = `vg_arrow_${idx}`;
                      const aOverride = getOverride('ui_panel', 'arrow', aId);
                      const aDown = aOverride ? aOverride === 'down' : !String(item.arrow).includes('green');
                      return (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                          if (!isAdmin) return;
                          const ch = getActiveChannelForOverrides();
                          const scopedId = ch ? `${ch}_${aId}` : aId;
                          sendEditMessage({ id: `ui_panel_arrow_${scopedId}`, label: `Flecha VG ${idx+1} (up o down)`, value: aDown ? 'down' : 'up', type: 'text', table: 'ui_panel', column: 'arrow', rowId: scopedId });
                        }}>
                          <Image source={aDown ? require('../../assets/figma/vg_arrow_down_sm.png') : require('../../assets/figma/arrow_green_up.png')} style={s.vgArrow} resizeMode="contain" />
                        </TouchableOpacity>
                      );
                    })()}
                  </View>
                  {item.sub ? <AE isAdmin={isAdmin} table="dashboard_stats" column="views_change_percent" rowId={`vgchartsub_${idx}`} label={`${item.label} - subtexto`} value={item.sub}>
                    <Text style={[s.vgChartSub, item.subGreen && { color: '#508650' }]}>{item.sub}</Text>
                  </AE> : null}
                  {isAdmin && <AE isAdmin={isAdmin} table="ui_analytics" column="chart_pattern" rowId={`vg_chart_${idx}`} label={`Patrón gráfica VG ${idx+1} (1-80): ${vgPatternName}`} value={vgPattern}>
                    <Text style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>{'📈 ' + vgPatternName}</Text>
                  </AE>}
                  <View style={{ marginTop: 12, flex: 1 }}>
                    <DynamicLineChart value={displayVal} xLabels={item.xLabels} height={90} pattern={vgPattern} />
                  </View>
                </View>
              </View>
            );
          })}
        </Carousel>

        {/* Tips carousel — 75% width like chart cards */}
        <Carousel itemWidth={Math.round(screenW * 0.75)}>
          {VG_TIPS.map((item, idx) => (
            <View key={idx} style={s.vgTipOuter}>
              <View style={s.vgTipCardFull}>
                {item.fullImg ? (
                  <Image source={item.fullImg} style={s.vgTipFullImg} resizeMode="contain" />
                ) : (
                  <View style={s.vgTipCodeCard}>
                    <Text style={s.vgTipCodeTitle}>{item.title}</Text>
                    <Image source={item.icon} style={s.vgTipCodeImg} resizeMode="contain" />
                  </View>
                )}
              </View>
            </View>
          ))}
        </Carousel>

        {/* Contenido más popular — inside shadow card */}
        <TouchableOpacity activeOpacity={0.7} onPress={() => !isAdmin && setShowPopularContent(true)}>
        <View style={s.vgPopCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="vg_popular" label="Título contenido más popular" value="Contenido mas popular">
            <Text style={s.vgPopTitle}>Contenido mas popular</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="vg_popular_sub" label="Sub contenido más popular" value="Visualizaciones · Últimos 28 dias">
            <Text style={s.vgPopSub}>Visualizaciones · Últimos 28 dias</Text>
          </AE>
          {VG_POPULAR.map((vid, i) => (
            <View key={i}>
              <View style={s.vgPopRow}>
                <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId={`vgpop_thumb_${i}`} label={`Thumbnail popular ${i+1}`} value="" type="image">
                  <Image source={vid.thumb} style={s.vgPopThumb} resizeMode="cover" />
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="title" rowId={`vgpop_${i}`} label={`Título popular ${i+1}`} value={vid.title}>
                  <Text style={s.vgPopVidTitle} numberOfLines={1}>{vid.title}</Text>
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={`vgpop_${i}`} label={`Views popular ${i+1}`} value={vid.views}>
                  <Text style={s.vgPopViews}>{vid.views}</Text>
                </AE>
              </View>
              </View>
          ))}
        </View>
        </TouchableOpacity>
      </>
    );
  }

  /* ── "Supers" content ── */

  const supersCharts = [
    { label: 'Ingresos estimados', value: '0 €', yLabels: ['0 €', '0 €', '0 €', '0 €'] },
    { label: 'Compras', value: '0', yLabels: ['3', '2', '1', '0'] },
  ];

  function SupersContent() {
    return (
      <>
        <Carousel>
          {supersCharts.map((item, idx) => (
            <View key={idx} style={s.vgCardPad}>
              <View style={s.carouselCard}>
                <Text style={s.chartLabel}>{item.label}</Text>
                <Text style={s.chartValue}>{item.value}</Text>
                <View style={[s.chartArea, { overflow: 'hidden' }]}>
                  <View style={s.yAxisLabels}>
                    {item.yLabels.map((l, i) => <Text key={i} style={s.axisText}>{l}</Text>)}
                  </View>
                  <View style={[s.chartSvgWrap, { overflow: 'hidden' }]}>
                    <View style={s.gridContainer}>
                      {[0, 1, 2, 3].map(i => <View key={i} style={[s.gridLine, { top: i * (chartH / 3) }]} />)}
                    </View>
                    <View style={[s.svgLayer, { overflow: 'hidden' }]}>
                      <Svg width={screenW - 100} height={chartH}>
                        <Polyline points={`0,${chartH - 2} ${screenW - 100},${chartH - 2}`} fill="none" stroke={TEAL} strokeWidth="2.5" />
                      </Svg>
                    </View>
                  </View>
                </View>
                <View style={s.xAxisRow}>
                  <Text style={s.axisText}>{firstDate}</Text>
                  <Text style={s.axisText}>{lastDate}</Text>
                </View>
              </View>
            </View>
          ))}
        </Carousel>

        {/* How supers generate money */}
        <View style={s.earningsCard}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="supers_title" label="Título Supers" value="Cómo generan dinero los Supers y los regalos">
            <Text style={s.earningsTitle}>Cómo generan dinero los Supers y los regalos</Text>
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="subtitle" rowId="supers_sub" label="Sub Supers" value="Estimación · Últimos 28 días">
            <Text style={s.earningsSub}>Estimación · Últimos 28 días</Text>
          </AE>
          <View style={s.noDataBox}>
            <Image source={require('../../assets/figma/info_icon.png')} style={s.noDataInfoIcon} resizeMode="contain" />
            <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="supers_nodata" label="Texto sin datos Supers" value="No hay nada que mostrar para estas fechas">
              <Text style={s.noDataText}>No hay nada que mostrar para estas fechas</Text>
            </AE>
          </View>
        </View>
      </>
    );
  }

  /* ── Video detail view (from popular content) ── */
  const VIDEO_DETAIL_TABS = ['Vista General', 'Cobertura', 'Interaccion', 'Audiencia', 'Ingresos'];

  if (showVideoDetail !== null) {
    const vid = POP_VIDEOS[showVideoDetail];
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header with thumbnail + title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, gap: 10 }}>
          <TouchableOpacity onPress={() => setShowVideoDetail(null)} hitSlop={12}>
            <Image source={require('../../assets/figma/popv2_back_arrow.png')} style={s.ieBackArrow} resizeMode="contain" />
          </TouchableOpacity>
          <Image source={vid.thumb} style={{ width: 50, height: 28, borderRadius: 4 }} resizeMode="cover" />
          <Text style={{ flex: 1, fontSize: 19, fontWeight: '700', color: '#272727' }} numberOfLines={1}>{vid.title}</Text>
        </View>

        {/* Sub-tabs */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#dcdcdc' }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }} style={{ flexGrow: 0 }}>
            {VIDEO_DETAIL_TABS.map((tab, i) => (
              <TouchableOpacity key={tab} onPress={() => setVideoDetailTab(i)} style={{ paddingHorizontal: 10, paddingTop: 12, paddingBottom: 10, position: 'relative' }}>
                <Text style={{ fontSize: 15, fontWeight: videoDetailTab === i ? '500' : '400', color: videoDetailTab === i ? '#232323' : '#6d6d6d' }}>{tab}</Text>
                {videoDetailTab === i && <View style={{ position: 'absolute', bottom: 0, left: 10, right: 10, height: 3, backgroundColor: '#232323', borderRadius: 1.5 }} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
          {videoDetailTab === 0 && <>
          {/* Summary text */}
          <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 }}>
            <Text style={{ fontSize: 19, fontWeight: '700', color: '#232323', lineHeight: 26, textAlign: 'center' }}>
              Este vídeo ha recibido 2.149{'\n'}visualizaciones desde que se publico
            </Text>
          </View>

          {/* Charts carousel */}
          <Carousel itemWidth={Math.round(screenW * 0.75)}>
            {/* Views chart card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#727272' }}>Visualizaciones</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>2,1K</Text>
                  <Image source={require('../../assets/figma/popv2_arrow_up.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '400', color: '#488248', marginTop: 1 }}>449 mas de lo habitual</Text>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 30, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>2,1K</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>1,4K</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>720</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/popv2_chart_views.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#767676' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7c7c7c' }}>31 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Watch time chart card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Tiempo de visualizacion (horas)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>138</Text>
                  <Image source={require('../../assets/figma/popv7_arrow_green.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '400', color: '#9d9d9d', marginTop: 1 }}>Casi igual que siempre</Text>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 28, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#737373' }}>200</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#737373' }}>133</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>66,6</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#797979' }}>0,0</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/popv7_chart_watchtime.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>61 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Suscriptores chart card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Suscriptores</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>-3</Text>
                </View>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 22, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>-2</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>-4</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>-6</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/popv6_chart_subs.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>61 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Ingresos estimados chart card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Ingresos estimados</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>9,31€</Text>
                  <Image source={require('../../assets/figma/popv5_arrow_ingresos.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 32, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>9,60€</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>6,40€</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>3,20€</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0€</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/popv5_chart_ingresos.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>18mar</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>19 abr</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Carousel>

          {/* Usuarios simultaneos */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Usuarios simultaneos</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1b1b1b' }}>80</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Pico • Durante la emisión en directo</Text>
            <View style={{ marginTop: 10, flexDirection: 'row', height: 120 }}>
              <View style={{ width: 22, justifyContent: 'space-between', paddingRight: 2 }}>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#727272' }}>90</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#7a7a7a' }}>60</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#747474' }}>30</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#747474' }}>0</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Image source={require('../../assets/figma/popv2_chart_users.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 22, marginTop: -4 }}>
              <Text style={{ fontSize: 10, fontWeight: '400', color: '#6e6e6e' }}>0:00</Text>
              <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>19:00</Text>
            </View>
          </View>

          {/* Retención de la audiencia */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Retención de la audiencia</Text>
              <Text style={{ fontSize: 16, fontWeight: '400', color: '#282828' }}>6:01(34,0 %)</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#737373', marginTop: 4 }}>Duracion media de las visualizaciones · Total</Text>
            <View style={{ height: 1, backgroundColor: '#e4e4e4', marginTop: 12 }} />
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#313131', marginTop: 12 }}>Momentos clave de retencion de la audiencia</Text>
            {/* Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 6 }}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#0e0e0e' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#e6e6e6' }}>Introducción</Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f1f2f2' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2a2a2a' }}>2 momentos destacados</Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f1f2f2' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e1e1e' }}>Pico</Text>
              </View>
            </ScrollView>
            {/* Chart */}
            <View style={{ marginTop: 10, flexDirection: 'row', height: 110 }}>
              <View style={{ width: 30, justifyContent: 'space-between', paddingRight: 3 }}>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>100%</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#737373' }}>66 %</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#767676' }}>33 %</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#717171' }}>0%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Image source={require('../../assets/figma/popv3_chart_retention.png')} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 30, marginTop: 2 }}>
              <Text style={{ fontSize: 10, fontWeight: '400', color: '#727272' }}>0:00</Text>
              <Text style={{ fontSize: 10, fontWeight: '400', color: '#707070' }}>17:42</Text>
            </View>
            {/* Info box */}
            <View style={{ backgroundColor: '#f2f2f2', borderRadius: 10, padding: 14, marginTop: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#2f2f2f', lineHeight: 20 }}>El 49 % de los usuarios ha seguido viendo el video despues de llegar a la marca de tiempo 0:30, lo cual esta por debajo de la media</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
          </>}

          {videoDetailTab === 1 && <>
          {/* ── Cobertura tab ── */}
          <Carousel itemWidth={Math.round(screenW * 0.75)}>
            {/* Impresiones card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Impresiones</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>10,4K</Text>
                </View>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 36, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>10,5 K</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>7,0K</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>3,5K</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/cob_chart_impresiones.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>31 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Porcentaje de clics de las impresiones card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Porcentaje de clics de las impresiones</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>13.0 %</Text>
                </View>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 36, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>21,0%</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>14,0%</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>7,0 %</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0,0 %</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/cob_v2_chart_ctr.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>32 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Visualizaciones card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Visualizaciones</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>2,1K</Text>
                  <Image source={require('../../assets/figma/cob_v3_arrow.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '400', color: '#488248', marginTop: 1 }}>451 mas de lo habitual</Text>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 28, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>2,1K</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>1,4K</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>720</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/cob_v3_chart_views.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>32 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Usuarios unicos card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Usuarios unicos</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>1,2K</Text>
                  <Image source={require('../../assets/figma/cob_v4_arrow.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 28, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>540</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>360</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>180</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/cob_v4_chart_users.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>18 mar</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>20 abr</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Carousel>

          {/* Como encuentran este vídeo los usuarios */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Como encuentran este vídeo los usuarios</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Visualizaciones · Desde la publicacion</Text>
            {/* Colored source bar */}
            <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginTop: 14 }}>
              <View style={{ flex: 41.3, backgroundColor: '#1a1a4e' }} />
              <View style={{ flex: 24.4, backgroundColor: '#5b5bb5' }} />
              <View style={{ flex: 9.9, backgroundColor: '#9a9ad4' }} />
              <View style={{ flex: 9.5, backgroundColor: '#a855a8' }} />
              <View style={{ flex: 14.9, backgroundColor: '#a0a0a0' }} />
            </View>
            {/* Source list */}
            {[
              { color: '#1a1a4e', label: 'Funciones de exploracion', pct: '41,3 %' },
              { color: '#5b5bb5', label: 'Paginas de canal', pct: '24.4 %' },
              { color: '#9a9ad4', label: 'Directa o desconocida', pct: '9.9 %' },
              { color: '#a855a8', label: 'Notificaciones', pct: '9.5 %' },
              { color: '#a0a0a0', label: 'Otros', pct: '14,9%' },
            ].map((src, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: src.color, marginRight: 10 }} />
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{src.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{src.pct}</Text>
              </View>
            ))}
          </View>

          {/* Sitios o aplicaciones de terceros */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Sitios o aplicaciones de terceros</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Visualizaciones · Desde la publicacion</Text>
            {[
              { label: 'WhatsApp', pct: '24.6 %', bar: 1.0 },
              { label: 'Google Search', pct: '14.8 %', bar: 0.6 },
              { label: 'discord.com', pct: '14,8%', bar: 0.6 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  <View style={{ height: 6, backgroundColor: '#4a4ab5', borderRadius: 3, width: `${item.bar * 100}%` }} />
                </View>
                {i < 2 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16 }} />}
              </View>
            ))}
          </View>

          {/* Términos de búsqueda de YouTube */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Términos de busqueda de YouTube</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Visualizaciones · Desde la publicacion</Text>
            {[
              { label: 'flork', pct: '23.6 %', bar: 1.0 },
              { label: 'ceocrypto', pct: '11,2 %', bar: 0.47 },
              { label: 'dump', pct: '1.1%', bar: 0.05 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  <View style={{ height: 6, backgroundColor: '#4a4ab5', borderRadius: 3, width: `${item.bar * 100}%` }} />
                </View>
                {i < 2 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16 }} />}
              </View>
            ))}
          </View>

          {/* Contenido donde se sugiere este vídeo */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Contenido donde se sugiere este vídeo</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Visualizaciones · Desde la publicacion</Text>
            {[
              { thumb: require('../../assets/figma/cob_v6_thumb1.png'), title: 'Blender 5.0 Masterclass - de CERO...', pct: '11,4%' },
              { thumb: require('../../assets/figma/cob_v6_thumb2.png'), title: 'Organice un Concurso Entre Youtub...', pct: '5.7 %' },
              { thumb: require('../../assets/figma/cob_v6_thumb3.png'), title: 'Vole en el asiento de $15,000 con d...', pct: '5.7 %' },
              { thumb: require('../../assets/figma/cob_v6_thumb4.png'), title: 'FINAL RESIDENT EVIL 4 Remake #6...', pct: '5.7 %' },
              { thumb: require('../../assets/figma/cob_v6_thumb5.png'), title: '10 CLONAZOS ARABES MUY PAREC...', pct: '2.9 %' },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, paddingBottom: i < 4 ? 14 : 0, borderBottomWidth: i < 4 ? 1 : 0, borderBottomColor: '#ebebeb' }}>
                <Image source={item.thumb} style={{ width: 56, height: 32, borderRadius: 4, marginRight: 10 }} resizeMode="cover" />
                <Text style={{ flex: 1, fontSize: 13, fontWeight: '400', color: '#2a2a2a' }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a', marginLeft: 8 }}>{item.pct}</Text>
              </View>
            ))}
          </View>

          {/* Listas de reproducción que incluyen este vídeo */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Listas de reproduccion que incluyen este{'\n'}vídeo</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Visualizaciones · Desde la publicacion</Text>
            <View style={{ backgroundColor: '#f2f2f2', borderRadius: 10, padding: 14, marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../assets/figma/cob_v6_info_icon.png')} style={{ width: 22, height: 22, marginRight: 10 }} resizeMode="contain" />
              <Text style={{ flex: 1, fontSize: 13, fontWeight: '400', color: '#2f2f2f', lineHeight: 18 }}>No hay suficientes datos sobre el trafico para mostrar este informe</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
          </>}

          {videoDetailTab === 2 && <>
          {/* ── Interaccion tab ── */}
          <Carousel itemWidth={Math.round(screenW * 0.75)}>
            {/* Tiempo de visualización card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Tiempo de visualizacion (horas)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>215</Text>
                  <Image source={require('../../assets/figma/int_v1_arrow_watchtime.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '400', color: '#488248', marginTop: 1 }}>45,1 mas de lo habitual</Text>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 28, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>216</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>144</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>72,2</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0,0</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/int_v1_chart_watchtime.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>32 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Duración media de las visualizaciones card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Duracion media de las visualizaciones</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>6:00</Text>
                  <Image source={require('../../assets/figma/int_v3_arrow_duration.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '400', color: '#9d9d9d', marginTop: 1 }}>Casi igual que siempre</Text>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 28, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>7:00</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>4:40</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>2:20</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0:00</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/int_v3_chart_duration.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>32 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Carousel>

          {/* Hype */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Hype</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Primeros 7 dias</Text>
            <View style={{ flexDirection: 'row', marginTop: 16, gap: 30 }}>
              <View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: '#161616' }}>0</Text>
                <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Puntos hype</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#e4e4e4' }} />
              <View>
                <Text style={{ fontSize: 22, fontWeight: '700', color: '#161616' }}>0</Text>
                <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Hypes</Text>
              </View>
            </View>
          </View>

          {/* Retención de la audiencia */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Retención de la audiencia</Text>
              <Text style={{ fontSize: 16, fontWeight: '400', color: '#282828' }}>6:01(34,0 %)</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#737373', marginTop: 4 }}>Duracion media de las visualizaciones · Total</Text>
            <View style={{ height: 1, backgroundColor: '#e4e4e4', marginTop: 12 }} />
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#313131', marginTop: 12 }}>Momentos clave de retencion de la audiencia</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 6 }}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#0e0e0e' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#e6e6e6' }}>Introducción</Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f1f2f2' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2a2a2a' }}>2 momentos destacados</Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f1f2f2' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e1e1e' }}>Pico</Text>
              </View>
            </ScrollView>
            <View style={{ marginTop: 10, flexDirection: 'row', height: 140 }}>
              <View style={{ width: 30, justifyContent: 'space-between', paddingRight: 3 }}>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>100%</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#737373' }}>66 %</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>33 %</Text>
                <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0 %</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Image source={require('../../assets/figma/int_v2_chart_retention.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                  <Text style={{ fontSize: 10, fontWeight: '400', color: '#727272' }}>0:00</Text>
                  <Text style={{ fontSize: 10, fontWeight: '400', color: '#707070' }}>17:42</Text>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: '#f2f2f2', borderRadius: 10, padding: 14, marginTop: 14 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#2f2f2f', lineHeight: 20 }}>El 49 % de los usuarios ha seguido viendo el video despues de llegar a la marca de tiempo 0:30, lo cual esta por debajo de la media</Text>
            </View>
          </View>

          {/* Me gusta (vs. No me gusta) */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Me gusta (vs. No me gusta)</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Desde la publicacion</Text>
            {[
              { label: 'Tutorial BRIDGE FLORK a DUMP (Paso a paso)', pct: '92.4%', bar: 1.0 },
              { label: 'Media del canal', pct: '90.4 %', bar: 0.98 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }} numberOfLines={1}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a', marginLeft: 8 }}>{item.pct}</Text>
                </View>
                <View style={{ height: 8, backgroundColor: '#e8e8e8', borderRadius: 4, marginTop: 8 }}>
                  <View style={{ height: 8, backgroundColor: '#e84393', borderRadius: 4, width: `${item.bar * 100}%` }} />
                </View>
                {i === 0 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 18 }} />}
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
          </>}

          {videoDetailTab === 3 && <>
          {/* ── Audiencia tab ── */}
          <Carousel itemWidth={Math.round(screenW * 0.75)}>
            {/* Usuarios únicos card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Usuarios unicos</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>1,2K</Text>
                  <Image source={require('../../assets/figma/aud_v1_arrow_users.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
                </View>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 28, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>540</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>360</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>180</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/aud_v1_chart_users.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>18 mar</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>20 abr</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* Suscriptores card */}
            <View style={{ paddingLeft: 14, paddingRight: 6, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Suscriptores</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>+2</Text>
                </View>
                <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                  <View style={{ width: 22, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>4</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>2</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>-2</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image source={require('../../assets/figma/aud_v2_chart_subs.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>0</Text>
                      <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>32 dias</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Carousel>

          {/* Audiencia por comportamiento de visualización */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020', flex: 1 }}>Audiencia por comportamiento de{'\n'}visualización</Text>
              <Image source={require('../../assets/figma/aud_v1_info_icon.png')} style={{ width: 16, height: 16 }} resizeMode="contain" />
            </View>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Usuarios unicos · Desde la publicacion</Text>
            {/* Colored bar */}
            <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginTop: 14 }}>
              <View style={{ flex: 63.6, backgroundColor: '#1a1a4e' }} />
              <View style={{ flex: 26.1, backgroundColor: '#5b5bb5' }} />
              <View style={{ flex: 10.2, backgroundColor: '#d4a5d4' }} />
            </View>
            {[
              { color: '#1a1a4e', label: 'Usuarios nuevos', pct: '10.2 %' },
              { color: '#5b5bb5', label: 'Usuarios ocasionales', pct: '26.1%' },
              { color: '#d4a5d4', label: 'Usuarios habituales', pct: '63.6 %' },
            ].map((src, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: src.color, marginRight: 10 }} />
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{src.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{src.pct}</Text>
              </View>
            ))}
          </View>

          {/* Los usuarios también ven */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Los usuarios también ven</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Ultimos 90 dias</Text>
            {[
              { thumb: require('../../assets/figma/aud_v3_thumb1.png'), title: 'CALCULA TU TIER & RELLENA el FORMULARI...', sub: 'CEOCRYPTO|...·4,0 K visualizaciones·hace 2 meses' },
              { thumb: require('../../assets/figma/aud_v3_thumb2.png'), title: 'Bridge de FLORK a DUMP + PROYECTO OPO...', sub: 'CEOCRYPTO|M....2,2 K visualizaciones.hace 1 mes' },
              { thumb: require('../../assets/figma/aud_v3_thumb3.png'), title: 'Descubre en que TlER calificas y como hacer...', sub: 'CEOCRYPTO|....2,1 K visualizaciones. hace 3 meses' },
              { thumb: require('../../assets/figma/aud_v3_thumb4.png'), title: 'Así fue el lanzamiento de $Awl I Como crear...', sub: 'CEOCRYPTO |...·1,4 K visualizaciones ·hace 2 meses' },
              { thumb: require('../../assets/figma/aud_v3_thumb5.png'), title: 'TODO SOBRE FLORK Y DUMPFUN', sub: 'CEOCRYPTO|...·4,1 K visualizaciones·hace 4 meses' },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', marginTop: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#ebebeb' }}>
                <Image source={item.thumb} style={{ width: 56, height: 32, borderRadius: 4, marginRight: 10 }} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: '#2a2a2a' }} numberOfLines={1}>{item.title}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '400', color: '#777777', marginTop: 2 }} numberOfLines={1}>{item.sub}</Text>
                </View>
              </View>
            ))}
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 10 }}>y 10 mas</Text>
          </View>

          {/* Tipo de dispositivo */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Tipo de dispositivo</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Tiempo de visualizacion (horas) · Desde la publicacion</Text>
            {/* Colored bar */}
            <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginTop: 14 }}>
              <View style={{ flex: 51.6, backgroundColor: '#1a1a4e' }} />
              <View style={{ flex: 37.7, backgroundColor: '#5b5bb5' }} />
              <View style={{ flex: 9.2, backgroundColor: '#9a9ad4' }} />
              <View style={{ flex: 1.6, backgroundColor: '#d4a5d4' }} />
            </View>
            {[
              { color: '#1a1a4e', label: 'Movil', pct: '51,6 %' },
              { color: '#5b5bb5', label: 'Ordenador', pct: '37.7%' },
              { color: '#9a9ad4', label: 'Television', pct: '9.2%' },
              { color: '#d4a5d4', label: 'Tablet', pct: '1,6 %' },
            ].map((src, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: src.color, marginRight: 10 }} />
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{src.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{src.pct}</Text>
              </View>
            ))}
          </View>

          {/* Edad */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Edad</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Desde la publicacion ·Visualizaciones</Text>
            {[
              { label: 'Entre 13 y 17 anos', pct: '0,0%', bar: 0 },
              { label: 'Entre 18 y 24 anos', pct: '5,6 %', bar: 0.056 },
              { label: 'Entre 25 y 34 anos', pct: '38.7%', bar: 0.387 },
              { label: 'Entre 35 y 44 anos', pct: '37.7 %', bar: 0.377 },
              { label: 'Entre 45 y 54 anos', pct: '13.8 %', bar: 0.138 },
              { label: 'Entre 55 y 64 anos', pct: '4.2%', bar: 0.042 },
              { label: 'Mas de 65 anos', pct: '0,0%', bar: 0 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  {item.bar > 0 && <View style={{ height: 6, backgroundColor: '#7b2d8e', borderRadius: 3, width: `${item.bar * 100}%` }} />}
                </View>
                {i < 6 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16 }} />}
              </View>
            ))}
          </View>

          {/* Sexo */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Sexo</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Desde la publicacion ·Visualizaciones</Text>
            {[
              { label: 'Hombre', pct: '100,0%', bar: 1.0 },
              { label: 'Mujer', pct: '0,0%', bar: 0 },
              { label: 'Especificado por el usuario', pct: '0,0%', bar: 0 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  {item.bar > 0 && <View style={{ height: 6, backgroundColor: '#7b2d8e', borderRadius: 3, width: `${item.bar * 100}%` }} />}
                </View>
                {i < 2 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16 }} />}
              </View>
            ))}
          </View>

          {/* Regiones geográficas principales */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Regiones geograficas principales</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Visualizaciones · Desde la publicacion</Text>
            {[
              { label: 'Espana', pct: '25.7%', bar: 1.0 },
              { label: 'Argentina', pct: '11,1%', bar: 0.43 },
              { label: 'México', pct: '8.4%', bar: 0.33 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  <View style={{ height: 6, backgroundColor: '#7b2d8e', borderRadius: 3, width: `${item.bar * 100}%` }} />
                </View>
                {i < 2 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16 }} />}
              </View>
            ))}
          </View>

          {/* Idiomas de subtítulos principales */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Idiomas de subtítulos principales</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Visualizaciones · Desde la publicacion</Text>
            {[
              { label: 'Sin subtítulos', pct: '89.0 %', bar: 1.0 },
              { label: 'espanol', pct: '10.9%', bar: 0.12 },
              { label: 'ingles (traduccion automatica)', pct: '0,0%', bar: 0.005 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  <View style={{ height: 6, backgroundColor: '#7b2d8e', borderRadius: 3, width: `${item.bar * 100}%` }} />
                </View>
                {i < 2 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16 }} />}
              </View>
            ))}
          </View>

          {/* Tiempo de visualización de los suscriptores */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Tiempo de visualización de los suscriptores</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Tiempo de visualizacion (horas) · Desde la publicacion</Text>
            {[
              { label: 'Suscritos', pct: '87.3 %', bar: 1.0 },
              { label: 'No suscrito', pct: '12.7%', bar: 0.145 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  <View style={{ height: 6, backgroundColor: '#7b2d8e', borderRadius: 3, width: `${item.bar * 100}%` }} />
                </View>
                {i < 1 && <View style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16 }} />}
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
          </>}

          {videoDetailTab === 4 && <>
          {/* ── Ingresos tab ── */}
          {/* Ingresos estimados chart card */}
          <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
            <View style={{ backgroundColor: C.cardBg, borderRadius: 12, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, height: 210, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6f6f6f' }}>Ingresos estimados</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Text style={{ fontSize: 23, fontWeight: '700', color: '#161616' }}>9,34€</Text>
                <Image source={require('../../assets/figma/ing_v1_arrow.png')} style={{ width: 17, height: 17 }} resizeMode="contain" />
              </View>
              <View style={{ marginTop: 6, flexDirection: 'row', flex: 1 }}>
                <View style={{ width: 32, justifyContent: 'space-between', paddingRight: 3, marginBottom: 14 }}>
                  <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>9,60€</Text>
                  <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>6,40€</Text>
                  <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>3,20€</Text>
                  <Text style={{ fontSize: 10, fontWeight: '400', color: '#757575' }}>0€</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Image source={require('../../assets/figma/ing_v1_chart.png')} style={{ width: '100%', flex: 1 }} resizeMode="stretch" />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#777777' }}>18 mar</Text>
                    <Text style={{ fontSize: 10, fontWeight: '400', color: '#7b7b7b' }}>20abr</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Como ganas dinero */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Como ganas dinero</Text>
              <Image source={require('../../assets/figma/ing_v1_info_icon.png')} style={{ width: 16, height: 16 }} resizeMode="contain" />
            </View>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Estimacion · Desde la publicacion</Text>
            {/* Colored bar */}
            <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginTop: 14 }}>
              <View style={{ flex: 96.1, backgroundColor: '#0d9488' }} />
              <View style={{ flex: 3.9, backgroundColor: '#11857a' }} />
            </View>
            {[
              { color: '#0d9488', label: 'Anuncios de la pagina de visualizacion', pct: '96,1' },
              { color: '#11857a', label: 'YouTube Premium', pct: '3.9%' },
            ].map((src, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: src.color, marginRight: 10 }} />
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{src.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{src.pct}</Text>
              </View>
            ))}
          </View>

          {/* Rendimiento de los vídeos */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Rendimiento de los vídeos</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Desde la publicacion</Text>
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#161616' }}>9,23 €</Text>
              <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Ingresos estimados</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>Visualizaciones</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>2,1K</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>Ingresos por cada mil{'\n'}visualizaciones (RPM)</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a' }}>4,29€</Text>
            </View>
          </View>

          {/* Cuanto pagan los anunciantes */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Cuanto pagan los anunciantes</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Desde la publicacion</Text>
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#161616' }}>7,32€</Text>
              <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Coste por cada 1000 reproducciones (CPM basado en{'\n'}reproducciones)</Text>
            </View>
          </View>

          {/* Earnings by ad type */}
          <View style={{ backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#202020' }}>Earnings by ad type</Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#777777', marginTop: 2 }}>Ingresos publicitarios de YouTube · Desde la publicacion</Text>
            {[
              { label: 'Anuncios de video saltables (subasta)', pct: '67,3 %', bar: 1.0 },
              { label: 'Anuncios de display (subasta)', pct: '19,3 %', bar: 0.287 },
              { label: 'Anuncios de bumper (subasta)', pct: '8,3 %', bar: 0.123 },
              { label: 'Anuncios de video no saltables (subasta)', pct: '4,5 %', bar: 0.067 },
              { label: 'Anuncios de video no saltables (reservado)', pct: '0.4%', bar: 0.006 },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2a2a2a' }}>{item.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2a2a2a', marginLeft: 8 }}>{item.pct}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: '#e8e8e8', borderRadius: 3, marginTop: 8 }}>
                  <View style={{ height: 6, backgroundColor: '#0d9488', borderRadius: 3, width: `${item.bar * 100}%` }} />
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
          </>}
        </ScrollView>
      </View>
    );
  }

  /* ── Popular content detail view ── */
  if (showPopularContent) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={s.ieHeaderOverlay}>
          <TouchableOpacity onPress={() => setShowPopularContent(false)} hitSlop={12}>
            <Image source={require('../../assets/figma/pop_back_arrow.png')} style={s.ieBackArrow} resizeMode="contain" />
          </TouchableOpacity>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="pop_header" label="Título contenido más popular" value="Contenido mas popular">
            <Text style={s.ieHeaderTitle}>Contenido mas popular</Text>
          </AE>
        </View>
        <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
          {/* Period chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
            {POP_PERIODS.map((p, i) => (
              <React.Fragment key={p}>
                {i === 4 && <View style={s.chipSeparator} />}
                <TouchableOpacity style={[s.chip, popPeriod === i && s.chipActive]} onPress={() => setPopPeriod(i)}>
                  <Text style={[s.chipText, popPeriod === i && s.chipTextActive]}>{p}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
          {/* Date range */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 }}>
            <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="pop_date_range" label="Rango de fechas" value="23 mar-19 abr 2026">
              <Text style={{ fontSize: 12, fontWeight: '400', color: '#757575' }}>23 mar-19 abr 2026</Text>
            </AE>
            <Text style={{ fontSize: 12, fontWeight: '400', color: '#707070' }}>Visualizaciones</Text>
          </View>
          {/* Video list */}
          {POP_VIDEOS.map((vid, i) => {
            const barPct = (vid.views / POP_MAX_VIEWS) * 100;
            return (
              <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => !isAdmin && setShowVideoDetail(i)} style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Image source={vid.thumb} style={vid.isShort ? { width: 32, height: 44, borderRadius: 4, backgroundColor: '#f0f0f0' } : s.vgPopThumb} resizeMode="cover" />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <AE isAdmin={isAdmin} table="videos" column="title" rowId={`pop_vid_${i}`} label={`Título popular ${i+1}`} value={vid.title}>
                        <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: '#2e2e2e' }} numberOfLines={1}>{vid.title}</Text>
                      </AE>
                      <AE isAdmin={isAdmin} table="videos" column="view_count" rowId={`pop_vid_${i}`} label={`Views popular ${i+1}`} value={String(vid.views)}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f1f1f' }}>{vid.views}</Text>
                      </AE>
                    </View>
                    <View style={{ height: 5, backgroundColor: '#f2f2f2', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${barPct}%`, backgroundColor: '#00a7d3', borderRadius: 3 }} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  /* ── Ingresos estimados detail view ── */

  const BAR_LABELS = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'];

  function BarChartView() {
    const periodKey = ['7d','28d','90d','365d','mar','feb','ene','2026','2025','total'][iePeriod] || 'mar';
    const currentBarPatternId = getOverride('ui_analytics', 'bar_pattern', `ie_${periodKey}`) || '4';
    const currentBarPatternName = BAR_PATTERN_LIST.find(p => p.id === currentBarPatternId)?.name || 'Pico diciembre';

    const barTotalOverride = getOverride('revenue', 'ie_summary', `ie_sum_${periodKey}`);
    const barTotal = parseValue(barTotalOverride || '145.93');
    const barData = generateBarData(barTotal, BAR_LABELS, currentBarPatternId);

    const barDataFinal = barData.map((bar, i) => {
      const override = getOverride('revenue', 'bar_value', `bar_${periodKey}_${i}`);
      return override ? { ...bar, value: parseFloat(override.replace(',', '.')) || bar.value } : bar;
    });

    // Compute Y labels for bar chart
    const barMaxVal = Math.max(...barDataFinal.map(d => d.value), 1);
    const barStep = niceStep(barMaxVal);
    const barYMax = Math.ceil(barMaxVal / barStep) * barStep;
    const barYLabels = [
      formatYLabel(barYMax, true),
      formatYLabel(barYMax * 2 / 3, true),
      formatYLabel(barYMax / 3, true),
      '0 €',
    ];

    return (
      <View style={{ marginHorizontal: 16 }}>
        {isAdmin && <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 }}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="bar_pattern" rowId={`ie_${periodKey}`} label={`Patrón barras ${periodKey} (1-80): ${currentBarPatternName}`} value={currentBarPatternId}>
            <View style={{ backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 11, color: '#888' }}>📊 {currentBarPatternName}</Text>
            </View>
          </AE>
        </View>}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 54, justifyContent: 'space-between', paddingRight: 4, height: 170, marginTop: 16 }}>
            {barYLabels.map((label, i) => (
              <AE key={i} isAdmin={isAdmin} table="ui_analytics" column="y_label" rowId={`ie_bar_${periodKey}_y${i}`} label={`Eje Y barras (${periodKey}): ${label}`} value={label}>
                <Text style={{ fontSize: 10, fontWeight: '500', color: '#7a7a7a' }} numberOfLines={1}>{label}</Text>
              </AE>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <DynamicBarChart
              data={barDataFinal}
              height={170}
              hideYLabels
              hideXLabels
              onBarPress={(i) => {
                if (selectedBar === i) setSelectedBar(null);
                else { setSelectedBar(null); setTimeout(() => setSelectedBar(i), 10); }
              }}
              selectedBar={selectedBar}
              tooltipId={`bar_${periodKey}`}
            />
            {/* Editable X-axis labels */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 }}>
              {barDataFinal.map((bar, i) => (
                <AE key={i} isAdmin={isAdmin} table="ui_analytics" column="x_label" rowId={`ie_bar_${periodKey}_x${i}`} label={`Mes barra ${i+1} (${periodKey}): ${bar.label}`} value={bar.label}>
                  <Text style={{ fontSize: 10, fontWeight: '500', color: '#7a7a7a' }}>{bar.label}</Text>
                </AE>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (showIngresosDetail) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Custom header that covers the tab header */}
        <View style={s.ieHeaderOverlay}>
          <TouchableOpacity onPress={() => setShowIngresosDetail(false)} hitSlop={12}>
            <Image source={require('../../assets/figma/ie_back_arrow.png')} style={s.ieBackArrow} resizeMode="contain" />
          </TouchableOpacity>
          <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="ie_header" label="Título detalle ingresos" value="Ingresos estimados">
            <Text style={s.ieHeaderTitle}>Ingresos estimados</Text>
          </AE>
        </View>
      <ScrollView style={s.root} showsVerticalScrollIndicator={false}>

        {/* Period chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
          {IE_PERIODS.map((p, i) => (
            <React.Fragment key={p}>
              {(i === 4 || i === 7 || i === 9) && <View style={s.chipSeparator} />}
              <TouchableOpacity style={[s.chip, iePeriod === i && s.chipActive]} onPress={() => setIePeriod(i)}>
                <Text style={[s.chipText, iePeriod === i && s.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </ScrollView>

        {/* Chart - line chart for 7D/28D/90D/365D, bar chart for months/years/total */}
        {(() => {
          const periodKeys_sum = ['7d', '28d', '90d', '365d', 'mar', 'feb', 'ene', '2026', '2025', 'total'];
          const periodKey_sum = periodKeys_sum[iePeriod] || '28d';
          const ieSumOverride = getOverride('revenue', 'ie_summary', `ie_sum_${periodKey_sum}`);
          const ieSumVal = ieSumOverride || (iePeriod < 4 ? '15,72' : iePeriod === 9 ? '2022,14' : '16,02');

          // Compute Y labels for editable rendering
          const numVal = parseValue(ieSumVal);
          const numPts = iePeriod === 9 ? 60 : 28;
          const dailyMax = numVal / numPts;
          const ieStep = niceStep(dailyMax);
          const ieYMax = Math.ceil(dailyMax / ieStep) * ieStep;
          const ieYLabels = [
            formatYLabel(ieYMax, true),
            formatYLabel(ieYMax * 2 / 3, true),
            formatYLabel(ieYMax / 3, true),
            '0 €',
          ];
          const periodKeys = ['7d', '28d', '90d', '365d', 'mar', 'feb', 'ene', '2026', '2025', 'total'];
          const periodKey = periodKeys[iePeriod] || '28d';
          const chartH_ie = iePeriod < 4 ? 140 : 170;

          function EditableYLabels() {
            return (
              <View style={{ width: 54, justifyContent: 'space-between', paddingRight: 4, height: chartH_ie }}>
                {ieYLabels.map((label, i) => (
                  <AE key={i} isAdmin={isAdmin} table="ui_analytics" column="y_label" rowId={`ie_${periodKey}_y${i}`} label={`Eje Y detalle (${periodKey}): ${label}`} value={label}>
                    <Text style={{ fontSize: 10, fontWeight: '500', color: '#7a7a7a' }} numberOfLines={1}>{label}</Text>
                  </AE>
                ))}
              </View>
            );
          }

          const xLabelsMap: Record<string, string[]> = {
            'total': ['19 sept 2016', '25 jun 2021', '31 mar'],
            '2026': ['1ene', '14 feb', '31 mar'],
            '2025': ['1ene', '14 feb', '31 mar'],
            '7d': ['25 mar', '28 mar', '31 mar'],
            '28d': ['1mar', '14 mar', '28 mar'],
            '90d': ['1ene', '14 feb', '31 mar'],
            '365d': ['1abr 2025', '1oct 2025', '31 mar'],
            'mar': ['1 mar', '15 mar', '31 mar'],
            'feb': ['1 feb', '14 feb', '28 feb'],
            'ene': ['1 ene', '15 ene', '31 ene'],
          };
          const currentXLabels = xLabelsMap[periodKey] || xLabelsMap['28d'];

          function EditableXLabels() {
            return (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 42, marginTop: 4 }}>
                {currentXLabels.map((label, i) => (
                  <AE key={i} isAdmin={isAdmin} table="ui_analytics" column="x_label" rowId={`ie_${periodKey}_x${i}`} label={`Eje X detalle (${periodKey}): ${label}`} value={label}>
                    <Text style={{ fontSize: 10, fontWeight: '500', color: '#7a7a7a' }}>{label}</Text>
                  </AE>
                ))}
              </View>
            );
          }

          const iePattern = getOverride('ui_analytics', 'chart_pattern', `ie_${periodKey}`) || '1';
          const iePatternName = PATTERN_LIST.find(p => p.id === iePattern)?.name || 'Estable';

          function PatternSelector() {
            if (!isAdmin) return null;
            return (
              <AE isAdmin={isAdmin} table="ui_analytics" column="chart_pattern" rowId={`ie_${periodKey}`} label={`Patrón gráfica ${periodKey} (1-80): ${iePatternName}`} value={iePattern}>
                <Text style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>{'📈 ' + iePatternName}</Text>
              </AE>
            );
          }

          if (iePeriod === 9) {
            return (
              <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <PatternSelector />
                <View style={{ flexDirection: 'row' }}>
                  <EditableYLabels />
                  <View style={{ flex: 1 }}>
                    <DynamicLineChart value={ieSumVal} height={170} numPoints={60} color="#1db4a5" hideYLabels hideXLabels pattern={iePattern} tooltipId={`ie_${periodKey}`} />
                  </View>
                </View>
                <EditableXLabels />
              </View>
            );
          } else if (iePeriod >= 7 && iePeriod <= 8) {
            return (
              <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <PatternSelector />
                <View style={{ flexDirection: 'row' }}>
                  <EditableYLabels />
                  <View style={{ flex: 1 }}>
                    <DynamicLineChart value={ieSumVal} height={170} color="#1db4a5" hideYLabels hideXLabels pattern={iePattern} tooltipId={`ie_${periodKey}`} />
                  </View>
                </View>
                <EditableXLabels />
              </View>
            );
          } else if (iePeriod < 4) {
            return (
              <View style={{ marginHorizontal: 16, marginTop: 8 }}>
                <PatternSelector />
                <View style={{ flexDirection: 'row' }}>
                  <EditableYLabels />
                  <View style={{ flex: 1 }}>
                    <DynamicLineChart value={ieSumVal} height={140} color="#1db4a5" hideYLabels hideXLabels pattern={iePattern} tooltipId={`ie_${periodKey}`} />
                  </View>
                </View>
                <EditableXLabels />
              </View>
            );
          } else {
            return <BarChartView />;
          }
        })()}

        {/* Summary */}
        <View style={s.ieSummary}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="icon" rowId="ie_dot" label="Icono punto verde" value="" type="image">
            <Image source={require('../../assets/figma/ie_dot_green.png')} style={s.ieDot} resizeMode="contain" />
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="label" rowId="ie_sum_label" label="Label resumen ingresos" value="Ingresos estimados">
            <Text style={s.ieSumLabel}>Ingresos estimados</Text>
          </AE>
          {(() => {
            const sumPeriodKeys = ['7d', '28d', '90d', '365d', 'mar', 'feb', 'ene', '2026', '2025', 'total'];
            const sumPeriodKey = sumPeriodKeys[iePeriod] || '28d';
            const sumOverride = getOverride('revenue', 'ie_summary', `ie_sum_${sumPeriodKey}`);
            const sumVal = sumOverride || (iePeriod < 4 ? '15,72' : iePeriod === 9 ? '2022,14' : '16,02');
            return (
              <AE isAdmin={isAdmin} table="revenue" column="ie_summary" rowId={`ie_sum_${sumPeriodKey}`} label={`Ingresos estimados resumen (${sumPeriodKey})`} value={sumVal}>
                <Text style={s.ieSumValue}>{sumVal} €</Text>
              </AE>
            );
          })()}
        </View>

        {/* Processing message for monthly views */}
        {iePeriod >= 4 && (
          <View style={s.ieProcessingRow}>
            <AE isAdmin={isAdmin} table="ui_analytics" column="icon" rowId="ie_clock" label="Icono reloj procesando" value="" type="image">
              <Image source={require('../../assets/figma/ie_clock.png')} style={{ width: 22, height: 22 }} resizeMode="contain" />
            </AE>
            <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="ie_processing" label="Texto procesando datos" value="Aún se está procesando 1 día de datos">
              <Text style={s.ieProcessingText}>Aún se está procesando 1 día de datos</Text>
            </AE>
          </View>
        )}

        {/* Contenido con mayores ingresos */}
        <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="ie_sec_title" label="Título contenido mayores ingresos" value="Contenido con mayores ingresos">
          <Text style={s.ieSecTitle}>Contenido con mayores ingresos</Text>
        </AE>

        <View style={s.ieWarningBox}>
          <AE isAdmin={isAdmin} table="ui_analytics" column="icon" rowId="ie_warning_icon" label="Icono aviso" value="" type="image">
            <Image source={require('../../assets/figma/ie_warning.png')} style={s.ieWarningIcon} resizeMode="contain" />
          </AE>
          <AE isAdmin={isAdmin} table="ui_analytics" column="text" rowId="ie_warning" label="Texto aviso cambio divisa" value="Los importes se convierten de USD a EUR según el tipo de cambio histórico de la fecha que corresponda">
            <Text style={s.ieWarningText}>Los importes se convierten de USD a EUR según el tipo de cambio histórico de la fecha que corresponda</Text>
          </AE>
        </View>

        {(() => {
          const vidPeriodKeys = ['7d', '28d', '90d', '365d', 'mar', 'feb', 'ene', '2026', '2025', 'total'];
          const vidPK = vidPeriodKeys[iePeriod] || '28d';
          return IE_VIDEOS.map((vid, i) => (
            <View key={i}>
              <View style={s.ieVideoRow}>
                <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId={`ievid_${vidPK}_${i}`} label={`Thumbnail ingresos ${i+1} (${vidPK})`} value="" type="image">
                  <Image source={vid.thumb} style={s.ieVideoThumb} resizeMode="cover" />
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="title" rowId={`ievid_${vidPK}_${i}`} label={`Título video ingresos ${i+1} (${vidPK})`} value={vid.title}>
                  <Text style={s.ieVideoTitle} numberOfLines={1}>{vid.title}</Text>
                </AE>
                <AE isAdmin={isAdmin} table="videos" column="estimated_revenue" rowId={`ievid_${vidPK}_${i}`} label={`Ingresos video ${i+1} (${vidPK})`} value={vid.amount}>
                  <Text style={s.ieVideoAmt}>{vid.amount}</Text>
                </AE>
              </View>
              {i < IE_VIDEOS.length - 1 && <View style={s.ieVideoDivider} />}
            </View>
          ));
        })()}

        <View style={{ height: 40 }} />
      </ScrollView>
      </View>
    );
  }

  /* ── Tendencias tab ── */
  function TendenciasContent() {
    return (
      <>
        {/* Explora temas */}
        <View style={s.tendSection}>
          <View style={s.tendHeaderRow}>
            <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="tend_explora" label="Título Explora temas" value="Explora temas">
              <Text style={s.tendTitle}>Explora temas</Text>
            </AE>
            <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#888', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#888' }}>?</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Image source={require('../../assets/figma/tend_heart.png')} style={{ width: 22, height: 20 }} resizeMode="contain" />
            <Text style={{ fontSize: 16, color: '#282828', marginLeft: 6 }}>0</Text>
          </View>

          {/* Search bar */}
          <View style={s.tendSearchBar}>
            <Image source={require('../../assets/figma/tend_search.png')} style={{ width: 20, height: 20, marginRight: 10, tintColor: '#777' }} resizeMode="contain" />
            <AE isAdmin={isAdmin} table="ui_analytics" column="placeholder" rowId="tend_search" label="Placeholder búsqueda" value="Buscar">
              <Text style={{ fontSize: 15, color: '#747474' }}>Buscar</Text>
            </AE>
          </View>
        </View>

        {/* Búsquedas principales */}
        <View style={s.tendSection}>
          <View style={s.tendHeaderRow}>
            <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="tend_busquedas" label="Título Búsquedas principales" value="Búsquedas principales">
              <Text style={s.tendTitle}>Búsquedas principales</Text>
            </AE>
            <View style={{ flex: 1 }} />
            <Image source={require('../../assets/figma/tend_chevron.png')} style={{ width: 9, height: 14 }} resizeMode="contain" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 12, paddingBottom: 10, paddingHorizontal: 2 }} style={{ overflow: 'visible' }}>
            {TEND_SEARCHES.map((search, i) => (
              <View key={i} style={s.tendSearchCard}>
                <AE isAdmin={isAdmin} table="videos" column="title" rowId={`tendsearch_${i}`} label={`Búsqueda ${i+1}`} value={search}>
                  <Text style={s.tendSearchText}>{search}</Text>
                </AE>
                <View style={{ flex: 1 }} />
                <View style={s.tendSearchActions}>
                  <Image source={require('../../assets/figma/tend_heart.png')} style={{ width: 24, height: 22 }} resizeMode="contain" />
                  <Text style={{ fontSize: 22, color: '#444', fontWeight: '700' }}>⋮</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Vídeos recientes */}
        <View style={s.tendSection}>
          <View style={s.tendHeaderRow}>
            <AE isAdmin={isAdmin} table="ui_analytics" column="title" rowId="tend_recientes" label="Título Vídeos recientes" value="Vídeos recientes">
              <Text style={s.tendTitle}>Vídeos recientes</Text>
            </AE>
            <View style={{ flex: 1 }} />
            <Image source={require('../../assets/figma/tend_chevron.png')} style={{ width: 9, height: 14 }} resizeMode="contain" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 12 }}>
            {TEND_VIDEOS.map((vid, i) => (
              <View key={i} style={s.tendVideoCard}>
                <View style={s.tendVideoThumbWrap}>
                  <AE isAdmin={isAdmin} table="videos" column="thumbnail_url" rowId={`tendvid_${i}`} label={`Thumbnail tendencia ${i+1}`} value="" type="image">
                    <Image source={vid.thumb} style={s.tendVideoThumb} resizeMode="cover" />
                  </AE>
                  {vid.duration ? (
                    <View style={s.tendDurationBadge}>
                      <Text style={s.tendDurationText}>{vid.duration}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={s.tendVideoInfo}>
                  <AE isAdmin={isAdmin} table="videos" column="title" rowId={`tendvid_${i}`} label={`Título vídeo tendencia ${i+1}`} value={vid.title}>
                    <Text style={s.tendVideoTitle} numberOfLines={2}>{vid.title}</Text>
                  </AE>
                  <Text style={{ fontSize: 18, color: '#555', marginLeft: 4 }}>⋮</Text>
                </View>
                <AE isAdmin={isAdmin} table="videos" column="description" rowId={`tendvid_${i}`} label={`Info vídeo tendencia ${i+1}`} value={`${vid.channel} · ${vid.views}`}>
                  <Text style={s.tendVideoMeta} numberOfLines={1}>{vid.channel} · {vid.views}{vid.time ? ' · ' + vid.time : ''}</Text>
                </AE>
              </View>
            ))}
          </ScrollView>
        </View>
      </>
    );
  }

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={TEAL} />}>
      {/* ── Sub-tabs (siempre visibles) ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsRow}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={s.tabItem} onPress={() => setActiveTab(i)}>
            <Text style={[s.tabText, activeTab === i && s.tabTextActive]}>{t}</Text>
            {activeTab === i && <View style={s.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={s.tabDivider} />

      {/* ── Vista General tab ── */}
      {activeTab === 0 && <VistaGeneralContent />}

      {/* ── Ingresos tab with filter chips ── */}
      {activeTab === 3 && <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
          {FILTER_CHIPS.map((chip, i) => (
            <TouchableOpacity
              key={chip}
              style={[s.chip, activeChip === i && s.chipActive]}
              onPress={() => setActiveChip(i)}
            >
              <AE isAdmin={isAdmin} table="ui_analytics" column="chip_label" rowId={`ingchip_${i}`} label={`Filtro ingresos: ${chip}`} value={chip}>
                <Text style={[s.chipText, activeChip === i && s.chipTextActive]}>{chip}</Text>
              </AE>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {activeChip === 0 && <TodoContent />}
        {activeChip === 1 && <AnunciosVideoContent />}
        {activeChip === 2 && <AnunciosFeedContent />}
        {activeChip === 3 && <SupersContent />}
      </>}

      {/* ── Contenido tab ── */}
      {activeTab === 1 && <ContenidoTabContent />}

      {/* ── Audiencia tab ── */}
      {activeTab === 2 && <AudienciaTabContent />}

      {/* ── Tendencias tab ── */}
      {activeTab === 4 && <TendenciasContent />}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Sub-tabs
  tabsRow: { paddingHorizontal: 12 },
  tabItem: { paddingHorizontal: 10, paddingTop: 12, paddingBottom: 10, position: 'relative' },
  tabText: { fontSize: 15, fontWeight: '500', color: '#6c6c6c' },
  tabTextActive: { color: '#2b2b2b', fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 10, right: 10, height: 3, backgroundColor: C.black, borderRadius: 1.5 },
  tabDivider: { height: 1, backgroundColor: C.divider },

  // Filter chips
  chipsRow: { paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f1f1f1' },
  chipActive: { backgroundColor: '#0e0e0e' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#252525' },
  chipTextActive: { color: '#efefef' },
  chipSeparator: { width: 1, height: 32, backgroundColor: '#d5d5d5', marginHorizontal: 4, alignSelf: 'center' },

  // Chart card
  chartCard: { backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 4, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  chartLabel: { fontSize: 14, fontWeight: '600', color: '#717171' },
  chartValue: { fontSize: 23, fontWeight: '700', color: '#1e1e1e', marginTop: 4 },
  chartArea: { flexDirection: 'row', marginTop: 16, height: 100 },
  yAxisLabels: { width: 45, justifyContent: 'space-between', paddingRight: 6 },
  chartSvgWrap: { flex: 1, position: 'relative', height: 100 },
  gridContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#ececec' },
  svgLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  axisText: { fontSize: 10, fontWeight: '500', color: '#7a7a7a' },
  xAxisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingLeft: 45 },

  // Monthly earnings card
  earningsCard: { backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 14, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  earningsTitle: { fontSize: 19, fontWeight: '700', color: '#212121', lineHeight: 26 },
  earningsSub: { fontSize: 14, fontWeight: '400', color: '#747474', marginTop: 4, marginBottom: 18 },
  monthRow: { marginBottom: 16 },
  monthTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  monthName: { fontSize: 13, fontWeight: '400', color: '#313131' },
  monthValue: { fontSize: 14, fontWeight: '600', color: '#2b2b2b' },
  barBg: { height: 5, backgroundColor: '#ececec', borderRadius: 3 },
  barFill: { height: '100%', backgroundColor: TEAL, borderRadius: 3 },

  // CPM (anuncios pages)
  cpmValue: { fontSize: 18, fontWeight: '700', color: '#252525' },
  cpmDesc: { fontSize: 13, fontWeight: '400', color: '#787878', marginTop: 4, lineHeight: 18 },

  // Ad types
  adRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.divider },
  adLabel: { fontSize: 13, fontWeight: '400', color: '#3e3e3e', flex: 1, marginRight: 8 },
  adPct: { fontSize: 14, fontWeight: '600', color: '#222222' },

  // Shorts feed
  shortRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  shortThumb: { width: 32, height: 44, borderRadius: 4, backgroundColor: C.divider },
  shortInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shortDate: { fontSize: 13, fontWeight: '400', color: '#2e2e2e' },
  shortAmount: { fontSize: 14, fontWeight: '600', color: '#282828' },

  // Supers carousel
  carouselRow: { paddingTop: 4 },
  carouselCard: { backgroundColor: C.cardBg, borderRadius: 12, padding: 16, marginHorizontal: 12, marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  // dots kept for reference but managed by Carousel component
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 14 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d5d5d5' },
  dotActive: { backgroundColor: '#333' },

  // No data box — exact Figma: bg=#f2f2f2, icon 22x22, text #7b7b7b
  noDataBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 12, padding: 16, gap: 12 },
  noDataIcon: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#888', alignItems: 'center', justifyContent: 'center' },
  noDataInfoIcon: { width: 24, height: 24 },
  noDataText: { fontSize: 14, fontWeight: '400', color: '#7b7b7b', flex: 1 },

  // Vista General
  vgCardPad: { paddingLeft: 12, paddingRight: 6, paddingTop: 8, paddingBottom: 6 },
  vgChartOuter: { paddingLeft: 14, paddingRight: 6, paddingTop: 14, paddingBottom: 8 },
  vgChartCardFixed: { backgroundColor: C.cardBg, borderRadius: 12, padding: 16, height: 253, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3, overflow: 'hidden' },
  vgFullCardImg: { width: '100%', height: '100%', borderRadius: 12 },
  vgChartLabel: { fontSize: 14, fontWeight: '600', color: '#727272' },
  vgValRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  vgChartVal: { fontSize: 23, fontWeight: '700', color: '#161616' },
  vgArrow: { width: 17, height: 17 },
  vgChartSub: { fontSize: 12, fontWeight: '400', color: '#9c9c9c', marginTop: 2 },
  vgChartImgWrap: { flexDirection: 'row', marginTop: 12, flex: 1 },
  vgYAxis: { width: 36, justifyContent: 'space-between', paddingRight: 4 },
  vgChartImg: { flex: 1, height: '100%' },
  vgXAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 36, marginTop: 4 },
  vgTipOuter: { paddingLeft: 14, paddingRight: 6, paddingTop: 14, paddingBottom: 8 },
  vgTipCardFull: { backgroundColor: C.cardBg, borderRadius: 12, height: 82, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3, overflow: 'hidden' },
  vgTipFullImg: { width: '100%', height: '100%' },
  vgTipCodeCard: { flex: 1, justifyContent: 'center' },
  vgTipCodeTitle: { fontSize: 15, fontWeight: '600', color: '#252525', lineHeight: 21, paddingLeft: 20, paddingRight: 90 },
  vgTipCodeImg: { width: 70, height: 48, position: 'absolute', right: 16, top: 17 },
  vgPopCard: { backgroundColor: C.cardBg, borderRadius: 12, marginHorizontal: 12, marginTop: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 3 },
  vgPopTitle: { fontSize: 17, fontWeight: '700', color: '#202020', marginBottom: 4 },
  vgPopSub: { fontSize: 14, fontWeight: '400', color: '#777777', marginBottom: 12 },
  vgPopRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  vgPopThumb: { width: 56, height: 32, borderRadius: 4, backgroundColor: '#f0f0f0' },
  vgPopVidTitle: { flex: 1, fontSize: 13, fontWeight: '400', color: '#343434' },
  vgPopViews: { fontSize: 13, fontWeight: '700', color: '#212121' },
  vgPopDivider: { height: 0.5, backgroundColor: C.divider },

  // Audiencia no data
  audNoDataBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 10, padding: 14, gap: 10 },
  audNoDataText: { fontSize: 13, fontWeight: '400', color: '#787878', flex: 1, lineHeight: 18 },

  // Contenido tab bottom bar
  cvBottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 12, marginTop: 16, backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  cvBottomText: { fontSize: 10, fontWeight: '900', color: '#272727' },
  cvBottomLink: { fontSize: 10, fontWeight: '900', color: '#1f1f1f' },

  // Ingresos estimados detail view
  ieHeaderOverlay: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, gap: 12, backgroundColor: C.bg },
  ieHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  ieBackArrow: { width: 12, height: 19 },
  ieHeaderTitle: { fontSize: 22, fontWeight: '700', color: '#0f0f0f' },
  ieChartArea: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8, height: 140, overflow: 'visible' },
  ieXAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 56, paddingRight: 16, marginTop: 4 },
  ieSummary: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18, gap: 10 },
  ieDot: { width: 10, height: 10 },
  ieSumLabel: { fontSize: 16, fontWeight: '700', color: '#0f0f0f', flex: 1 },
  ieSumValue: { fontSize: 16, fontWeight: '700', color: '#0f0f0f' },
  ieDivider: { height: 0.5, backgroundColor: C.divider, marginHorizontal: 16 },
  ieSecTitle: { fontSize: 20, fontWeight: '700', color: '#0f0f0f', paddingHorizontal: 16, paddingTop: 28, paddingBottom: 16 },
  ieWarningBox: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 16, marginBottom: 20, backgroundColor: '#f2f2f2', borderRadius: 12, padding: 16, gap: 12 },
  ieWarningIcon: { width: 26, height: 24, marginTop: 2 },
  ieWarningText: { fontSize: 14, fontWeight: '400', color: '#555', flex: 1, lineHeight: 20 },
  ieVideoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  ieVideoThumb: { width: 60, height: 34, borderRadius: 4, backgroundColor: '#f0f0f0' },
  ieVideoTitle: { flex: 1, fontSize: 15, fontWeight: '400', color: '#1a1a1a' },
  ieVideoAmt: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  barTooltip: { position: 'absolute', top: -30, backgroundColor: '#fefefe', borderWidth: 1, borderColor: '#e4e4e4', borderRadius: 2, paddingHorizontal: 12, paddingVertical: 6, zIndex: 99, minWidth: 100 },
  barTooltipText: { fontSize: 11, fontWeight: '600', color: '#2c2c2c' },
  ieProcessingRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 10, marginBottom: 6, backgroundColor: '#f2f2f2', borderRadius: 12, padding: 16, gap: 12 },
  ieProcessingText: { fontSize: 14, fontWeight: '400', color: '#555', flex: 1 },
  ieVideoDivider: { height: 0.5, backgroundColor: C.divider, marginHorizontal: 16 },

  // Rendimiento cards
  rendCard: { backgroundColor: C.cardBg, borderRadius: 12, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2, minHeight: 260 },
  rendTitle: { fontSize: 15, fontWeight: '700', color: '#1f1f1f' },
  rendSub: { fontSize: 12, fontWeight: '400', color: '#6e6e6e', marginTop: 1 },
  rendValue: { fontSize: 20, fontWeight: '700', color: '#1e1e1e', marginTop: 8 },
  rendLabel: { fontSize: 12, fontWeight: '400', color: '#777', marginTop: 1, marginBottom: 8 },
  rendVidRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  rendThumb: { width: 56, height: 32, borderRadius: 4, backgroundColor: '#f0f0f0' },
  rendThumbShort: { width: 32, height: 44, borderRadius: 4, backgroundColor: '#f0f0f0' },
  rendVidTitle: { flex: 1, fontSize: 14, fontWeight: '400', color: '#2c2c2c' },
  rendVidAmount: { fontSize: 14, fontWeight: '400', color: '#2b2b2b' },
  rendSourceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  rendDot: { width: 8, height: 8, borderRadius: 4 },
  rendSourceLabel: { flex: 1, fontSize: 14, fontWeight: '400', color: '#414141' },
  rendSourcePct: { fontSize: 14, fontWeight: '700', color: '#282828' },

  // Tendencias
  tendSection: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  tendHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  tendTitle: { fontSize: 17, fontWeight: '700', color: '#1e1e1e' },
  tendSearchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, marginTop: 12 },
  tendSearchCard: { width: 250, backgroundColor: C.cardBg, borderRadius: 12, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4, minHeight: 140 },
  tendSearchText: { fontSize: 20, fontWeight: '700', color: '#222', lineHeight: 28 },
  tendSearchActions: { flexDirection: 'row', gap: 20, marginTop: 16, alignItems: 'center' },
  tendVideoCard: { width: 280 },
  tendVideoThumbWrap: { position: 'relative', borderRadius: 10, overflow: 'hidden' },
  tendVideoThumb: { width: '100%', height: 160, borderRadius: 10 },
  tendDurationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tendDurationText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  tendVideoInfo: { flexDirection: 'row', marginTop: 8, alignItems: 'flex-start' },
  tendVideoTitle: { fontSize: 15, fontWeight: '700', color: '#1f1f1f', flex: 1, lineHeight: 21 },
  tendVideoMeta: { fontSize: 12, fontWeight: '400', color: '#767676', marginTop: 4 },
});
