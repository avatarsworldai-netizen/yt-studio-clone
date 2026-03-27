export type CommentStatus = 'published' | 'held_for_review' | 'spam' | 'removed';

export interface Comment {
  id: string;
  video_id: string;
  author_name: string;
  author_avatar_url: string | null;
  author_is_verified: boolean;
  content: string;
  like_count: number;
  dislike_count: number;
  is_hearted: boolean;
  is_pinned: boolean;
  is_reply: boolean;
  parent_comment_id: string | null;
  status: CommentStatus;
  published_at: string;
  created_at: string;
  updated_at: string;
}
