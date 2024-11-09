import React, { useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';

export const Analysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentFood, handleImageAnalysis } = useNutrition();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      await handleImageAnalysis(file);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error analyzing image');
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Food Analysis</h1>

      {errorMessage && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Camera className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold">Upload Food Image</h2>
          </div>
          
          <div className="mt-4">
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-300">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {isAnalyzing && (
            <div className="mt-4 text-center text-gray-400">
              Analyzing your food...
            </div>
          )}
        </div>

        {currentFood.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              {currentFood.map((food, index) => (
                <div
                  key={index}
                  className="border-b border-gray-700 last:border-0 py-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-400">
                      {food.name}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {Math.round(food.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>Calories: {food.nutrition.calories}kcal</div>
                    <div>Protein: {food.nutrition.protein}g</div>
                    <div>Carbs: {food.nutrition.carbs}g</div>
                    <div>Fat: {food.nutrition.fat}g</div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>Calcium: {food.nutrition.minerals.calcium}mg</div>
                    <div>Iron: {food.nutrition.minerals.iron}mg</div>
                    <div>Potassium: {food.nutrition.minerals.potassium}mg</div>
                    <div>Vitamin A: {food.nutrition.vitamins.a}IU</div>
                    <div>Vitamin C: {food.nutrition.vitamins.c}mg</div>
                    <div>Vitamin D: {food.nutrition.vitamins.d}IU</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};