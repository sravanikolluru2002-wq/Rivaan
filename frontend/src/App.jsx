import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppDashboard from './pages/AppDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyLands from './pages/MyLands';
import Visits from './pages/Visits';
import { DcPage } from './pages/DcPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/agent"
          element={<DcPage sourcePath="/Rivan Agent Dashboard.dc.html" title="Rivan Agent Dashboard" />}
        />
        <Route
          path="/agent-dashboard"
          element={<DcPage sourcePath="/Rivan Agent Dashboard.dc.html" title="Rivan Agent Dashboard" />}
        />
        <Route path="/my-lands" element={<MyLands />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
