import { useApp } from '../../contexts/AppContext';
import { HelpCircle } from 'lucide-react';
import { AppearanceSettings, NotificationSettings, AccessibilitySettings, DataManagement } from '../../components/Settings';

const Settings = () => {
  const { settings, updateSettings, goals } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Customize your GoalTracker experience</p>
      </div>
      <div className="space-y-6">
        <AppearanceSettings settings={settings} onUpdate={updateSettings} />
        <NotificationSettings settings={settings} onUpdate={updateSettings} />
        <AccessibilitySettings settings={settings} onUpdate={updateSettings} />
        <DataManagement goals={goals} settings={settings} />

        {/* Help */}
        <div 
          className="rounded-lg p-6"
          style={{
            background: 'var(--gradient-accent)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h3 className="mb-2" style={{ color: 'var(--text-primary)' }}>Need Help?</h3>
              <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                GoalTracker is designed to help you achieve your goals through structured planning and consistent tracking.
              </p>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li>• Create goals and break them down into manageable sub-goals</li>
                <li>• Use the calendar to schedule dedicated time for your goals</li>
                <li>• Track your progress with detailed analytics</li>
                <li>• Customize notifications to stay motivated</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
