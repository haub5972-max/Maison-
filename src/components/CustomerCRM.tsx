import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Star, 
  AlertTriangle, 
  X,
  History,
  Tag,
  ChevronRight,
  PhoneCall
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  group: 'VIP' | 'Regular' | 'New';
  lastVisit: string;
  totalSpent: string;
  visitCount: number;
  noShowRate: number; // Percentage
  tags: string[];
  history: {
    date: string;
    amount: string;
    status: 'completed' | 'cancelled' | 'no-show';
    pax: number;
  }[];
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Nguyễn Trọng Hữu',
    phone: '0901234567',
    email: 'huu.nguyen@example.com',
    group: 'VIP',
    lastVisit: '20/10/2023',
    totalSpent: '15.500.000đ',
    visitCount: 12,
    noShowRate: 0,
    tags: ['Thích vang đỏ', 'Ngồi gần cửa sổ', 'Dị ứng tôm'],
    history: [
      { date: '20/10/2023', amount: '2.500.000đ', status: 'completed', pax: 4 },
      { date: '15/09/2023', amount: '1.800.000đ', status: 'completed', pax: 2 },
      { date: '02/08/2023', amount: '3.200.000đ', status: 'completed', pax: 6 },
    ]
  },
  {
    id: '2',
    name: 'Trần Thị Bích',
    phone: '0912345678',
    email: 'bich.tran@example.com',
    group: 'Regular',
    lastVisit: '05/10/2023',
    totalSpent: '4.200.000đ',
    visitCount: 5,
    noShowRate: 20,
    tags: ['Ăn chay', 'Thích yên tĩnh'],
    history: [
      { date: '05/10/2023', amount: '800.000đ', status: 'completed', pax: 2 },
      { date: '12/09/2023', amount: '0đ', status: 'no-show', pax: 2 },
    ]
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    phone: '0987654321',
    email: 'cuong.le@example.com',
    group: 'New',
    lastVisit: '24/10/2023',
    totalSpent: '1.200.000đ',
    visitCount: 1,
    noShowRate: 0,
    tags: ['Khách mới'],
    history: [
      { date: '24/10/2023', amount: '1.200.000đ', status: 'completed', pax: 4 },
    ]
  },
  {
    id: '4',
    name: 'Phạm Hoàng Anh',
    phone: '0933445566',
    email: 'anh.pham@example.com',
    group: 'Regular',
    lastVisit: '01/10/2023',
    totalSpent: '8.500.000đ',
    visitCount: 8,
    noShowRate: 50, // High no-show rate
    tags: ['Hay đổi giờ', 'Thích bàn tròn'],
    history: [
      { date: '01/10/2023', amount: '1.500.000đ', status: 'completed', pax: 4 },
      { date: '20/09/2023', amount: '0đ', status: 'no-show', pax: 4 },
      { date: '10/09/2023', amount: '0đ', status: 'cancelled', pax: 2 },
    ]
  },
];

export default function CustomerCRM() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getGroupBadge = (group: string) => {
    switch (group) {
      case 'VIP': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Regular': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'New': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-gray-500 bg-gray-100';
      case 'no-show': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600';
    }
  };

  const renderMobileView = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm khách hàng..." 
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl border border-gray-200 active:bg-gray-200">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockCustomers.map((customer) => (
          <div 
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:bg-gray-50 flex items-center gap-4"
          >
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white shadow-sm flex-shrink-0 ${
              customer.group === 'VIP' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {customer.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-gray-900 truncate">{customer.name}</h3>
                {customer.group === 'VIP' && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-3 h-3" />
                <span className="font-mono">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getGroupBadge(customer.group)}`}>
                  {customer.group}
                </span>
                {customer.noShowRate > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200">
                    No-show: {customer.noShowRate}%
                  </span>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="flex-shrink-0">
              <button className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      {/* Main List Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Khách hàng</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm tên, SĐT..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-64"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Nhóm khách</th>
                  <th className="px-6 py-4">Lần cuối đến</th>
                  <th className="px-6 py-4 text-center">No-show</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => setSelectedCustomer(customer)}
                    className={`cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? 'bg-teal-50/50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{customer.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGroupBadge(customer.group)}`}>
                        {customer.group}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.lastVisit}</td>
                    <td className="px-6 py-4 text-center">
                      {customer.noShowRate > 0 ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          customer.noShowRate >= 50 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {customer.noShowRate}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedCustomer && (
        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-10 transition-transform duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Hồ sơ khách hàng</h3>
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Profile Info */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-400 border-4 border-white shadow-sm">
                {selectedCustomer.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedCustomer.name}</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getGroupBadge(selectedCustomer.group)}`}>
                  {selectedCustomer.group}
                </span>
                {selectedCustomer.group === 'VIP' && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> SĐT
                  </div>
                  <div className="text-sm font-medium text-gray-900">{selectedCustomer.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Lần cuối
                  </div>
                  <div className="text-sm font-medium text-gray-900">{selectedCustomer.lastVisit}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Chi tiêu
                  </div>
                  <div className="text-sm font-medium text-gray-900">{selectedCustomer.totalSpent}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <History className="w-3 h-3" /> Số lần đến
                  </div>
                  <div className="text-sm font-medium text-gray-900">{selectedCustomer.visitCount} lần</div>
                </div>
              </div>
            </div>

            {/* Warning Section */}
            {selectedCustomer.noShowRate >= 20 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-700 mb-1">Cảnh báo No-show cao</h4>
                  <p className="text-xs text-red-600 leading-relaxed">
                    Khách hàng này có tỷ lệ không đến (No-show) là <span className="font-bold">{selectedCustomer.noShowRate}%</span>. 
                    Vui lòng xác nhận kỹ trước khi giữ bàn.
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                Sở thích & Ghi chú
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCustomer.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100"
                  >
                    {tag}
                  </span>
                ))}
                <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-400 text-xs font-medium rounded-lg hover:border-gray-400 hover:text-gray-500 transition-colors">
                  + Thêm tag
                </button>
              </div>
            </div>

            {/* History Timeline */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-gray-400" />
                Lịch sử đặt bàn
              </h4>
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                {selectedCustomer.history.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                      item.status === 'completed' ? 'bg-green-500' : 
                      item.status === 'no-show' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.date}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.pax} Pax • {item.amount}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Drawer Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
              Tạo đặt bàn mới
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
      
      {/* Mobile Detail Modal */}
      {isMobile && selectedCustomer && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex flex-col animate-in slide-in-from-bottom duration-300"
          onClick={() => setSelectedCustomer(null)}
        >
          <div 
            className="bg-white h-[90%] mt-auto rounded-t-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 sticky top-0">
            <h3 className="font-bold text-gray-800">Thông tin khách hàng</h3>
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="p-2 bg-white rounded-full shadow-sm border border-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
             <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-white shadow-sm">
                {selectedCustomer.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedCustomer.name}</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getGroupBadge(selectedCustomer.group)}`}>
                  {selectedCustomer.group}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    {selectedCustomer.phone}
                    <a href={`tel:${selectedCustomer.phone}`} className="ml-auto w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <PhoneCall className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Tổng chi tiêu</div>
                  <div className="font-bold text-gray-900">{selectedCustomer.totalSpent}</div>
                </div>
              </div>
            </div>

             <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Lịch sử gần đây</h4>
                  <div className="space-y-3">
                    {selectedCustomer.history.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <div className="font-bold text-gray-900">{item.date}</div>
                          <div className="text-xs text-gray-500">{item.pax} khách • {item.amount}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200">
              Đặt bàn mới
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
