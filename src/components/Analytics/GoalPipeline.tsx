interface PipelineStage {
  stage: string;
  count: number;
  color: string;
}

interface GoalPipelineProps {
  pipelineData: PipelineStage[];
  totalGoals: number;
}

export function GoalPipeline({ pipelineData, totalGoals }: GoalPipelineProps) {
  return (
    <div 
      className="rounded-lg p-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <h2 className="mb-6" style={{ color: 'var(--text-primary)' }}>Goal Pipeline</h2>
      <div className="space-y-3">
        {pipelineData.map((stage) => {
          const maxCount = Math.max(...pipelineData.map(s => s.count), 1);
          const widthPercentage = (stage.count / maxCount) * 100;
          
          return (
            <div key={stage.stage}>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>{stage.stage}</span>
                <span style={{ color: 'var(--text-primary)' }}>{stage.count} goals</span>
              </div>
              <div className="relative">
                <div className="h-12 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div
                    className="h-full flex items-center justify-center text-white transition-all duration-500"
                    style={{
                      width: `${Math.max(widthPercentage, 10)}%`,
                      backgroundColor: stage.color,
                    }}
                  >
                    {stage.count > 0 && (
                      <span className="text-sm">
                        {Math.round((stage.count / totalGoals) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalGoals === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          No goals yet. Create your first goal to see the pipeline!
        </div>
      )}
    </div>
  );
}







