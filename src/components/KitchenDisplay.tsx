import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Flame, Check, ChefHat, BellRing, Filter, X } from 'lucide-react';

type ItemStatus = 'pending' | 'cooking' | 'done';
type ItemCategory = 'Khai vị' | 'Món chính' | 'Tráng miệng' | 'Đồ uống';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string[];
  status: ItemStatus;
  category: ItemCategory;
}

interface OrderTicket {
  id: string;
  table: string;
  orderTime: Date;
  items: OrderItem[];
  status: 'pending' | 'completed';
  bookingStatus: 'confirmed' | 'pending' | 'new' | 'arrived'; // Added booking status
}

const mockOrders: OrderTicket[] = [
  {
    id: '1',
    table: 'Bàn 1',
    orderTime: new Date(Date.now() - 1000 * 60 * 5),
    status: 'pending',
    bookingStatus: 'confirmed', // Confirmed booking
    items: [
      { id: '1-2', name: 'Súp bí đỏ', quantity: 2, status: 'done', category: 'Khai vị' },
      { id: '1-1', name: 'Bò bít tết (Medium Rare)', quantity: 2, notes: ['Sốt tiêu đen', 'Không hành tây'], status: 'cooking', category: 'Món chính' },
    ]
  },
  {
    id: '2',
    table: 'VIP 2',
    orderTime: new Date(Date.now() - 1000 * 60 * 12),
    status: 'pending',
    bookingStatus: 'pending', // Pending booking (should be hidden by default)
    items: [
      { id: '2-2', name: 'Salad Caesar', quantity: 1, status: 'pending', category: 'Khai vị' },
      { id: '2-1', name: 'Cá hồi áp chảo', quantity: 1, notes: ['DỊ ỨNG ĐẬU PHỘNG'], status: 'pending', category: 'Món chính' },
      { id: '2-3', name: 'Mỳ Ý Carbonara', quantity: 1, status: 'pending', category: 'Món chính' },
    ]
  },
  {
    id: '3',
    table: 'Bàn 5',
    orderTime: new Date(Date.now() - 1000 * 60 * 2),
    status: 'pending',
    bookingStatus: 'confirmed', // Confirmed booking
    items: [
      { id: '3-1', name: 'Gà nướng mật ong', quantity: 1, status: 'pending', category: 'Món chính' },
      { id: '3-2', name: 'Khoai tây chiên', quantity: 1, notes: ['Ít muối'], status: 'pending', category: 'Khai vị' },
    ]
  },
  {
    id: '4',
    table: 'Bàn 7',
    orderTime: new Date(Date.now() - 1000 * 60 * 18),
    status: 'pending',
    bookingStatus: 'arrived', // Arrived is also treated as confirmed/valid for kitchen
    items: [
      { id: '4-1', name: 'Lẩu hải sản (Lớn)', quantity: 1, notes: ['Cay nhiều'], status: 'cooking', category: 'Món chính' },
      { id: '4-2', name: 'Rau thêm', quantity: 2, status: 'done', category: 'Món chính' },
    ]
  },
];

