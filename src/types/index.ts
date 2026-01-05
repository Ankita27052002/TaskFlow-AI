// Task Types
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type BoardType = 'kanban' | 'scrum';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  boardType: BoardType;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  storyPoints?: number;
  sprintId?: string | null;
  acceptanceCriteria?: string[];
  estimatedTime?: string;
}

// Sprint Types
export type SprintStatus = 'planned' | 'active' | 'completed';

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  tasks: string[]; // Task IDs
  capacity: number;
  velocity: number;
  createdAt: string;
}

// UI Types
export interface Toast {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  aiAnalyzing: boolean;
  toast: Toast | null;
}

// Redux State Types
export interface TaskState {
  tasks: Task[];
  filter: 'all' | 'high' | 'medium' | 'low';
  sortBy: 'createdAt' | 'priority' | 'dueDate';
}

export interface SprintState {
  sprints: Sprint[];
  activeSprint: string | null;
  sprintHistory: Sprint[];
}

// RootState will be imported from store
export type { RootState, AppDispatch } from '../store/store'

// AI Service Types
export interface AITaskAnalysis {
  priority: TaskPriority;
  estimatedTime: number;
  reasoning: string;
}

export interface AIBulkAnalysis {
  index: number;
  priority: TaskPriority;
  estimatedTime: number;
  reasoning: string;
}

export interface AITaskClustering {
  categories: Record<string, number[]>;
  insights: string;
}

export interface AISprintPrediction {
  likelihood: number;
  risk: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Auth Types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<AuthUser>;
  sendEmailLink: (email: string) => Promise<boolean>;
  verifyEmailLink: (email: string, emailLink: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

// Component Props Types
export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  boardType?: BoardType;
  defaultStatus?: TaskStatus;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];
