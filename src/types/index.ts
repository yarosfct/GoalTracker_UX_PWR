export type GoalCategory = 'study' | 'fitness' | 'personal' | 'work' | 'finance' | 'health' | 'other';

export type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold';

export type GoalPriority = 'low' | 'medium' | 'high';

export type GoalNotifications = {
  enabled: boolean;
  notifyOnDeadline: boolean;
  notifyDaily: boolean;
  notifyWeekly: boolean;
  notifyOnProgress: boolean;
  deadlineReminderDays: number;
};

export type SubGoal = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  deadline?: Date;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
  subGoals: SubGoal[];
  createdAt: Date;
  deadline?: Date;
  completedAt?: Date;
  timeSpent: number;
  isShared?: boolean;
  sharedWith?: string[];
  notifications?: GoalNotifications;
  isFinalGoal?: boolean;
  mainGoalCompleted?: boolean;
};

export type ScheduleEvent = {
  id: string;
  goalId: string;
  title: string;
  start: Date;
  end: Date;
  category: GoalCategory;
};

export type UserSettings = {
  theme: 'minimal' | 'colorful';
  colorScheme: 'light' | 'dark';
  reminderFrequency: 'daily' | 'weekly' | 'milestone';
  notifications: boolean;
  guidedMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  currentStreak: number;
  lastVisitDate: string | null;
  longestStreak: number;
};
