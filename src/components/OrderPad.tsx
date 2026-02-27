import React, { useState } from 'react';
import { X, Plus, Minus, Search, ShoppingBag, Send, SplitSquareHorizontal, CheckCircle, ArrowRightLeft, Users } from 'lucide-react';

interface OrderPadProps {
  table: any;
  onClose: () => void;
}

const mockMenu = [
  { id: 'm1', name: 'Bò bít tết (Medium Rare)', price: 250000, category: 'Món chính' },
  { id: 'm2', name: 'Súp bí đỏ', price: 65000, category: 'Khai vị' },
  { id: 'm3', name: 'Salad Caesar', price: 85000, category: 'Khai vị' },
  { id: 'm4', name: 'Cá hồi áp chảo', price: 220000, category: 'Món chính' },
  { id: 'm5', name: 'Rượu vang đỏ', price: 850000, category: 'Đồ uống' },
  { id: 'm6', name: 'Mỳ Ý Carbonara', price: 180000, category: 'Món chính' },
  { id: 'm7', name: 'Pizza Hải sản', price: 210000, category: 'Món chính' },
  { id: 'm8', name: 'Khoai tây chiên', price: 45000, category: 'Khai vị' },
];

const mockTables = [
  { id: 'T1', name: 'Bàn 1' },
  { id: 'T2', name: 'Bàn 2' },
  { id: 'T3', name: 'Bàn 3' },
  { id: 'V1', name: 'VIP 1' },
];

export default function OrderPad({ table, onClose }: OrderPadProps) {
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSplitMergeOpen, setIsSplitMergeOpen] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [mergeTarget, setMergeTarget] = useState('');

  const filteredMenu = mockMenu.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (item: any) => {
    const existing = orderItems.find(i => i.id === item.id);
    if (existing) {
      setOrderItems(orderItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(orderItems.map(i => {
      if (i.id === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const handleSendOrder = () => {
    setIsOrderSent(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (isOrderSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Đã gửi đơn thành công!</h3>
          <p className="text-gray-500">Đơn hàng đã được chuyển xuống bếp.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex md:items-center justify-center bg-black/50 backdrop-blur-sm md:p-4">
      <div className="bg-white w-full h-full md:h-[85vh] md:max-w-5xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 relative">
        
        {/* Split/Merge Modal Overlay */}
        {isSplitMergeOpen && (
          <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <SplitSquareHorizontal className="w-5 h-5 text-teal-600" />
                  Tách / Gộp Bàn
                </h3>
                <button onClick={() => setIsSplitMergeOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Merge Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gộp bàn hiện tại vào:</label>
                  <div className="flex gap-2">
                    <select 
                      value={mergeTarget}
                      onChange={(e) => setMergeTarget(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">-- Chọn bàn --</option>
                      {mockTables.filter(t => t.name !== table.name).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <button 
                      disabled={!mergeTarget}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Hoặc</span>
                  </div>
                </div>

                {/* Split Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tách hóa đơn:</label>
                  <button className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Chọn món để tách sang đơn mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left Side: Menu Selection */}
        <div className="flex-1 flex flex-col bg-gray-50 border-r border-gray-200">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Thực đơn</h2>
            <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm món ăn..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredMenu.map(item => (
                <button 
                  key={item.id}
                  onClick={() => addItem(item)}
                  className="flex flex-col text-left p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all active:scale-95"
                >
                  <span className="text-xs font-medium text-teal-600 mb-1">{item.category}</span>
                  <span className="font-bold text-gray-800 mb-2 line-clamp-2">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-500 mt-auto">
                    {item.price.toLocaleString('vi-VN')}đ
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Ticket */}
        <div className="w-full md:w-96 flex flex-col bg-white h-[50vh] md:h-auto border-t md:border-t-0 border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-900 text-white flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Order: {table.name}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Khách: {table.customerName || 'Khách lẻ'}</p>
            </div>
            <button onClick={onClose} className="hidden md:block p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {orderItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <ShoppingBag className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium">Chưa có món nào được chọn</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 truncate">{item.name}</div>
                      <div className="text-sm text-gray-500">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-teal-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Tổng cộng</span>
              <span className="text-2xl font-bold text-teal-600">{total.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsSplitMergeOpen(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <SplitSquareHorizontal className="w-5 h-5" />
                Tách/Gộp
              </button>
              <button 
                onClick={handleSendOrder}
                disabled={orderItems.length === 0}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send className="w-5 h-5" />
                Gửi Bếp
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
