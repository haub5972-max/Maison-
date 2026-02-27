import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart, 
  Scatter, 
  ZAxis,
  ReferenceLine,
  Cell,
  Legend,
  PieChart,
  Pie
} from 'recharts';
import { TrendingUp, Award, AlertCircle, DollarSign, Clock, Users, Calendar, Download, PieChart as PieChartIcon, Activity } from 'lucide-react';

// --- Mock Data ---

// 1. Golden Hour Data
const goldenHourData = [
  { hour: '10:00', orders: 12, revenue: 1500000 },
  { hour: '11:00', orders: 28, revenue: 4200000 },
  { hour: '12:00', orders: 85, revenue: 15800000 },
  { hour: '13:00', orders: 65, revenue: 9500000 },
  { hour: '14:00', orders: 20, revenue: 2500000 },
  { hour: '15:00', orders: 15, revenue: 1800000 },
  { hour: '16:00', orders: 18, revenue: 2100000 },
  { hour: '17:00', orders: 45, revenue: 6800000 },
  { hour: '18:00', orders: 95, revenue: 18500000 },
  { hour: '19:00', orders: 110, revenue: 22000000 },
  { hour: '20:00', orders: 80, revenue: 14500000 },
  { hour: '21:00', orders: 40, revenue: 6000000 },
];

// 2. Menu Engineering Data (Boston Matrix)
// x: Popularity (Quantity Sold), y: Profitability (Margin in VND)
const menuMatrixData = [
  { name: 'Bò Wagyu', x: 80, y: 500000, type: 'Star' }, // High Pop, High Margin
  { name: 'Rượu Vang', x: 40, y: 800000, type: 'Puzzle' }, // Low Pop, High Margin
  { name: 'Cơm chiên', x: 150, y: 20000, type: 'Plowhorse' }, // High Pop, Low Margin
  { name: 'Salad Nga', x: 20, y: 15000, type: 'Dog' }, // Low Pop, Low Margin
  { name: 'Mỳ Ý', x: 100, y: 80000, type: 'Star' },
  { name: 'Khoai tây chiên', x: 120, y: 15000, type: 'Plowhorse' },
  { name: 'Tôm hùm', x: 30, y: 400000, type: 'Puzzle' },
  { name: 'Nước suối', x: 200, y: 5000, type: 'Plowhorse' },
];

// 3. Staff Performance
const staffData = [
  { name: 'Nguyễn Văn A', sales: 45000000, orders: 120, upsell: 15 },
  { name: 'Trần Thị B', sales: 38000000, orders: 110, upsell: 8 },
  { name: 'Lê Văn C', sales: 52000000, orders: 140, upsell: 22 },
  { name: 'Phạm Thị D', sales: 28000000, orders: 90, upsell: 5 },
  { name: 'Hoàng Văn E', sales: 31000000, orders: 95, upsell: 10 },
];

// 4. Booking Sources (RPT-01)
const sourceData = [
  { name: 'Website', value: 35, color: '#10B981' }, // Green
  { name: 'Fanpage', value: 25, color: '#3B82F6' }, // Blue
  { name: 'Walk-in', value: 15, color: '#F59E0B' }, // Yellow
  { name: 'OTA/Lữ hành', value: 25, color: '#6366F1' }, // Indigo
];

// 5. Booking Status / Loss Rate (RPT-04)
const statusData = [
  { name: 'Tuần 1', completed: 120, cancelled: 5, noshow: 2 },
  { name: 'Tuần 2', completed: 135, cancelled: 8, noshow: 4 },
  { name: 'Tuần 3', completed: 110, cancelled: 3, noshow: 1 },
  { name: 'Tuần 4', completed: 140, cancelled: 6, noshow: 3 },
];

const COLORS = {
  Star: '#10B981', // Green
  Plowhorse: '#F59E0B', // Yellow
  Puzzle: '#3B82F6', // Blue
  Dog: '#EF4444', // Red
};

