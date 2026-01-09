'use client';

interface NutritionTrackerProps {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  target: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function NutritionTracker({ current, target }: NutritionTrackerProps) {
  const getPercentage = (curr: number, tgt: number) => {
    return Math.min(100, (curr / tgt) * 100);
  };

  const getColor = (curr: number, tgt: number) => {
    const pct = getPercentage(curr, tgt);
    if (pct > 110) return 'bg-red-500';
    if (pct > 100) return 'bg-yellow-500';
    if (pct < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const renderNutrient = (label: string, curr: number, tgt: number, unit: string) => {
    const percentage = getPercentage(curr, tgt);

    return (
      <div key={label} className="mb-4">
        <div className="flex justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm text-gray-600">
            {curr}{unit} / {tgt}{unit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${getColor(curr, tgt)}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">Nutrition Tracker</h3>

      {renderNutrient('Calories', current.calories, target.calories, '')}
      {renderNutrient('Protein', current.protein, target.protein, 'g')}
      {renderNutrient('Carbs', current.carbs, target.carbs, 'g')}
      {renderNutrient('Fat', current.fat, target.fat, 'g')}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-sm text-blue-900 mb-2">Macros Breakdown</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <div className="text-blue-600 font-semibold">
              {((current.protein / 4 / current.calories) * 100).toFixed(1)}%
            </div>
            <div className="text-gray-600">Protein</div>
          </div>
          <div>
            <div className="text-yellow-600 font-semibold">
              {((current.carbs / 4 / current.calories) * 100).toFixed(1)}%
            </div>
            <div className="text-gray-600">Carbs</div>
          </div>
          <div>
            <div className="text-red-600 font-semibold">
              {((current.fat / 9 / current.calories) * 100).toFixed(1)}%
            </div>
            <div className="text-gray-600">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
