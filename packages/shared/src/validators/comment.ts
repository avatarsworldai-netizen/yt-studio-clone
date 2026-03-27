import { z } from 'zod';

export const commentSchema = z.object({
  video_id: z.string().uuid('Invalid video ID'),
  author_name: z.string().min(1, 'Author name is required').max(100),
  author_avatar_url: z.string().url().nullable().optional(),
  author_is_verified: z.boolean().default(false),
  content: z.string().min(1, 'Comment content is required').max(10000),
  like_count: z.number().int().min(0).default(0),
  dislike_count: z.number().int().min(0).default(0),
  is_hearted: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  is_reply: z.boolean().default(false),
  parent_comment_id: z.string().uuid().nullable().optional(),
  status: z.enum(['published', 'held_for_review', 'spam', 'removed']).default('published'),
  published_at: z.string().optional(),
});

export type CommentFormData = z.infer<typeof commentSchema>;
