import { Type } from 'lucide-react';
import type { UserSettings } from '../../types';

interface AccessibilitySettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function AccessibilitySettings({ settings, onUpdate }: AccessibilitySettingsProps) {
  return (
    <div 
      className="rounded-lg p-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Type className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ color: 'var(--text-primary)' }}>Accessibility</h2>
      </div>
      <div className="space-y-6">
        {/* Font Size */}
        <div>
          <label className="block mb-3" style={{ color: 'var(--text-secondary)' }}>Font Size</label>
          <div className="grid grid-cols-3 gap-4">
            {(['small', 'medium', 'large'] as const).map(size => (
              <button
                key={size}
                onClick={() => onUpdate({ fontSize: size })}
                className="p-3 rounded-lg transition-all capitalize"
                style={{
                  border: settings.fontSize === size 
                    ? '2px solid var(--accent-primary)' 
                    : '2px solid var(--border-primary)',
                  backgroundColor: settings.fontSize === size
                    ? 'var(--accent-primary-light)'
                    : 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        {/* Guided Mode */}
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1" style={{ color: 'var(--text-primary)' }}>Guided Mode</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Show helpful tips and tutorials for new users</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.guidedMode}
              onChange={(e) => onUpdate({ guidedMode: e.target.checked })}
              className="sr-only peer"
            />
            <div 
              className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
              style={{
                backgroundColor: settings.guidedMode ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)'
              }}
            ></div>
          </label>
        </div>
      </div>
    </div>
  );
}


