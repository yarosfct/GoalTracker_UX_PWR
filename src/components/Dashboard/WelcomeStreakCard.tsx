import { Flame, TrendingUp, Award, Zap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

export function WelcomeStreakCard() {
  const { settings, updateSettings } = useApp();
  const { currentStreak, longestStreak } = settings;
  const { isColorful } = useTheme();

  // Update streak on component mount
  useEffect(() => {
    const updateStreak = () => {
      const today = new Date().toDateString();
      const lastVisit = settings.lastVisitDate;

      if (!lastVisit) {
        // First visit
        updateSettings({
          currentStreak: 1,
          lastVisitDate: today,
          longestStreak: Math.max(1, longestStreak),
        });
      } else if (lastVisit !== today) {
        const lastVisitDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const daysDiff = Math.floor(
          (todayDate.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Consecutive day - increase streak
          const newStreak = currentStreak + 1;
          updateSettings({
            currentStreak: newStreak,
            lastVisitDate: today,
            longestStreak: Math.max(newStreak, longestStreak),
          });
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          updateSettings({
            currentStreak: 1,
            lastVisitDate: today,
          });
        }
        // If daysDiff === 0, same day - no update needed
      }
    };

    updateStreak();
  }, []); // Only run once on mount

  const getStreakMessage = () => {
    const lastVisit = settings.lastVisitDate;
    
    if (!lastVisit) {
      return {
        text: "Welcome to GoalTracker! Start your journey today.",
        emoji: "🎯",
      };
    }

    const lastVisitDate = new Date(lastVisit);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (currentStreak === 1 && daysDiff > 1) {
      return {
        text: "You missed a few days, but that's okay! Every new day is a fresh start. Let's rebuild that streak! 💪",
        emoji: "🌱",
      };
    }

    if (currentStreak === 1) {
      return {
        text: "Great to see you! Keep showing up, and you'll build an amazing streak!",
        emoji: "✨",
      };
    }

    if (currentStreak >= 2 && currentStreak <= 6) {
      return {
        text: "You're building momentum! Keep it up and make today count.",
        emoji: "🚀",
      };
    }

    if (currentStreak >= 7 && currentStreak <= 13) {
      return {
        text: "A full week! You're on fire! Your consistency is impressive.",
        emoji: "🔥",
      };
    }

    if (currentStreak >= 14 && currentStreak <= 29) {
      return {
        text: "Two weeks strong! Your dedication is inspiring. Keep crushing it!",
        emoji: "💎",
      };
    }

    if (currentStreak >= 30 && currentStreak <= 59) {
      return {
        text: "30+ days! You're unstoppable! This is what commitment looks like.",
        emoji: "⭐",
      };
    }

    if (currentStreak >= 60 && currentStreak <= 99) {
      return {
        text: "60+ days! Legendary status! Your goals don't stand a chance.",
        emoji: "👑",
      };
    }

    return {
      text: "100+ days! Absolute champion! You're an inspiration to us all!",
      emoji: "🏆",
    };
  };

  const message = getStreakMessage();
  const isNewRecord = currentStreak === longestStreak && currentStreak > 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Left Column - Welcome Card (spans 2 rows) */}
      <div 
        className="rounded-xl p-8 flex flex-col justify-center lg:row-span-2 stat-card-hover"
        style={{
          background: isColorful 
            ? 'linear-gradient(135deg, rgba(191, 219, 254, 0.4) 0%, rgba(165, 180, 252, 0.3) 100%)'
            : 'var(--bg-primary)',
          border: isColorful 
            ? '2px solid var(--border-secondary)'
            : '1px solid var(--border-primary)',
          boxShadow: isColorful ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome back! 👋
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Here's an overview of your goals and progress
        </p>
      </div>

      {/* Right Column Top - Streak Card */}
      <div 
        className="rounded-xl p-6 flex flex-col justify-center stat-card-hover"
        style={{
          background: isColorful 
            ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.5) 0%, rgba(253, 230, 138, 0.3) 100%)'
            : 'var(--bg-primary)',
          border: isColorful 
            ? '2px solid var(--border-secondary)'
            : '1px solid var(--border-primary)',
          boxShadow: isColorful ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="p-4 rounded-full"
            style={{ 
              backgroundColor: currentStreak >= 7 
                ? 'rgba(249, 115, 22, 0.1)' 
                : 'rgba(99, 102, 241, 0.1)',
            }}
          >
            {currentStreak >= 7 ? (
              <Flame className="w-8 h-8" style={{ color: '#f97316' }} />
            ) : (
              <TrendingUp className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {currentStreak}
              </span>
              <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Current streak
            </p>
          </div>
          {isNewRecord && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <Award className="w-4 h-4" style={{ color: '#22c55e' }} />
              <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>
                New Record!
              </span>
            </div>
          )}
        </div>
        
        {/* Longest Streak */}
        {longestStreak > currentStreak && (
          <div className="mt-4 flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Longest streak: <strong style={{ color: 'var(--text-secondary)' }}>{longestStreak} days</strong>
            </span>
          </div>
        )}
      </div>

      {/* Right Column Bottom - Encouraging Message Card */}
      <div 
        className="rounded-xl p-6 flex items-start gap-3 stat-card-hover"
        style={{ 
          background: isColorful 
            ? 'linear-gradient(135deg, rgba(221, 214, 254, 0.5) 0%, rgba(196, 181, 253, 0.3) 100%)'
            : 'var(--bg-primary)',
          border: isColorful 
            ? '2px solid var(--border-secondary)'
            : '1px solid var(--border-primary)',
          boxShadow: isColorful ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="text-2xl flex-shrink-0">
          {message.emoji}
        </div>
        <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
          {message.text}
        </p>
      </div>
    </div>
  );
}

