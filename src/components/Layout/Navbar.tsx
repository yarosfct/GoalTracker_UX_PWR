import { Link, useLocation } from 'react-router-dom';
import { Target, Calendar, BarChart3, Settings, List } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Target },
    { path: '/goals', label: 'Goals', icon: List },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{ 
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-primary)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-xl" style={{ color: 'var(--text-primary)' }}>GoalTracker</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={isActive(item.path) ? {
                    backgroundColor: 'var(--accent-primary-light)',
                    color: 'var(--accent-primary)'
                  } : {
                    color: 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
