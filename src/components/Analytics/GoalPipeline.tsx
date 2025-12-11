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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-gray-900 mb-6">Goal Pipeline</h2>
      <div className="space-y-3">
        {pipelineData.map((stage, index) => {
          const maxCount = Math.max(...pipelineData.map(s => s.count), 1);
          const widthPercentage = (stage.count / maxCount) * 100;
          
          return (
            <div key={stage.stage}>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-700">{stage.stage}</span>
                <span className="text-gray-900">{stage.count} goals</span>
              </div>
              <div className="relative">
                <div className="h-12 bg-gray-100 rounded-lg overflow-hidden">
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
        <div className="text-center py-8 text-gray-500">
          No goals yet. Create your first goal to see the pipeline!
        </div>
      )}
    </div>
  );
}






