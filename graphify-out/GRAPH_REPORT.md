# Graph Report - /Users/joelpedroche/Documents/Github/yt-studio-clone  (2026-04-13)

## Corpus Check
- Large corpus: 240 files · ~282,928 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 134 nodes · 88 edges · 59 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_generateBarData()|generateBarData()]]
- [[_COMMUNITY_getActiveChannelForOverrides()|getActiveChannelForOverrides()]]
- [[_COMMUNITY_deleteComment()|deleteComment()]]
- [[_COMMUNITY_loadChannel()|loadChannel()]]
- [[_COMMUNITY_loadRealtimeStats()|loadRealtimeStats()]]
- [[_COMMUNITY_formatWatchTime()|formatWatchTime()]]
- [[_COMMUNITY_formatNumber()|formatNumber()]]
- [[_COMMUNITY_ChannelProvider()|ChannelProvider()]]
- [[_COMMUNITY_replaceImageChild()|replaceImageChild()]]
- [[_COMMUNITY_POST()|POST()]]
- [[_COMMUNITY_routeGET()|route/GET()]]
- [[_COMMUNITY_since()|since()]]
- [[_COMMUNITY_buildPoints()|buildPoints()]]
- [[_COMMUNITY_handleSelectChannel()|handleSelectChannel()]]
- [[_COMMUNITY_formatTimeAgo()|formatTimeAgo()]]
- [[_COMMUNITY_sendEditMessage()|sendEditMessage()]]
- [[_COMMUNITY_VideoEditPage()|VideoEditPage()]]
- [[_COMMUNITY_handleSubmit()|handleSubmit()]]
- [[_COMMUNITY_StatsEditor()|StatsEditor()]]
- [[_COMMUNITY_fmt() (EstadisticasScreen)|fmt() (EstadisticasScreen)]]
- [[_COMMUNITY_fmt() (ContenidoScreen)|fmt() (ContenidoScreen)]]
- [[_COMMUNITY_n() (profile)|n() (profile)]]
- [[_COMMUNITY_n() (id)|n() ([id])]]
- [[_COMMUNITY_Logo()|Logo()]]
- [[_COMMUNITY_SectionHeader()|SectionHeader()]]
- [[_COMMUNITY_Carousel()|Carousel()]]
- [[_COMMUNITY_useRealtimeSubscription()|useRealtimeSubscription()]]
- [[_COMMUNITY_index (index)|index (index)]]
- [[_COMMUNITY_video (video)|video (video)]]
- [[_COMMUNITY_revenue (revenue)|revenue (revenue)]]
- [[_COMMUNITY_analytics|analytics]]
- [[_COMMUNITY_channel (channel)|channel (channel)]]
- [[_COMMUNITY_notification|notification]]
- [[_COMMUNITY_index (33)|index (33)]]
- [[_COMMUNITY_comment (comment)|comment (comment)]]
- [[_COMMUNITY_video (35)|video (35)]]
- [[_COMMUNITY_revenue (36)|revenue (36)]]
- [[_COMMUNITY_channel (37)|channel (37)]]
- [[_COMMUNITY_index (38)|index (38)]]
- [[_COMMUNITY_comment (39)|comment (39)]]
- [[_COMMUNITY_next-env.d|next-env.d]]
- [[_COMMUNITY_next.config|next.config]]
- [[_COMMUNITY_layout|layout]]
- [[_COMMUNITY_Sidebar|Sidebar]]
- [[_COMMUNITY_PhonePreview|PhonePreview]]
- [[_COMMUNITY_TabBar|TabBar]]
- [[_COMMUNITY_PanelScreen|PanelScreen]]
- [[_COMMUNITY_ComunidadScreen|ComunidadScreen]]
- [[_COMMUNITY_IngresosScreen|IngresosScreen]]
- [[_COMMUNITY_supabase (supabase)|supabase (supabase)]]
- [[_COMMUNITY__layout|_layout]]
- [[_COMMUNITY_content|content]]
- [[_COMMUNITY_comments|comments]]
- [[_COMMUNITY_revenue (53)|revenue (53)]]
- [[_COMMUNITY_theme|theme]]
- [[_COMMUNITY_CambiarCuenta|CambiarCuenta]]
- [[_COMMUNITY_StatCard|StatCard]]
- [[_COMMUNITY_CommentCard|CommentCard]]
- [[_COMMUNITY_supabase (58)|supabase (58)]]

