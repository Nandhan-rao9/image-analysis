import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { BarChart2, Utensils, Activity, Target } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { NutrientSphere } from '../components/NutrientSphere';
import { AnimatedProgressRing } from '../components/AnimatedProgressRing';

export const Dashboard = () => {
  const { currentNutrition, nutritionTarget } = useNutrition();

  const stats = [
    {
      label: 'Daily Calories',
      value: currentNutrition?.calories || 0,
      target: nutritionTarget?.calories || 2000,
      icon: Activity,
      color: '#60A5FA',
    },
    {
      label: 'Protein',
      value: currentNutrition?.protein || 0,
      target: nutritionTarget?.protein || 150,
      unit: 'g',
      icon: Target,
      color: '#34D399',
    },
    {
      label: 'Carbs',
      value: currentNutrition?.carbs || 0,
      target: nutritionTarget?.carbs || 250,
      unit: 'g',
      icon: BarChart2,
      color: '#F472B6',
    },
    {
      label: 'Fat',
      value: currentNutrition?.fat || 0,
      target: nutritionTarget?.fat || 70,
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
                <NutrientSphere position={[-2, 0, 0]} color="#60A5FA" scale={0.8} />
                <NutrientSphere position={[0, 0, 0]} color="#34D399" scale={1} />
                <NutrientSphere position={[2, 0, 0]} color="#F472B6" scale={0.6} />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  alt="Healthy Salad"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <h3 className="font-medium">Healthy Salad</h3>
                  <p className="text-sm text-gray-400">Today, 12:30 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">320 kcal</p>
                <p className="text-sm text-gray-400">Protein: 15g</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};