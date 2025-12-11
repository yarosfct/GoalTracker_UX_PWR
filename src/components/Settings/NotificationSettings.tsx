import { Bell } from 'lucide-react';
import type { UserSettings } from '../../types';

interface NotificationSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  return (
    <div 
      className="rounded-lg p-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ color: 'var(--text-primary)' }}>Notifications & Reminders</h2>
      </div>
      <div className="space-y-6">
        {/* Enable Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1" style={{ color: 'var(--text-primary)' }}>Enable Notifications</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Receive reminders about your goals</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => onUpdate({ notifications: e.target.checked })}
              className="sr-only peer"
            />
            <div 
              className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
              style={{
                backgroundColor: settings.notifications ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)'
              }}
            ></div>
          </label>
        </div>
        {/* Reminder Frequency */}
        <div>
          <label className="block mb-3" style={{ color: 'var(--text-secondary)' }}>Reminder Frequency</label>
          <div className="grid grid-cols-3 gap-4">
            {(['daily', 'weekly', 'milestone'] as const).map(freq => (
              <button
                key={freq}
                onClick={() => onUpdate({ reminderFrequency: freq })}
                disabled={!settings.notifications}
                className="p-3 rounded-lg transition-all capitalize"
                style={{
                  border: settings.reminderFrequency === freq 
                    ? '2px solid var(--accent-primary)' 
                    : '2px solid var(--border-primary)',
                  backgroundColor: settings.reminderFrequency === freq
                    ? 'var(--accent-primary-light)'
                    : 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  opacity: !settings.notifications ? 0.5 : 1,
                  cursor: !settings.notifications ? 'not-allowed' : 'pointer'
                }}
              >
                {freq}
              </button>
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            {settings.reminderFrequency === 'daily' && 'Get daily reminders about your active goals'}
            {settings.reminderFrequency === 'weekly' && 'Receive a weekly summary of your progress'}
            {settings.reminderFrequency === 'milestone' && 'Get notified when you reach important milestones'}
          </p>
        </div>
      </div>
    </div>
  );
}