export default function AdvancedAnalytics() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderMobileView = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-800">Báo cáo</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-100 rounded-lg text-gray-600">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="p-2 bg-teal-600 text-white rounded-lg shadow-sm">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* 1. Golden Hour Analysis (Mobile) */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Khung giờ vàng</h3>
              <p className="text-xs text-gray-500">Phân tích theo giờ</p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goldenHourData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={5} interval={2} />
                <YAxis yAxisId="left" orientation="left" stroke="#10B981" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(value) : value,
                    name === 'revenue' ? 'Doanh thu' : 'Đơn'
                  ]}
                />
                <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#10B981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-800 text-xs">Đề xuất nhân sự</h4>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Cao điểm: <strong>12:00-13:00</strong> & <strong>18:00-20:00</strong>. 
                Tăng cường nhân viên tối đa.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Staff Performance (Mobile) */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Top nhân viên</h3>
              <p className="text-xs text-gray-500">Doanh thu cao nhất</p>
            </div>
          </div>

          <div className="space-y-3">
            {staffData.sort((a, b) => b.sales - a.sales).slice(0, 3).map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs
                    ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{staff.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                      <span>{staff.orders} đơn</span>
                      <span className="text-green-600 font-medium">{staff.upsell}% Upsell</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-teal-600 text-sm">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(staff.sales)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Menu Engineering (Mobile - Simplified) */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Menu Matrix</h3>
              <p className="text-xs text-gray-500">Phân tích món ăn</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="text-xs font-bold text-green-700 uppercase mb-1">Ngôi sao</div>
                <div className="text-sm font-bold text-gray-800">Bò Wagyu</div>
                <div className="text-[10px] text-gray-500">Lãi cao • Bán chạy</div>
             </div>
             <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <div className="text-xs font-bold text-yellow-700 uppercase mb-1">Bò sữa</div>
                <div className="text-sm font-bold text-gray-800">Cơm chiên</div>
                <div className="text-[10px] text-gray-500">Lãi thấp • Bán chạy</div>
             </div>
             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-xs font-bold text-blue-700 uppercase mb-1">Dấu hỏi</div>
                <div className="text-sm font-bold text-gray-800">Rượu Vang</div>
                <div className="text-[10px] text-gray-500">Lãi cao • Bán chậm</div>
             </div>
             <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="text-xs font-bold text-red-700 uppercase mb-1">Chó mực</div>
                <div className="text-sm font-bold text-gray-800">Salad Nga</div>
                <div className="text-[10px] text-gray-500">Lãi thấp • Bán chậm</div>
             </div>
          </div>
        </section>

        {/* 4. Booking Sources (Mobile) */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Nguồn khách</h3>
              <p className="text-xs text-gray-500">Tỷ lệ đặt bàn theo nguồn</p>
            </div>
          </div>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center">
              <div className="text-2xl font-bold text-gray-800">100%</div>
              <div className="text-[10px] text-gray-500 uppercase font-bold">Tổng</div>
            </div>
          </div>
        </section>

        {/* 5. Booking Status / Loss Rate (Mobile) */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Tỷ lệ thất thoát</h3>
              <p className="text-xs text-gray-500">Hủy (Cancel) & Khách không đến (No-show)</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="completed" name="Hoàn thành" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="cancelled" name="Hủy" stackId="a" fill="#F59E0B" />
                <Bar dataKey="noshow" name="No-show" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800 text-xs">Cảnh báo thất thoát</h4>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                Tỷ lệ No-show tuần này tăng <strong>2.5%</strong>. Cần yêu cầu đặt cọc với nhóm trên 10 khách.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Báo cáo chuyên sâu</h2>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600">
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
          </select>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-teal-700">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* 1. Golden Hour Analysis */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Khung giờ vàng (Golden Hours)</h3>
            <p className="text-sm text-gray-500">Phân tích lượng khách và doanh thu theo giờ để tối ưu nhân sự</p>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={goldenHourData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="left" orientation="left" stroke="#10B981" axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : value,
                  name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="right" dataKey="orders" name="Số đơn" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 text-sm">Đề xuất nhân sự</h4>
            <p className="text-sm text-amber-700 mt-1">
              Khung giờ cao điểm là <strong>12:00 - 13:00</strong> và <strong>18:00 - 20:00</strong>. 
              Cần bố trí tối đa nhân viên phục vụ và bếp trong khoảng thời gian này. 
              Có thể giảm 30% nhân sự vào khung 14:00 - 16:00.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Menu Engineering */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Phân tích thực đơn (Menu Matrix)</h3>
              <p className="text-sm text-gray-500">Ma trận Boston: Lợi nhuận vs. Phổ biến</p>
            </div>
          </div>

          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis type="number" dataKey="x" name="Số lượng bán" unit=" món" stroke="#9CA3AF" fontSize={12} />
                <YAxis type="number" dataKey="y" name="Lợi nhuận" unit="đ" stroke="#9CA3AF" fontSize={12} tickFormatter={(val) => `${val/1000}k`} />
                <ZAxis type="number" range={[100, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
                        <p className="font-bold text-gray-800">{data.name}</p>
                        <p className="text-xs text-gray-500">Loại: <span className="font-bold" style={{color: COLORS[data.type as keyof typeof COLORS]}}>{data.type}</span></p>
                        <p className="text-xs text-gray-500">Bán: {data.x}</p>
                        <p className="text-xs text-gray-500">Lãi: {data.y.toLocaleString()}đ</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                
                {/* Quadrant Lines */}
                <ReferenceLine x={80} stroke="#E5E7EB" strokeDasharray="3 3" />
                <ReferenceLine y={200000} stroke="#E5E7EB" strokeDasharray="3 3" />

                <Scatter name="Menu Items" data={menuMatrixData} fill="#8884d8">
                  {menuMatrixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.type as keyof typeof COLORS]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Quadrant Labels */}
            <div className="absolute top-4 right-4 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Ngôi sao (Star)</div>
            <div className="absolute top-4 left-16 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Dấu hỏi (Puzzle)</div>
            <div className="absolute bottom-12 right-4 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Bò sữa (Plowhorse)</div>
            <div className="absolute bottom-12 left-16 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Chó mực (Dog)</div>
          </div>
        </section>

        {/* 3. Staff Performance */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Hiệu suất nhân viên</h3>
              <p className="text-sm text-gray-500">Top nhân viên có doanh thu cao nhất</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {staffData.sort((a, b) => b.sales - a.sales).map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                    ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-200 text-blue-700'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{staff.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {staff.orders} đơn</span>
                      <span className="flex items-center gap-1 text-green-600 font-medium"><TrendingUp className="w-3 h-3" /> {staff.upsell}% Upsell</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-teal-600 text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(staff.sales)}
                  </div>
                  <div className="text-xs text-gray-400">Doanh thu</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Row 3: Sources & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. Booking Sources */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <PieChartIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Nguồn khách hàng</h3>
              <p className="text-sm text-gray-500">Phân tích tỷ lệ đặt bàn theo kênh</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
              <div className="text-3xl font-bold text-gray-800">100%</div>
              <div className="text-sm text-gray-500 uppercase font-bold">Tổng</div>
            </div>
          </div>
        </section>

        {/* 5. Booking Status / Loss Rate */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Tỷ lệ thất thoát (Loss Rate)</h3>
              <p className="text-sm text-gray-500">Theo dõi Hủy & No-show theo tuần</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="completed" name="Hoàn thành" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} barSize={40} />
                <Bar dataKey="cancelled" name="Hủy" stackId="a" fill="#F59E0B" barSize={40} />
                <Bar dataKey="noshow" name="No-show" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800 text-sm">Cảnh báo thất thoát</h4>
              <p className="text-sm text-red-700 mt-1">
                Tỷ lệ No-show tuần này tăng <strong>2.5%</strong> so với tuần trước. 
                Đề xuất kích hoạt tính năng <strong>Yêu cầu đặt cọc (Deposit)</strong> với các nhóm khách trên 10 người hoặc đặt vào khung giờ cao điểm.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
}
