import { z } from 'zod';

export const channelSchema = z.object({
  name: z.string().min(1, 'Channel name is required').max(100),
  handle: z.string().min(1, 'Handle is required').max(50).regex(/^@/, 'Handle must start with @'),
  avatar_url: z.string().url().nullable().optional(),
  banner_url: z.string().url().nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  subscriber_count: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),
  total_watch_time_hours: z.number().min(0).default(0),
  video_count: z.number().int().min(0).default(0),
  country: z.string().max(2).default('US'),
  joined_date: z.string(),
  is_verified: z.boolean().default(false),
});

export type ChannelFormData = z.infer<typeof channelSchema>;
