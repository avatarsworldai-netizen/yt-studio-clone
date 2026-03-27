import { z } from 'zod';

export const revenueSchema = z.object({
  channel_id: z.string().uuid(),
  month: z.string(),
  estimated_revenue: z.number().min(0).default(0),
  ad_revenue: z.number().min(0).default(0),
  membership_revenue: z.number().min(0).default(0),
  superchat_revenue: z.number().min(0).default(0),
  merchandise_revenue: z.number().min(0).default(0),
  premium_revenue: z.number().min(0).default(0),
  rpm: z.number().min(0).default(0),
  cpm: z.number().min(0).default(0),
  playback_based_cpm: z.number().min(0).default(0),
  ad_impressions: z.number().int().min(0).default(0),
  monetized_playbacks: z.number().int().min(0).default(0),
});

export type RevenueFormData = z.infer<typeof revenueSchema>;
