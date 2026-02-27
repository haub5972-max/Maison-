import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingKanban from './BookingKanban';
import TrainingPortal from './TrainingPortal';
import CustomerCRM from './CustomerCRM';
import Settings from './Settings';
import AdvancedAnalytics from './AdvancedAnalytics';
import MenuManagement from './MenuManagement';
import KitchenDisplay from './KitchenDisplay';
import { 
  Menu, 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Send, 
  CheckCircle, 
  Clock, 
  Users, 
  ChevronLeft,
  Utensils,
  LayoutGrid,
  Bell,
  CalendarDays,
  MoreHorizontal,
  BookOpen,
  Settings as SettingsIcon,
  BarChart3,
  ChefHat,
  LogOut
} from 'lucide-react';

// --- Mock Data (Synced with RestaurantMap) ---

const level1Tables = [
  { id: 'T1', name: 'Bàn 1', type: 'circle', status: 'occupied', pax: 4, customerName: 'Nguyễn Văn A', duration: '45p', notes: 'Khách quen' },
  { id: 'T2', name: 'Bàn 2', type: 'circle', status: 'empty', pax: 4 },
  { id: 'T3', name: 'Bàn 3', type: 'square', status: 'reserved', pax: 6, customerName: 'Trần Thị B', time: '19:00', notes: 'Sinh nhật' },
  { id: 'T4', name: 'Bàn 4', type: 'square', status: 'empty', pax: 6 },
  { id: 'T5', name: 'Bàn 5', type: 'circle', status: 'occupied', pax: 2, customerName: 'Lê Văn C', duration: '1h 10p' },
  { id: 'T6', name: 'Bàn 6', type: 'circle', status: 'empty', pax: 2 },
  { id: 'T7', name: 'Bàn 7', type: 'square', status: 'reserved', pax: 8, customerName: 'Công ty XYZ', time: '18:30', notes: 'Cần ghế trẻ em' },
  { id: 'T8', name: 'Bàn 8', type: 'square', status: 'empty', pax: 8 },
  { id: 'T9', name: 'Bàn 9', type: 'circle', status: 'empty', pax: 4 },
  { id: 'T10', name: 'Bàn 10', type: 'circle', status: 'occupied', pax: 4, customerName: 'Phạm Văn D', duration: '20p' },
  { id: 'T11', name: 'Bàn 11', type: 'square', status: 'empty', pax: 4 },
  { id: 'T12', name: 'Bàn 12', type: 'square', status: 'empty', pax: 4 },
];

const vipRooms = [
  { id: 'V1', name: 'VIP 1 (Lotus)', capacity: 4, status: 'empty' },
  { id: 'V2', name: 'VIP 2 (Orchid)', capacity: 8, status: 'in-use', customerName: 'Nguyễn Sếp', time: '18:00', notes: 'Rượu vang riêng' },
  { id: 'V3', name: 'VIP 3 (Rose)', capacity: 10, status: 'empty' },
  { id: 'V4', name: 'VIP 4 (Royal)', capacity: 20, status: 'in-use', customerName: 'Đoàn khách Nhật', time: '17:30' },
];

const eventHall = [
  { id: 'E1', name: 'Sảnh A', capacity: 70, status: 'empty' },
  { id: 'E2', name: 'Sảnh B', capacity: 70, status: 'reserved', customerName: 'Tiệc cưới', time: '11:00' }
];

const menuItems = [
  { id: 'm1', name: 'Bò bít tết', price: 250000, category: 'Món chính' },
  { id: 'm2', name: 'Súp bí đỏ', price: 65000, category: 'Khai vị' },
  { id: 'm3', name: 'Salad Caesar', price: 85000, category: 'Khai vị' },
  { id: 'm4', name: 'Cá hồi áp chảo', price: 220000, category: 'Món chính' },
  { id: 'm5', name: 'Rượu vang đỏ', price: 850000, category: 'Đồ uống' },
  { id: 'm6', name: 'Mỳ Ý Carbonara', price: 180000, category: 'Món chính' },
  { id: 'm7', name: 'Pizza Hải sản', price: 210000, category: 'Món chính' },
  { id: 'm8', name: 'Khoai tây chiên', price: 45000, category: 'Khai vị' },
  { id: 'm9', name: 'Nước suối', price: 15000, category: 'Đồ uống' },
  { id: 'm10', name: 'Trà đào', price: 45000, category: 'Đồ uống' },
];

type ViewState = 'tables' | 'menu' | 'cart' | 'success' | 'bookings' | 'more' | 'training' | 'crm' | 'settings' | 'reports' | 'menu-management' | 'kitchen';

interface MobileCaptainAppProps {
  onLogout?: () => void;
}

