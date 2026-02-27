import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronLeft, ChevronRight, Plus, Menu, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onAddBooking?: () => void;
  onMenuClick: () => void;
}

const VIEW_TITLES: Record<string, string> = {
  '/bao-cao': 'Báo cáo chuyên sâu',
  '/dat-ban': 'Quản lý Đặt Bàn',
  '/so-do-nha-hang': 'Sơ đồ nhà hàng',
  '/thuc-don': 'Quản lý Thực đơn',
  '/bep': 'Bếp (Order)',
  '/dao-tao': 'Đào tạo nội bộ',
  '/khach-hang': 'Khách hàng (CRM)',
  '/cau-hinh': 'Cấu hình hệ thống',
  '/ho-so': 'Hồ sơ cá nhân',
};

export default function Header({ onAddBooking, onMenuClick }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const title = VIEW_TITLES[currentPath] || (currentPath === '/' ? 'Sơ đồ nhà hàng' : 'Maison Vie');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 flex flex-col">
      {/* Top Header */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="hidden md:block w-px h-6 bg-gray-200"></div>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-200"
            >
              <img 
                src="https://picsum.photos/seed/avatar1/100/100" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">Nguyễn Văn A</p>
                    <p className="text-xs text-gray-500 truncate">a.nguyen@maisonvie.com</p>
                  </div>
                  <button 
                    onClick={() => {
                      navigate('/ho-so');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Hồ sơ cá nhân
                  </button>
                  <button 
                    onClick={() => {
                      // Handle logout
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar - Only for Booking View */}
      {currentPath === '/dat-ban' && (
        <div className="px-4 md:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50/50 gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
            {/* Date Filter */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full md:w-auto">
              <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 border-r border-gray-200">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center md:flex-none px-4 py-1.5 text-sm font-medium text-gray-700">
                Hôm nay, 24/10/2023
              </div>
              <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 border-l border-gray-200">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-2 text-xs md:text-sm w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="whitespace-nowrap px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md font-medium border border-gray-200">
                Sức chứa: 250
              </div>
              <div className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-100">
                Đã đặt: 120
              </div>
              <div className="whitespace-nowrap px-3 py-1.5 bg-green-50 text-green-700 rounded-md font-medium border border-green-100">
                Còn trống: 130
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm tên khách, SĐT..." 
                className="w-full md:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
              />
            </div>

            {/* Add Button */}
            <button 
              onClick={onAddBooking}
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Đặt bàn mới</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
