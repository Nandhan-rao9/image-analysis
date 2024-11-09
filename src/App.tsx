import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Analysis } from './pages/Analysis';
import { Profile } from './pages/Profile';
import { Visualizations } from './pages/Visualizations';
import { NutritionProvider } from './context/NutritionContext';

function App() {
  return (
    <BrowserRouter>
      <NutritionProvider> 
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </NutritionProvider>
    </BrowserRouter>
  );
}

export default App;