interface HeatmapDay {
  date: Date;
  count: number;
}

interface ProductivityHeatmapProps {
  heatmapWeeks: HeatmapDay[][];
  totalEvents: number;
}

export function ProductivityHeatmap({ heatmapWeeks, totalEvents }: ProductivityHeatmapProps) {
  const getHeatmapColor = (count: number) => {
    if (count === 0) return '#F1F5F9';
    if (count === 1) return '#BFDBFE';
    if (count === 2) return '#93C5FD';
    if (count === 3) return '#60A5FA';
    return '#3B82F6';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Productivity Heatmap</h2>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className="w-3 h-3 rounded"
                style={{ backgroundColor: getHeatmapColor(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Month labels */}
          <div className="flex flex-col justify-start pt-5 pr-2">
            {['Mon', 'Wed', 'Fri'].map((day, idx) => (
              <div key={day} className="text-xs text-gray-600 h-3 flex items-center" style={{ marginTop: idx === 0 ? 0 : '6px' }}>
                {day}
              </div>
            ))}
          </div>
          {/* Heatmap grid */}
          <div className="flex gap-1">
            {heatmapWeeks.slice(-52).map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const isToday = 
                    day.date.getDate() === new Date().getDate() &&
                    day.date.getMonth() === new Date().getMonth() &&
                    day.date.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded transition-all hover:ring-2 hover:ring-blue-400"
                      style={{ backgroundColor: getHeatmapColor(day.count) }}
                      title={`${day.date.toLocaleDateString()}: ${day.count} event${day.count !== 1 ? 's' : ''}`}
                    >
                      {isToday && (
                        <div className="w-full h-full rounded border-2 border-blue-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        {totalEvents > 0 
          ? `${totalEvents} total scheduled events over the past year`
          : 'Start scheduling events to build your productivity heatmap!'
        }
      </p>
    </div>
  );
}






