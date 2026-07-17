import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login'));
const AppDashboard = lazy(() => import('./pages/AppDashboard'));
const MyLands = lazy(() => import('./pages/MyLands'));
const Visits = lazy(() => import('./pages/Visits'));
const AgentDashboard = lazy(() => import('./pages/AgentDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function AppLoader() {
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#eef6ea', color: '#1f5a31', fontWeight: 800 }}>
      Loading Rivan Realty...
    </div>
  );
}

export default function App() {
  const [isOffline, setIsOffline] = useState(() => (
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  ));

  useEffect(() => {
    const updateOnlineState = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);
    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
    };
  }, []);

  return (
    <BrowserRouter>
      {isOffline && (
        <div className="rv-offline-banner" role="status">
          You are offline. Saved pages will still open, and live data will sync when connection returns.
        </div>
      )}
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/my-lands" element={<MyLands />} />
          <Route path="/visits" element={<Visits />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
