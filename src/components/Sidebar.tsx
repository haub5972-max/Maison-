import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Map, 
  ChefHat, 
  PlaySquare, 
  Users, 
  Settings,
  BookOpen,
  X,
  BarChart3,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: '/bao-cao', icon: BarChart3, label: 'Báo cáo chuyên sâu' },
    { path: '/dat-ban', icon: CalendarDays, label: 'Lịch đặt bàn' },
    { path: '/so-do-nha-hang', icon: Map, label: 'Sơ đồ nhà hàng' },
    { path: '/thuc-don', icon: BookOpen, label: 'Thực đơn' },
    { path: '/bep', icon: ChefHat, label: 'Bếp (Order)' },
    { path: '/dao-tao', icon: PlaySquare, label: 'Đào tạo nội bộ' },
    { path: '/khach-hang', icon: Users, label: 'Khách hàng (CRM)' },
    { path: '/cau-hinh', icon: Settings, label: 'Cấu hình' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 h-screen flex flex-col text-slate-300 flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">Maison Vie</span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Status */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/avatar1/100/100" 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div>
              <div className="text-white font-medium text-sm">Nguyễn Văn A</div>
              <div className="text-xs text-slate-400">Quản lý ca</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path === '/so-do-nha-hang' && currentPath === '/');
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-teal-500 text-white' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