const categoryOrder: Record<ItemCategory, number> = {
  'Khai vị': 1,
  'Món chính': 2,
  'Tráng miệng': 3,
  'Đồ uống': 4
};

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<OrderTicket[]>(mockOrders);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'All'>('All');
  const [filterTimeSlot, setFilterTimeSlot] = useState<'All' | 'Lunch' | 'Dinner'>('All');
  const [showConfirmedOnly, setShowConfirmedOnly] = useState(true);
  const [notification, setNotification] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (message: string) => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  const cycleItemStatus = (orderId: string, itemId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => {
            if (item.id === itemId) {
              const nextStatus: Record<ItemStatus, ItemStatus> = {
                'pending': 'cooking',
                'cooking': 'done',
                'done': 'pending'
              };
              return { ...item, status: nextStatus[item.status] };
            }
            return item;
          })
        };
      }
      return order;
    }));
  };

  const completeOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    showNotification('Đã hoàn thành đơn hàng!');
  };

  const notifyWaiter = (tableName: string) => {
    showNotification(`🔔 Đã báo nhân viên đến lấy món bàn ${tableName}`);
  };

  const getElapsedTime = (date: Date) => {
    const diff = Math.floor((currentTime.getTime() - date.getTime()) / 1000 / 60);
    return diff;
  };

  const getStatusStyles = (minutes: number) => {
    if (minutes >= 15) return {
      card: 'border-red-200 shadow-red-100',
      header: 'bg-red-50 text-red-700 border-b border-red-100',
      timer: 'text-red-600 bg-red-100 px-2 py-0.5 rounded'
    }; // Critical
    if (minutes >= 10) return {
      card: 'border-amber-200 shadow-amber-100',
      header: 'bg-amber-50 text-amber-700 border-b border-amber-100',
      timer: 'text-amber-600 bg-amber-100 px-2 py-0.5 rounded'
    }; // Warning
    return {
      card: 'border-gray-200 shadow-sm',
      header: 'bg-white text-gray-800 border-b border-gray-100',
      timer: 'text-gray-500 bg-gray-100 px-2 py-0.5 rounded'
    }; // Normal
  };

  const getItemStatusIcon = (status: ItemStatus) => {
    switch (status) {
      case 'pending': return <div className="w-2 h-2 rounded-full bg-gray-300" />;
      case 'cooking': return <ChefHat className="w-3.5 h-3.5 text-amber-500" />;
      case 'done': return <Check className="w-3.5 h-3.5 text-white" />;
    }
  };

  const getItemStatusStyle = (status: ItemStatus) => {
    switch (status) {
      case 'pending': return 'border-gray-300 bg-white hover:border-amber-400';
      case 'cooking': return 'border-amber-400 bg-amber-50 hover:border-green-500';
      case 'done': return 'bg-green-500 border-green-500 text-white';
    }
  };

  const filteredOrders = orders
    .filter(order => {
      // Filter by booking status
      if (showConfirmedOnly && !['confirmed', 'arrived'].includes(order.bookingStatus)) {
        return false;
      }

      // Filter by time slot
      if (filterTimeSlot === 'All') return true;
      const hour = order.orderTime.getHours();
      if (filterTimeSlot === 'Lunch') return hour >= 10 && hour < 15;
      if (filterTimeSlot === 'Dinner') return hour >= 17 && hour < 23;
      return true;
    })
    .map(order => ({
      ...order,
      items: filterCategory === 'All' ? order.items : order.items.filter(i => i.category === filterCategory)
    }))
    .filter(order => order.items.length > 0);

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 p-6 overflow-y-auto relative">
      {/* Toast Notification */}
      {notification.visible && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Màn hình Bếp (KDS)</h2>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {/* Confirmed Only Toggle */}
          <button
            onClick={() => setShowConfirmedOnly(!showConfirmedOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              showConfirmedOnly
                ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {showConfirmedOnly ? 'Đã xác nhận' : 'Tất cả trạng thái'}
          </button>

          {/* Time Slot Filter */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {(['All', 'Lunch', 'Dinner'] as const).map(slot => (
              <button
                key={slot}
                onClick={() => setFilterTimeSlot(slot)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterTimeSlot === slot 
                    ? 'bg-orange-50 text-orange-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {slot === 'All' ? 'Tất cả' : slot === 'Lunch' ? 'Trưa (10-15h)' : 'Tối (17-23h)'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm min-w-max">
              {(['All', 'Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    filterCategory === cat 
                      ? 'bg-teal-50 text-teal-700 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat === 'All' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300 hidden md:block"></div>

          <div className="hidden md:flex gap-4 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div> Chờ
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div> Nấu
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div> Xong
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0">
        {filteredOrders.map((order) => {
          const elapsed = getElapsedTime(order.orderTime);
          const isCritical = elapsed >= 15;
          const styles = getStatusStyles(elapsed);
          const allItemsDone = order.items.every(i => i.status === 'done');

          // Sort items by category
          const sortedItems = [...order.items].sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category]);

          return (
            <div 
              key={order.id} 
              className={`flex flex-col rounded-xl border bg-white transition-all shadow-sm ${styles.card}`}
            >
              {/* Header */}
              <div className={`px-4 py-3 flex justify-between items-center rounded-t-xl ${styles.header}`}>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {order.table}
                  {isCritical && <Flame className="w-5 h-5 text-red-500 animate-bounce" />}
                </h3>
                <div className={`flex items-center gap-1 font-mono text-sm font-bold ${styles.timer}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {elapsed}'
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 space-y-4">
                {sortedItems.map((item, index) => {
                  const showCategoryHeader = index === 0 || sortedItems[index - 1].category !== item.category;
                  
                  return (
                    <React.Fragment key={item.id}>
                      {showCategoryHeader && (
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2 mb-1 border-b border-gray-100 pb-1">
                          {item.category}
                        </div>
                      )}
                      <div 
                        onClick={() => cycleItemStatus(order.id, item.id)}
                        className={`group cursor-pointer select-none transition-all active:scale-[0.98] ${item.status === 'done' ? 'opacity-60' : 'opacity-100'}`}
                      >
                        <div className="flex items-start gap-3 py-1">
                          <div className={`mt-0.5 w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors shadow-sm ${getItemStatusStyle(item.status)}`}>
                            {getItemStatusIcon(item.status)}
                          </div>
                          
                          <div className="flex-1">
                            <div className={`text-base font-semibold leading-tight ${item.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              <span className="text-teal-600 mr-2 font-bold">{item.quantity}x</span>
                              {item.name}
                            </div>
                            
                            {/* Notes */}
                            {item.notes && item.notes.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {item.notes.map((note, idx) => {
                                  const isAllergy = note.toLowerCase().includes('dị ứng');
                                  return (
                                    <span 
                                      key={idx} 
                                      className={`
                                        inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border shadow-sm
                                        ${isAllergy 
                                          ? 'bg-red-50 text-red-700 border-red-200' 
                                          : 'bg-amber-50 text-amber-700 border-amber-200'}
                                      `}
                                    >
                                      <AlertTriangle className="w-3 h-3" />
                                      {note}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Footer Action */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 rounded-b-xl flex gap-3">
                <button 
                  onClick={() => notifyWaiter(order.table)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-white text-blue-600 border border-blue-200 shadow-sm active:bg-blue-50"
                >
                  <BellRing className="w-4 h-4" />
                  Báo món
                </button>
                <button 
                  onClick={() => completeOrder(order.id)}
                  disabled={!allItemsDone}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    allItemsDone 
                      ? 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  XONG
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

