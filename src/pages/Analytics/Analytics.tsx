import { useApp } from '../../contexts/AppContext';
import { Flame, TrendingUp, CheckCircle2 } from 'lucide-react';
import { KPICard, GoalPipeline, SuccessRateChart, ProductivityHeatmap } from '../../components/Analytics';

const Analytics = () => {
  const { goals, scheduleEvents } = useApp();

  // Current Streak calculation (consecutive days with completed tasks/events)
  const calculateStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasActivity = scheduleEvents.some(event => {
        const eventDate = new Date(event.start);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === checkDate.getTime();
      });
      
      if (hasActivity || i === 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Say-Do Ratio (scheduled events completion vs scheduled)
  const calculateSayDoRatio = () => {
    if (scheduleEvents.length === 0) return 100;
    
    const now = new Date();
    const pastEvents = scheduleEvents.filter(event => new Date(event.end) < now);
    
    if (pastEvents.length === 0) return 100;
    
    // Simulate completion (in real app, events would have completion status)
    // For now, we'll use a heuristic based on goals completion
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const totalGoals = goals.length || 1;
    
    return Math.round((completedGoals / totalGoals) * 100);
  };

  // Completion Rate
  const calculateCompletionRate = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    return totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  };

  // Goal Pipeline (Funnel Data)
  const getPipelineData = () => {
    const notStarted = goals.filter(g => g.status === 'not-started').length;
    const inProgress = goals.filter(g => g.status === 'in-progress').length;
    const completed = goals.filter(g => g.status === 'completed').length;
    
    return [
      { stage: 'Not Started', count: notStarted, color: '#94A3B8' },
      { stage: 'In Progress', count: inProgress, color: '#3B82F6' },
      { stage: 'Completed', count: completed, color: '#10B981' },
    ];
  };

  // Success Rate by Category
  const getSuccessRateByCategory = () => {
    const categories = ['study', 'fitness', 'personal', 'work', 'finance', 'health'];
    
    return categories.map(category => {
      const categoryGoals = goals.filter(g => g.category === category);
      const completedInCategory = categoryGoals.filter(g => g.status === 'completed').length;
      const rate = categoryGoals.length > 0 ? Math.round((completedInCategory / categoryGoals.length) * 100) : 0;
      
      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        rate,
      };
    }).filter(item => item.rate > 0 || goals.some(g => g.category === item.category.toLowerCase()));
  };

  // Productivity Heatmap (GitHub style)
  const getHeatmapData = () => {
    const weeks = 52;
    const daysPerWeek = 7;
    const data: { date: Date; count: number }[] = [];
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeks * daysPerWeek));
    
    for (let i = 0; i < weeks * daysPerWeek; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Count activities for this date
      const count = scheduleEvents.filter(event => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      }).length;
      
      data.push({ date, count });
    }
    
    return data;
  };

  const currentStreak = calculateStreak();
  const sayDoRatio = calculateSayDoRatio();
  const completionRate = calculateCompletionRate();
  const pipelineData = getPipelineData();
  const successRateData = getSuccessRateByCategory();
  const heatmapData = getHeatmapData();

  // Group heatmap data by weeks
  const heatmapWeeks: { date: Date; count: number }[][] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    heatmapWeeks.push(heatmapData.slice(i, i + 7));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>Analytics Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your progress and productivity insights</p>
      </div>

      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          label="Current Streak"
          value={`${currentStreak} days`}
          icon={Flame}
          iconColor="text-orange-500"
          progress={Math.min((currentStreak / 30) * 100, 100)}
          progressColor="from-orange-400 to-orange-600"
          message={currentStreak > 7 ? 'Amazing consistency!' : 'Keep building your streak!'}
        />
        <KPICard
          label="Say-Do Ratio"
          value={`${sayDoRatio}%`}
          icon={TrendingUp}
          iconColor="text-blue-500"
          progress={sayDoRatio}
          progressColor="from-blue-400 to-blue-600"
          message={sayDoRatio >= 80 ? 'Excellent follow-through!' : 'Room for improvement'}
        />
        <KPICard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={CheckCircle2}
          iconColor="text-green-500"
          progress={completionRate}
          progressColor="from-green-400 to-green-600"
          message={`${goals.filter(g => g.status === 'completed').length} of ${goals.length} goals completed`}
        />
      </div>

      {/* Middle Section: Funnel Chart & Success Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GoalPipeline pipelineData={pipelineData} totalGoals={goals.length} />
        <SuccessRateChart data={successRateData} />
      </div>

      {/* Bottom Section: Productivity Heatmap */}
      <ProductivityHeatmap heatmapWeeks={heatmapWeeks} totalEvents={scheduleEvents.length} />
    </div>
  );
};

export default Analytics;