## God Nodes (most connected - your core abstractions)
1. `loadComments()` - 3 edges
2. `AE()` - 3 edges
3. `handler()` - 3 edges
4. `notify()` - 3 edges
5. `loadFromSupabase()` - 3 edges
6. `handleSave()` - 2 edges
7. `deleteComment()` - 2 edges
8. `saveComment()` - 2 edges
9. `startEdit()` - 2 edges
10. `loadVideos()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "generateBarData()"
Cohesion: 0.21
Nodes (5): fn(), formatYLabel(), generatePoints(), getDateLabel(), handler()

### Community 1 - "getActiveChannelForOverrides()"
Cohesion: 0.31
Nodes (4): loadFromSupabase(), notify(), reloadOverrides(), setActiveChannelForOverrides()

### Community 2 - "deleteComment()"
Cohesion: 0.36
Nodes (6): deleteComment(), loadComments(), loadRevenues(), saveComment(), saveRevenue(), startEdit()

### Community 3 - "loadChannel()"
Cohesion: 0.29
Nodes (1): handleSave()

### Community 4 - "loadRealtimeStats()"
Cohesion: 0.33
Nodes (0): 

### Community 5 - "formatWatchTime()"
Cohesion: 0.4
Nodes (0): 

### Community 6 - "formatNumber()"
Cohesion: 0.67
Nodes (2): deleteVideo(), loadVideos()

### Community 7 - "ChannelProvider()"
Cohesion: 0.5
Nodes (0): 

### Community 8 - "replaceImageChild()"
Cohesion: 0.83
Nodes (3): AE(), replaceImageChild(), replaceTextChild()

### Community 9 - "POST()"
Cohesion: 0.67
Nodes (1): POST()

### Community 10 - "route/GET()"
Cohesion: 0.67
Nodes (1): GET()

### Community 11 - "since()"
Cohesion: 0.67
Nodes (0): 

### Community 12 - "buildPoints()"
Cohesion: 0.67
Nodes (0): 

### Community 13 - "handleSelectChannel()"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "formatTimeAgo()"
Cohesion: 1.0
Nodes (2): formatTimeAgo(), formatViews()

### Community 15 - "sendEditMessage()"
Cohesion: 0.67
Nodes (0): 

### Community 16 - "VideoEditPage()"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "handleSubmit()"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "StatsEditor()"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "fmt() (EstadisticasScreen)"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "fmt() (ContenidoScreen)"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "n() (profile)"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "n() ([id])"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Logo()"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "SectionHeader()"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Carousel()"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "useRealtimeSubscription()"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "index (index)"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "video (video)"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "revenue (revenue)"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "analytics"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "channel (channel)"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "notification"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "index (33)"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "comment (comment)"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "video (35)"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "revenue (36)"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "channel (37)"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "index (38)"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "comment (39)"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "next-env.d"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "next.config"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "layout"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Sidebar"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "PhonePreview"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "TabBar"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "PanelScreen"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "ComunidadScreen"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "IngresosScreen"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "supabase (supabase)"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "_layout"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "content"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "comments"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "revenue (53)"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "theme"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "CambiarCuenta"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "StatCard"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "CommentCard"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "supabase (58)"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `VideoEditPage()`** (2 nodes): `VideoEditPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `handleSubmit()`** (2 nodes): `handleSubmit()`, `EditorPanel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `StatsEditor()`** (2 nodes): `StatsEditor()`, `SectionEditors.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `fmt() (EstadisticasScreen)`** (2 nodes): `fmt()`, `EstadisticasScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `fmt() (ContenidoScreen)`** (2 nodes): `fmt()`, `ContenidoScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `n() (profile)`** (2 nodes): `n()`, `profile.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `n() ([id])`** (2 nodes): `n()`, `[id].tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logo()`** (2 nodes): `Logo()`, `_layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SectionHeader()`** (2 nodes): `SectionHeader()`, `SectionHeader.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Carousel()`** (2 nodes): `Carousel()`, `Carousel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useRealtimeSubscription()`** (2 nodes): `useRealtimeSubscription()`, `useRealtimeSubscription.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index (index)`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `video (video)`** (1 nodes): `video.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `revenue (revenue)`** (1 nodes): `revenue.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `analytics`** (1 nodes): `analytics.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `channel (channel)`** (1 nodes): `channel.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `notification`** (1 nodes): `notification.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index (33)`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `comment (comment)`** (1 nodes): `comment.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `video (35)`** (1 nodes): `video.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `revenue (36)`** (1 nodes): `revenue.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `channel (37)`** (1 nodes): `channel.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index (38)`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `comment (39)`** (1 nodes): `comment.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `next-env.d`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `next.config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `layout`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sidebar`** (1 nodes): `Sidebar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PhonePreview`** (1 nodes): `PhonePreview.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TabBar`** (1 nodes): `TabBar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PanelScreen`** (1 nodes): `PanelScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ComunidadScreen`** (1 nodes): `ComunidadScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `IngresosScreen`** (1 nodes): `IngresosScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `supabase (supabase)`** (1 nodes): `supabase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `_layout`** (1 nodes): `_layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `content`** (1 nodes): `content.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `comments`** (1 nodes): `comments.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `revenue (53)`** (1 nodes): `revenue.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `theme`** (1 nodes): `theme.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CambiarCuenta`** (1 nodes): `CambiarCuenta.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `StatCard`** (1 nodes): `StatCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CommentCard`** (1 nodes): `CommentCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `supabase (58)`** (1 nodes): `supabase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._