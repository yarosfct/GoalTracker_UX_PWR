import { Palette } from 'lucide-react';
import type { UserSettings } from '../../types';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function AppearanceSettings({ settings, onUpdate }: AppearanceSettingsProps) {
  return (
    <div 
      className="rounded-lg p-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ color: 'var(--text-primary)' }}>Appearance</h2>
      </div>
      <div className="space-y-6">
        {/* Theme */}
        <div>
          <label className="block mb-3" style={{ color: 'var(--text-secondary)' }}>Theme Style</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate({ theme: 'minimal' })}
              className="p-4 rounded-lg transition-all"
              style={{
                border: settings.theme === 'minimal' 
                  ? '2px solid var(--accent-primary)' 
                  : '2px solid var(--border-primary)',
                backgroundColor: settings.theme === 'minimal'
                  ? 'var(--accent-primary-light)'
                  : 'var(--bg-primary)'
              }}
            >
              <div className="mb-1" style={{ color: 'var(--text-primary)' }}>Minimal</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Clean and simple design</p>
            </button>
            <button
              onClick={() => onUpdate({ theme: 'colorful' })}
              className="p-4 rounded-lg transition-all"
              style={{
                border: settings.theme === 'colorful' 
                  ? '2px solid var(--accent-primary)' 
                  : '2px solid var(--border-primary)',
                backgroundColor: settings.theme === 'colorful'
                  ? 'var(--accent-primary-light)'
                  : 'var(--bg-primary)'
              }}
            >
              <div className="mb-1" style={{ color: 'var(--text-primary)' }}>Colorful</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Vibrant and engaging</p>
            </button>
          </div>
        </div>
        {/* Color Scheme */}
        <div>
          <label className="block mb-3" style={{ color: 'var(--text-secondary)' }}>Color Scheme</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate({ colorScheme: 'light' })}
              className="p-4 rounded-lg transition-all"
              style={{
                border: settings.colorScheme === 'light' 
                  ? '2px solid var(--accent-primary)' 
                  : '2px solid var(--border-primary)',
                backgroundColor: settings.colorScheme === 'light'
                  ? 'var(--accent-primary-light)'
                  : 'var(--bg-primary)'
              }}
            >
              <div style={{ color: 'var(--text-primary)' }}>Light Mode</div>
            </button>
            <button
              onClick={() => onUpdate({ colorScheme: 'dark' })}
              className="p-4 rounded-lg transition-all"
              style={{
                border: settings.colorScheme === 'dark' 
                  ? '2px solid var(--accent-primary)' 
                  : '2px solid var(--border-primary)',
                backgroundColor: settings.colorScheme === 'dark'
                  ? 'var(--accent-primary-light)'
                  : 'var(--bg-primary)'
              }}
            >
              <div style={{ color: 'var(--text-primary)' }}>Dark Mode</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


