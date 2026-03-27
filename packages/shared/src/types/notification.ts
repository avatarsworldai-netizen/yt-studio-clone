export type NotificationType = 'milestone' | 'policy' | 'tip' | 'info';

export interface Notification {
  id: string;
  channel_id: string;
  title: string;
  body: string | null;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}
