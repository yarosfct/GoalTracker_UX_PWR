import { useState } from 'react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import type { Goal, UserSettings } from '../../types';
import { ConfirmationDialog } from '../Goals';

interface DataManagementProps {
  goals: Goal[];
  settings: UserSettings;
}

export function DataManagement({ goals, settings }: DataManagementProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportData = () => {
    const data = {
      goals,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goaltracker-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div 
      className="rounded-lg p-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        <h2 style={{ color: 'var(--text-primary)' }}>Data Management</h2>
      </div>
      <div className="space-y-4">
        <div>
          <button
            onClick={handleExportData}
            className="w-full px-4 py-3 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
          >
            <Download className="w-5 h-5" />
            Export All Data
          </button>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Download your goals and settings as a JSON file for backup or analysis
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full px-4 py-3 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--accent-error)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-error)'}
          >
            <Trash2 className="w-5 h-5" />
            Clear All Data
          </button>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            ⚠️ This will permanently delete all your goals, sub-goals, and settings
          </p>
        </div>
      </div>

      {/* Clear Data Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data?"
        message="This will permanently delete all your goals, sub-goals, settings, and schedule events. This action cannot be undone. Are you absolutely sure?"
        confirmText="Yes, Delete Everything"
        cancelText="Cancel"
        variant="destructive"
        icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
      />
    </div>
  );
}

