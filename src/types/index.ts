/**
 * User Types
 */
export type UserRole = 'admin' | 'facilitator' | 'user';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Study Group Types
 */
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  facilitator_id: string;
  notion_embed_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  group_id: string;
  date: string;
  summary?: string;
  attendees: string[]; // user IDs
  created_at: string;
  updated_at: string;
}

/**
 * Streak Types
 */
export interface UserStreak {
  id: string;
  user_id: string;
  group_id?: string;
  streak_type: 'daily' | 'weekly' | 'friend';
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  friend_id?: string; // For friend streaks
  created_at: string;
  updated_at: string;
}

/**
 * Curriculum Types
 */
export interface Curriculum {
  id: string;
  group_id: string;
  title: string;
  description: string;
  content: string; // Markdown
  order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CurriculumSection {
  id: string;
  curriculum_id: string;
  title: string;
  content: string; // Markdown
  order: number;
  duration_estimate?: number; // minutes
}

export interface CurriculumProgress {
  id: string;
  user_id: string;
  section_id: string;
  completed_at: string;
}

/**
 * Resource Types
 */
export interface Resource {
  id: string;
  group_id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'tool' | 'other';
  url: string;
  description?: string;
  added_by: string;
  created_at: string;
}

/**
 * Notification Types
 */
export type NotificationType =
  | 'friend_request'
  | 'nudge'
  | 'streak_milestone'
  | 'new_meeting_summary'
  | 'new_daily_task';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  related_id?: string; // ID of related entity
  created_at: string;
}

/**
 * Audit Log Types
 */
export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string; // e.g., 'updated_user', 'created_group'
  entity_type: string; // 'user', 'group', 'curriculum'
  entity_id: string;
  changes: Record<string, unknown>; // JSON of what changed
  created_at: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}
