/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BookingKanban from './components/BookingKanban';
import RestaurantMap from './components/RestaurantMap';
import KitchenDisplay from './components/KitchenDisplay';
import TrainingPortal from './components/TrainingPortal';
import CustomerCRM from './components/CustomerCRM';
import Settings from './components/Settings';
import MenuManagement from './components/MenuManagement';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import MobileCaptainApp from './components/MobileCaptainApp';
import Login from './components/Login';

import UserProfile from './components/UserProfile';

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (isMobile) {
    return <MobileCaptainApp onLogout={handleLogout} />;
  }

  return (
    <Routes>
      <Route element={
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <Header 
              onAddBooking={() => setIsBookingModalOpen(true)} 
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            <main className="flex-1 relative">
              <Outlet />
            </main>
          </div>
        </div>
      }>
        <Route path="/" element={<Navigate to="/so-do-nha-hang" replace />} />
        <Route path="/so-do-nha-hang" element={<RestaurantMap />} />
        <Route path="/bao-cao" element={<AdvancedAnalytics />} />
        <Route path="/dat-ban" element={
          <BookingKanban 
            isModalOpen={isBookingModalOpen} 
            onToggleModal={setIsBookingModalOpen} 
          />
        } />
        <Route path="/thuc-don" element={<MenuManagement />} />
        <Route path="/quan-ly-thuc-don" element={<MenuManagement />} />
        <Route path="/bep" element={<KitchenDisplay />} />
        <Route path="/dao-tao" element={<TrainingPortal />} />
        <Route path="/khach-hang" element={<CustomerCRM />} />
        <Route path="/cau-hinh" element={<Settings />} />
        <Route path="/ho-so" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

