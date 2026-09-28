import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { FilterPanel } from './components/FilterPanel';
import { PropertyDetailsDrawer } from './components/PropertyDetailsDrawer';
import { VideoModal } from './components/VideoModal';
import { ToastContainer } from './components/Toast';
import { SellPropertyModal } from './components/sell/SellPropertyModal';
import { AdminPropertiesView } from './components/admin/AdminPropertiesView';

// Main Discovery Page Component
const DiscoveryPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <Header />
      <main className="flex-1 flex relative overflow-hidden">
        <MapView />
        <PropertyDetailsDrawer />
        <FilterPanel />
      </main>
    </div>
  );
};

// Sell Page Route: opens the map in location picking mode to mark property point
const SellRoutePage: React.FC = () => {
  const { startSellFlow } = useProperties();

  useEffect(() => {
    startSellFlow();
  }, [startSellFlow]);

  return <DiscoveryPage />;
};

export const App: React.FC = () => {
  return (
    <PropertyProvider>
      <Router>
        <div className="h-full flex flex-col bg-slate-50 font-sans antialiased">
          <Routes>
            <Route path="/" element={<DiscoveryPage />} />
            <Route path="/sell" element={<SellRoutePage />} />
            <Route path="/admin" element={<Navigate to="/admin/properties" replace />} />
            <Route path="/admin/properties" element={<AdminPropertiesView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Modals & Notifications */}
          <SellPropertyModal />
          <VideoModal />
          <ToastContainer />
        </div>
      </Router>
    </PropertyProvider>
  );
};

export default App;
