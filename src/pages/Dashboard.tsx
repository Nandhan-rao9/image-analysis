import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { BarChart2, Utensils, Activity, Target } from 'lucide-react';
import axios from 'axios';
import { NutrientSphere } from '../components/NutrientSphere';
import { AnimatedProgressRing } from '../components/AnimatedProgressRing';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  time: string;
  calories: number;
  protein: number;
  image: string;
}

export const Dashboard = () => {
  const [currentNutrition, setCurrentNutrition] = useState<NutritionData>({
    calories: 1315,
    protein: 52,
    carbs: 112,
    fat: 17
  });
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);

  const nutritionTarget = {
    calories: 2346,
    protein: 134,
    carbs: 197,
    fat: 64
  };

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/analyze-image');
        const latestFood = response.data[0];
        
        if (latestFood) {
          setCurrentNutrition({
            calories: latestFood.nutrition.calories || 0,
            protein: latestFood.nutrition.protein || 0,
            carbs: latestFood.nutrition.carbs || 0,
            fat: latestFood.nutrition.fat || 0
          });

          const newMeal = {
            name: latestFood.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            calories: latestFood.nutrition.calories,
            protein: latestFood.nutrition.protein,
            image: `https://source.unsplash.com/featured/?${encodeURIComponent(latestFood.name)},food`
          };

          setRecentMeals(prevMeals => [newMeal, ...prevMeals].slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      }
    };

    fetchLatestData();
    const interval = setInterval(fetchLatestData, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Daily Calories',
      value: currentNutrition.calories,
      target: nutritionTarget.calories,
      icon: Activity,
      color: '#60A5FA',
    },
    {
      label: 'Protein',
      value: currentNutrition.protein,
      target: nutritionTarget.protein,
      unit: 'g',
      icon: Target,
      color: '#34D399',
    },
    {
      label: 'Carbs',
      value: currentNutrition.carbs,
      target: nutritionTarget.carbs,
      unit: 'g',
      icon: BarChart2,
      color: '#F472B6',
    },
    {
      label: 'Fat',
      value: currentNutrition.fat,
      target: nutritionTarget.fat,
      unit: 'g',
      icon: Utensils,
      color: '#FBBF24',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold"
      >
        Nutrition Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, target, unit = '', icon: Icon, color }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-300">{label}</h3>
              <Icon className="h-6 w-6" style={{ color }} />
            </div>
            <div className="flex items-center justify-center">
              <AnimatedProgressRing
                progress={(value / target) * 100}
                color={color}
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold">
                {value}
                {unit}
                <span className="text-sm text-gray-400 ml-2">
                  / {target}
                  {unit}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Nutrient Visualization</h2>
          <div className="h-[300px] w-full">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <NutrientSphere 
                  position={[-2, 0, 0]} 
                  color="#60A5FA" 
                  scale={currentNutrition.calories / nutritionTarget.calories} 
                />
                <NutrientSphere 
                  position={[0, 0, 0]} 
                  color="#34D399" 
                  scale={currentNutrition.protein / nutritionTarget.protein} 
                />
                <NutrientSphere 
                  position={[2, 0, 0]} 
                  color="#F472B6" 
                  scale={currentNutrition.carbs / nutritionTarget.carbs} 
                />
                <OrbitControls enableZoom={false} />
              </Suspense>
            </Canvas>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>
          <div className="space-y-4">
            {recentMeals.map((meal, index) => (
              <motion.div
                key={`${meal.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={meal.image}
                    alt={meal.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium">{meal.name}</h3>
                    <p className="text-sm text-gray-400">{meal.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{meal.calories} kcal</p>
                  <p className="text-sm text-gray-400">Protein: {meal.protein}g</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};