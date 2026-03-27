import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(5000).nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  duration: z.string().nullable().optional(),
  status: z.enum(['published', 'draft', 'unlisted', 'private', 'scheduled']).default('draft'),
  visibility: z.enum(['public', 'unlisted', 'private']).default('public'),
  published_at: z.string().nullable().optional(),
  view_count: z.number().int().min(0).default(0),
  like_count: z.number().int().min(0).default(0),
  dislike_count: z.number().int().min(0).default(0),
  comment_count: z.number().int().min(0).default(0),
  share_count: z.number().int().min(0).default(0),
  watch_time_hours: z.number().min(0).default(0),
  average_view_duration: z.string().default('0:00'),
  impressions: z.number().int().min(0).default(0),
  impression_ctr: z.number().min(0).max(100).default(0),
  estimated_revenue: z.number().min(0).default(0),
  rpm: z.number().min(0).default(0),
  cpm: z.number().min(0).default(0),
  retention_data: z.any().default([]),
  traffic_sources: z.any().default([]),
  audience_geography: z.any().default([]),
  audience_age_gender: z.any().default([]),
  sort_order: z.number().int().default(0),
});

export type VideoFormData = z.infer<typeof videoSchema>;
