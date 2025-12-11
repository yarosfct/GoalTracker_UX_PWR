import type { Goal, ScheduleEvent, UserSettings } from '../types';

class LocalStorage {
  private readonly GOALS_KEY = 'goaltracker_goals';
  private readonly SCHEDULE_KEY = 'goaltracker_schedule';
  private readonly SETTINGS_KEY = 'goaltracker_settings';

  private readonly DEFAULT_SETTINGS: UserSettings = {
    theme: 'minimal',
    colorScheme: 'light',
    reminderFrequency: 'weekly',
    notifications: true,
    guidedMode: true,
    fontSize: 'medium',
  };

  // Goals
  getGoals(): Goal[] {
    const data = localStorage.getItem(this.GOALS_KEY);
    if (!data) return [];
    
    try {
      const parsed = JSON.parse(data);
      return parsed.map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt),
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        subGoals: goal.subGoals.map((sg: any) => ({
          ...sg,
          createdAt: new Date(sg.createdAt),
          deadline: sg.deadline ? new Date(sg.deadline) : undefined,
          completedAt: sg.completedAt ? new Date(sg.completedAt) : undefined,
        })),
      }));
    } catch (error) {
      console.error('Error parsing goals from storage:', error);
      return [];
    }
  }

  saveGoals(goals: Goal[]): void {
    localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
  }

  // Schedule Events
  getScheduleEvents(): ScheduleEvent[] {
    const data = localStorage.getItem(this.SCHEDULE_KEY);
    if (!data) return [];

    try {
      const parsed = JSON.parse(data);
      return parsed.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
    } catch (error) {
      console.error('Error parsing schedule events from storage:', error);
      return [];
    }
  }

  saveScheduleEvents(events: ScheduleEvent[]): void {
    localStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(events));
  }

  // Settings
  getSettings(): UserSettings {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    if (!data) return this.DEFAULT_SETTINGS;

    try {
      return { ...this.DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (error) {
      console.error('Error parsing settings from storage:', error);
      return this.DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: UserSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  // Utility
  clearAll(): void {
    localStorage.removeItem(this.GOALS_KEY);
    localStorage.removeItem(this.SCHEDULE_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

export const storage = new LocalStorage();
