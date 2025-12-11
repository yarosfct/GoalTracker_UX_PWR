/**
 * Local Storage Manager
 * A simple lightweight database solution using localStorage
 * 
 * Note: Types are now defined in src/types/index.ts
 */

interface Activity {
  id: string;
  goalId: string;
  title: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

class LocalStorage {
  private readonly GOALS_KEY = 'goaltracker_goals';
  private readonly ACTIVITIES_KEY = 'goaltracker_activities';
  private readonly SETTINGS_KEY = 'goaltracker_settings';

  // Goals - accepts any goal-like object for flexibility
  getGoals(): any[] {
    const data = localStorage.getItem(this.GOALS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveGoal(goal: any): void {
    const goals = this.getGoals();
    const index = goals.findIndex((g: any) => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
  }

  deleteGoal(goalId: string): void {
    const goals = this.getGoals().filter(g => g.id !== goalId);
    localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
  }

  // Activities
  getActivities(): Activity[] {
    const data = localStorage.getItem(this.ACTIVITIES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveActivity(activity: Activity): void {
    const activities = this.getActivities();
    const index = activities.findIndex(a => a.id === activity.id);
    if (index >= 0) {
      activities[index] = activity;
    } else {
      activities.push(activity);
    }
    localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));
  }

  deleteActivity(activityId: string): void {
    const activities = this.getActivities().filter(a => a.id !== activityId);
    localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));
  }

  // Settings
  getSettings(): any {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      displayName: '',
      email: '',
      theme: 'light',
      defaultView: 'dashboard',
      notifications: {
        email: false,
        push: false,
      },
    };
  }

  saveSettings(settings: any): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  // Utility methods
  clearAll(): void {
    localStorage.removeItem(this.GOALS_KEY);
    localStorage.removeItem(this.ACTIVITIES_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

export const storage = new LocalStorage();
