import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Calendar, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { MacronutrientGlobe } from '../components/MacronutrientGlobe';

const timeRanges = ['Daily', 'Weekly', 'Monthly'] as const;
type TimeRange = typeof timeRanges[number];

export const Visualizations = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Daily');

  // Mock data - replace with real data from your context
  const nutritionData = {
    daily: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      calories: Math.random() * 300 + 100,
      protein: Math.random() * 20 + 5,
      carbs: Math.random() * 30 + 10,
      fat: Math.random() * 15 + 5,
    })),
    weekly: Array.from({ length: 7 }, (_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      calories: Math.random() * 2000 + 1500,
      protein: Math.random() * 150 + 50,
      carbs: Math.random() * 250 + 100,
      fat: Math.random() * 80 + 30,
    })),
    monthly: Array.from({ length: 30 }, (_, i) => ({
      date: i + 1,
      calories: Math.random() * 2000 + 1500,
      protein: Math.random() * 150 + 50,
      carbs: Math.random() * 250 + 100,
      fat: Math.random() * 80 + 30,
    })),
  };

  const currentData = {
    daily: nutritionData.daily,
    weekly: nutritionData.weekly,
    monthly: nutritionData.monthly,
  }[selectedRange.toLowerCase() as keyof typeof nutritionData];

  const macronutrients = [
    { name: 'Protein', value: 75, color: '#34D399' },
    { name: 'Carbs', value: 180, color: '#60A5FA' },
    { name: 'Fat', value: 50, color: '#F472B6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nutrition Visualizations</h1>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <motion.button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold">Calorie Intake Trend</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey={
                    selectedRange === 'Daily'
                      ? 'time'
                      : selectedRange === 'Weekly'
                      ? 'day'
                      : 'date'
                  }
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#60A5FA"
                  fillOpacity={1}
                  fill="url(#colorCalories)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <PieChartIcon className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold">Macronutrient Distribution</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macronutrients}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macronutrients.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold">3D Macronutrient Visualization</h2>
          </div>
          <div className="h-[400px] w-full">
            <Canvas camera={{ position: [0, 0, 10] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <MacronutrientGlobe
                  position={[-4, 0, 0]}
                  color="#34D399"
                  label="Protein"
                  value={75}
                  maxValue={150}
                />
                <MacronutrientGlobe
                  position={[0, 0, 0]}
                  color="#60A5FA"
                  label="Carbs"
                  value={180}
                  maxValue={250}
                />
                <MacronutrientGlobe
                  position={[4, 0, 0]}
                  color="#F472B6"
                  label="Fat"
                  value={50}
                  maxValue={70}
                />
                <OrbitControls enableZoom={false} />
              </Suspense>
            </Canvas>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};