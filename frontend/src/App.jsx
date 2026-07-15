import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppDashboard from './pages/AppDashboard';
import MyLands from './pages/MyLands';
import Visits from './pages/Visits';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';

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
    </BrowserRouter>
  );
}
