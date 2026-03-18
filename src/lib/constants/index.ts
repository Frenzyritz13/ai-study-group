/**
 * App Configuration Constants
 */

export const APP_NAME = 'AI Study Groups';
export const APP_DESCRIPTION = 'Study group platform for Frenzy Works';

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  FACILITATOR: 'facilitator',
  USER: 'user',
} as const;

/**
 * Streak Types
 */
export const STREAK_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  FRIEND: 'friend',
} as const;

/**
 * Resource Types
 */
export const RESOURCE_TYPES = [
  { value: 'article', label: 'Article', icon: '📄' },
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'book', label: 'Book', icon: '📚' },
  { value: 'tool', label: 'Tool', icon: '🛠️' },
  { value: 'other', label: 'Other', icon: '📎' },
] as const;

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  FRIEND_REQUEST: 'friend_request',
  NUDGE: 'nudge',
  STREAK_MILESTONE: 'streak_milestone',
  NEW_MEETING_SUMMARY: 'new_meeting_summary',
  NEW_DAILY_TASK: 'new_daily_task',
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  STUDY_GROUPS: '/study-groups',
  STUDY_GROUP_DETAIL: (id: string) => `/study-groups/${id}`,
  CURRICULUM: (id: string) => `/study-groups/${id}/curriculum`,
  RESOURCES: (id: string) => `/study-groups/${id}/resources`,
  ADMIN: '/admin',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

/**
 * WCAG Colors - Accessible color palette
 */
export const ACCESSIBLE_COLORS = {
  primary: '#0ea5e9', // Sky blue
  secondary: '#8b5cf6', // Purple
  success: '#22c55e', // Green
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  neutral: '#6b7280', // Gray
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
} as const;
