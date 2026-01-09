export default function MealCard({ meal }: { meal: any }) {
  const totalMacros = meal.protein_grams + meal.carbs_grams + meal.fat_grams;
  const proteinPercent = (meal.protein_grams / totalMacros) * 100;
  const carbsPercent = (meal.carbs_grams / totalMacros) * 100;
  const fatPercent = (meal.fat_grams / totalMacros) * 100;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {meal.image_url && (
        <img
          src={meal.image_url}
          alt={meal.name}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{meal.name}</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
            {meal.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{meal.description}</p>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-600">{meal.calories}</div>
            <div className="text-xs text-gray-500">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-green-600">{meal.protein_grams}g</div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-yellow-600">{meal.carbs_grams}g</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-red-600">{meal.fat_grams}g</div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
        </div>

        {/* Macro Bar */}
        <div className="flex h-2 rounded-full overflow-hidden mb-4 bg-gray-200">
          <div
            className="bg-green-500"
            style={{ width: `${proteinPercent}%` }}
          />
          <div
            className="bg-yellow-500"
            style={{ width: `${carbsPercent}%` }}
          />
          <div
            className="bg-red-500"
            style={{ width: `${fatPercent}%` }}
          />
        </div>

        {/* Meta Info */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>{meal.prep_time_minutes + meal.cook_time_minutes} min</span>
          <span>${meal.cost_usd.toFixed(2)}</span>
          <span className="capitalize">{meal.difficulty}</span>
        </div>

        {/* Tags */}
        {meal.dietary_tags && meal.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {meal.dietary_tags.slice(0, 3).map((tag: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