export default function MobileCaptainApp({ onLogout }: MobileCaptainAppProps) {
  const [view, setView] = useState<ViewState>('tables');
  const [activeZone, setActiveZone] = useState<'T1' | 'T2' | 'T3'>('T1');
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Sync URL with View
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/quan-ly-thuc-don')) setView('menu-management');
    else if (path.includes('/bep')) setView('kitchen');
    else if (path.includes('/thuc-don')) setView('menu');
    else if (path.includes('/dat-ban')) setView('bookings');
    else if (path.includes('/dao-tao')) setView('training');
    else if (path.includes('/khach-hang')) setView('crm');
    else if (path.includes('/cau-hinh')) setView('settings');
    else if (path.includes('/bao-cao')) setView('reports');
    else if (path.includes('/so-do-nha-hang') || path === '/') setView('tables');
    // 'cart', 'success', 'more' are internal states, usually not directly linked to a URL unless we want to
  }, [location.pathname]);

  const handleSetView = (newView: ViewState) => {
    setView(newView);
    switch (newView) {
      case 'tables': navigate('/so-do-nha-hang'); break;
      case 'menu': navigate('/thuc-don'); break;
      case 'bookings': navigate('/dat-ban'); break;
      case 'training': navigate('/dao-tao'); break;
      case 'crm': navigate('/khach-hang'); break;
      case 'settings': navigate('/cau-hinh'); break;
      case 'reports': navigate('/bao-cao'); break;
      case 'menu-management': navigate('/quan-ly-thuc-don'); break;
      case 'kitchen': navigate('/bep'); break;
      // For internal views, we might not want to change URL or just keep current
      case 'more': 
      case 'cart':
      case 'success':
        // Optional: could have specific routes for these too
        break;
    }
  };

  // --- Helpers ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': 
      case 'in-use':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'reserved': return 'bg-yellow-50 border-yellow-400 text-yellow-700';
      default: return 'bg-white border-gray-200 text-gray-500';
    }
  };

  const filteredMenu = menuItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item: any) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(i => {
      if (i.id === id) {
        return { ...i, quantity: Math.max(0, i.quantity + delta) };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSendOrder = () => {
    handleSetView('success');
    setTimeout(() => {
      setCart([]);
      setSelectedTable(null);
      handleSetView('tables');
    }, 2000);
  };

  const renderTables = () => (
    <div className="h-full flex flex-col pb-24 bg-gray-50">
      {/* Zone Selector */}
      <div className="bg-white p-2 shadow-sm flex gap-2 overflow-x-auto no-scrollbar sticky top-0 z-10">
        <button 
          onClick={() => setActiveZone('T1')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeZone === 'T1' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
        >
          Tầng 1 (Sảnh)
        </button>
        <button 
          onClick={() => setActiveZone('T2')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeZone === 'T2' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
        >
          Tầng 2 (VIP)
        </button>
        <button 
          onClick={() => setActiveZone('T3')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeZone === 'T3' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
        >
          Tầng 3 (Sự kiện)
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeZone === 'T1' && (
          <div className="grid grid-cols-3 gap-4">
            {level1Tables.map(table => (
              <div 
                key={table.id}
                onClick={() => {
                  setSelectedTable(table);
                  handleSetView('menu');
                }}
                className={`
                  relative p-2 rounded-2xl border-2 shadow-sm flex flex-col items-center justify-center aspect-square active:scale-95 transition-transform
                  ${getStatusColor(table.status)}
                  ${table.type === 'circle' ? 'rounded-full' : 'rounded-2xl'}
                `}
              >
                <span className="text-lg font-bold mb-1">{table.name.replace('Bàn ', '')}</span>
                <div className="flex items-center gap-1 text-[10px] font-medium opacity-80">
                  <Users className="w-3 h-3" /> {table.pax}
                </div>
                {table.status === 'occupied' && (
                  <div className="absolute -top-2 -right-2 bg-white border border-green-200 px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center shadow-sm text-green-700 z-10">
                    {table.duration}
                  </div>
                )}
                {table.status === 'reserved' && (
                  <div className="absolute -top-2 -right-2 bg-white border border-yellow-200 px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center shadow-sm text-yellow-700 z-10">
                    {table.time}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeZone === 'T2' && (
          <div className="grid grid-cols-2 gap-4">
            {vipRooms.map(room => (
              <div 
                key={room.id}
                onClick={() => {
                  setSelectedTable(room);
                  handleSetView('menu');
                }}
                className={`
                  relative p-4 rounded-2xl border-2 shadow-sm flex flex-col justify-between h-32 active:scale-95 transition-transform
                  ${getStatusColor(room.status)}
                `}
              >
                <div>
                  <span className="text-lg font-bold block">{room.name.split('(')[0]}</span>
                  <span className="text-xs opacity-70 block">{room.name.split('(')[1]?.replace(')', '')}</span>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center gap-1 text-xs font-medium opacity-80">
                    <Users className="w-3 h-3" /> {room.capacity}
                  </div>
                  {room.status === 'in-use' && (
                    <div className="bg-white/80 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {room.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeZone === 'T3' && (
          <div className="space-y-4">
            {eventHall.map(hall => (
              <div 
                key={hall.id}
                onClick={() => {
                  setSelectedTable(hall);
                  handleSetView('menu');
                }}
                className={`
                  relative p-6 rounded-2xl border-2 shadow-sm flex flex-col justify-between h-40 active:scale-95 transition-transform
                  ${getStatusColor(hall.status)}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xl font-bold block">{hall.name}</span>
                    <div className="flex items-center gap-2 text-sm font-medium opacity-80 mt-1">
                      <Users className="w-4 h-4" /> Sức chứa: {hall.capacity}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${hall.status === 'empty' ? 'bg-gray-100 text-gray-500' : 'bg-white/50 text-current'}`}>
                    {hall.status === 'empty' ? 'Trống' : 'Đã đặt'}
                  </div>
                </div>

                {hall.status === 'reserved' && (
                  <div className="mt-4 pt-4 border-t border-current/20">
                    <div className="font-bold">{hall.customerName}</div>
                    <div className="text-xs opacity-80">Thời gian: {hall.time}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="flex flex-col h-full pb-24">
      {/* Search & Filter */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="relative mb-3">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm món..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Khai vị', 'Món chính', 'Đồ uống'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                ${activeCategory === cat ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}
              `}
            >
              {cat === 'All' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMenu.map(item => {
          const inCart = cart.find(i => i.id === item.id);
          return (
            <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div>
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-sm text-teal-600 font-medium">{item.price.toLocaleString()}đ</p>
              </div>
              {inCart ? (
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-red-500">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-4 text-center">{inCart.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-teal-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(item)}
                  className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="flex flex-col h-full pb-24 p-4">
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <ShoppingBag className="w-16 h-16 opacity-20 mb-4" />
          <p>Chưa có món nào</p>
          <button onClick={() => handleSetView('menu')} className="mt-4 text-teal-600 font-bold">
            + Thêm món
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div>
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">{(item.price * item.quantity).toLocaleString()}đ</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-red-500">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-teal-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Tổng cộng</span>
              <span className="text-2xl font-bold text-teal-600">{totalAmount.toLocaleString()}đ</span>
            </div>
            <button 
              onClick={handleSendOrder}
              className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Gửi Bếp
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center h-full pb-20 animate-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã gửi đơn!</h2>
      <p className="text-gray-500">Đang chuyển về danh sách bàn...</p>
    </div>
  );

  const renderMoreMenu = () => (
    <div className="p-4 grid grid-cols-2 gap-4 pb-24">
      <button 
        onClick={() => handleSetView('menu-management')}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform h-40"
      >
        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
          <Utensils className="w-7 h-7" />
        </div>
        <span className="font-bold text-gray-800">Quản lý thực đơn</span>
      </button>

      <button 
        onClick={() => handleSetView('kitchen')}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform h-40"
      >
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-3">
          <ChefHat className="w-7 h-7" />
        </div>
        <span className="font-bold text-gray-800">Bếp (KDS)</span>
      </button>

      <button 
        onClick={() => handleSetView('training')}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform h-40"
      >
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
          <BookOpen className="w-7 h-7" />
        </div>
        <span className="font-bold text-gray-800">Đào tạo nội bộ</span>
      </button>

      <button 
        onClick={() => handleSetView('crm')}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform h-40"
      >
        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
          <Users className="w-7 h-7" />
        </div>
        <span className="font-bold text-gray-800">Khách hàng CRM</span>
      </button>

      <button 
        onClick={() => handleSetView('settings')}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform h-40"
      >
        <div className="w-14 h-14 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center mb-3">
          <SettingsIcon className="w-7 h-7" />
        </div>
        <span className="font-bold text-gray-800">Cấu hình</span>
      </button>

      <button 
        onClick={() => handleSetView('reports')}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform h-40"
      >
        <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-3">
          <BarChart3 className="w-7 h-7" />
        </div>
        <span className="font-bold text-gray-800">Báo cáo nhanh</span>
      </button>

      <button 
        onClick={onLogout}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform h-40 col-span-2"
      >
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-3">
          <LogOut className="w-7 h-7" />
        </div>
        <span className="font-bold text-gray-800">Đăng xuất</span>
      </button>
    </div>
  );

  const isFullScreenView = ['training', 'crm', 'settings', 'reports', 'menu-management', 'kitchen'].includes(view);

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      {!isFullScreenView && view !== 'bookings' && (
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {view !== 'tables' && view !== 'success' && view !== 'more' && (
              <button onClick={() => handleSetView('tables')} className="p-1 -ml-2 text-gray-500">
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div>
              <h1 className="font-bold text-lg text-gray-800">
                {view === 'tables' ? 'Sơ đồ nhà hàng' : 
                 view === 'more' ? 'Tiện ích mở rộng' :
                 selectedTable?.name}
              </h1>
              {selectedTable && view !== 'tables' && view !== 'more' && (
                <p className="text-xs text-gray-500">
                  {selectedTable.pax || selectedTable.capacity} khách • {
                    ['occupied', 'in-use'].includes(selectedTable.status) ? 'Đang phục vụ' : 
                    selectedTable.status === 'reserved' ? 'Đã đặt' : 'Mới'
                  }
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {view === 'tables' && renderTables()}
        {view === 'menu' && renderMenu()}
        {view === 'cart' && renderCart()}
        {view === 'success' && renderSuccess()}
        {view === 'bookings' && <BookingKanban />}
        {view === 'more' && renderMoreMenu()}
        {view === 'training' && (
          <div className="h-full flex flex-col pb-24">
            <div className="bg-white border-b px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleSetView('more')}><ChevronLeft /></button>
              <h2 className="font-bold">Đào tạo</h2>
            </div>
            <div className="flex-1 min-h-0">
              <TrainingPortal />
            </div>
          </div>
        )}
        {view === 'crm' && (
          <div className="h-full flex flex-col pb-24">
            <div className="bg-white border-b px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleSetView('more')}><ChevronLeft /></button>
              <h2 className="font-bold">Khách hàng</h2>
            </div>
            <div className="flex-1 min-h-0">
              <CustomerCRM />
            </div>
          </div>
        )}
        {view === 'settings' && (
          <div className="h-full overflow-y-auto pb-24">
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-2">
              <button onClick={() => handleSetView('more')}><ChevronLeft /></button>
              <h2 className="font-bold">Cấu hình</h2>
            </div>
            <Settings />
          </div>
        )}
        {view === 'reports' && (
          <div className="h-full flex flex-col pb-24">
            <div className="bg-white border-b px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleSetView('more')}><ChevronLeft /></button>
              <h2 className="font-bold">Báo cáo</h2>
            </div>
            <div className="flex-1 min-h-0">
              <AdvancedAnalytics />
            </div>
          </div>
        )}
        {view === 'menu-management' && (
          <div className="h-full flex flex-col pb-24">
            <div className="bg-white border-b px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleSetView('more')}><ChevronLeft /></button>
              <h2 className="font-bold">Quản lý thực đơn</h2>
            </div>
            <div className="flex-1 min-h-0">
              <MenuManagement />
            </div>
          </div>
        )}
        {view === 'kitchen' && (
          <div className="h-full flex flex-col pb-24">
            <div className="bg-white border-b px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleSetView('more')}><ChevronLeft /></button>
              <h2 className="font-bold">Màn hình Bếp</h2>
            </div>
            <div className="flex-1 min-h-0">
              <KitchenDisplay />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {view !== 'success' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 flex justify-between items-center z-30 pb-safe">
          <button 
            onClick={() => handleSetView('tables')}
            className={`flex flex-col items-center gap-1 w-1/5 ${view === 'tables' ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[10px] font-bold">Bàn</span>
          </button>
          
          <button 
            onClick={() => {
              if (selectedTable) handleSetView('menu');
              else if (view === 'tables') alert('Vui lòng chọn bàn trước!');
              else handleSetView('tables'); // Fallback to tables if not selected
            }}
            className={`flex flex-col items-center gap-1 w-1/5 ${view === 'menu' ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <Utensils className="w-6 h-6" />
            <span className="text-[10px] font-bold">Thực đơn</span>
          </button>

          <button 
            onClick={() => handleSetView('bookings')}
            className={`flex flex-col items-center gap-1 w-1/5 ${view === 'bookings' ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <CalendarDays className="w-6 h-6" />
            <span className="text-[10px] font-bold">Lịch đặt</span>
          </button>

          <button 
            onClick={() => {
              if (selectedTable) handleSetView('cart');
              else if (view === 'tables') alert('Vui lòng chọn bàn trước!');
              else handleSetView('tables');
            }}
            className={`relative flex flex-col items-center gap-1 w-1/5 ${view === 'cart' ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">Đơn hàng</span>
          </button>

          <button 
            onClick={() => handleSetView('more')}
            className={`flex flex-col items-center gap-1 w-1/5 ${['more', 'training', 'crm', 'settings', 'reports', 'menu-management', 'kitchen'].includes(view) ? 'text-teal-600' : 'text-gray-400'}`}
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-bold">Thêm</span>
          </button>
        </div>
      )}
    </div>
  );
}
