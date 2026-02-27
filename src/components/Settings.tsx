import React, { useState, useEffect } from 'react';
import { 
  Save, 
  User, 
  Clock, 
  Check,
  Shield,
  PlaySquare,
  Youtube,
  Plus,
  Trash2,
  Edit,
  Link,
  Image as ImageIcon,
  ChevronRight,
  X,
  Search,
  Filter,
  Activity,
  Settings as SettingsIcon,
  AlertTriangle
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  active: boolean;
  roles: {
    reception: boolean;
    kitchen: boolean;
    manager: boolean;
  };
  lastActive?: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

interface Area {
  id: string;
  name: string;
  capacity: number;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'a.nguyen@maisonvie.com', active: true, roles: { reception: false, kitchen: false, manager: true }, lastActive: 'Vừa xong' },
  { id: '2', name: 'Trần Thị B', email: 'b.tran@maisonvie.com', active: true, roles: { reception: true, kitchen: false, manager: false }, lastActive: '5 phút trước' },
  { id: '3', name: 'Lê Văn C', email: 'c.le@maisonvie.com', active: true, roles: { reception: false, kitchen: true, manager: false }, lastActive: '1 giờ trước' },
  { id: '4', name: 'Phạm Thị D', email: 'd.pham@maisonvie.com', active: false, roles: { reception: true, kitchen: false, manager: false }, lastActive: '2 ngày trước' },
];

const mockActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Tạo đặt bàn', timestamp: '10:30 26/02', details: 'Khách Nguyễn Văn X (4 pax)' },
  { id: '2', action: 'Check-in', timestamp: '10:45 26/02', details: 'Bàn 05 - Tầng 1' },
  { id: '3', action: 'Cập nhật món', timestamp: '11:00 26/02', details: 'Thêm 2 Bia Tiger' },
  { id: '4', action: 'Thanh toán', timestamp: '12:15 26/02', details: 'Hóa đơn #10234 - 1.500.000đ' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'permissions' | 'hours' | 'training' | 'operations'>('permissions');
  const [isMobile, setIsMobile] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'reception' });
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'manager' | 'reception' | 'kitchen'>('all');

  // User Detail Modal State
  const [userDetailModalOpen, setUserDetailModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  
  // Operations State
  const [areas, setAreas] = useState<Area[]>([
    { id: '1', name: 'Sảnh Tầng 1', capacity: 80 },
    { id: '2', name: 'Sảnh Tầng 2', capacity: 50 },
    { id: '3', name: 'Phòng VIP', capacity: 20 },
  ]);
  const [defaultDuration, setDefaultDuration] = useState(120);
  const [strictMode, setStrictMode] = useState(false);

  // Hours State
  const [lunchStart, setLunchStart] = useState(11);
  const [lunchEnd, setLunchEnd] = useState(14);
  const [dinnerStart, setDinnerStart] = useState(17);
  const [dinnerEnd, setDinnerEnd] = useState(22);

  // Training State
  const [trainingUrl, setTrainingUrl] = useState('');
  const [trainingTitle, setTrainingTitle] = useState('');
  const [trainingLevel, setTrainingLevel] = useState(1);
  const [managedCourses, setManagedCourses] = useState([
    { id: '1', title: 'Văn hóa Maison Vie', level: 1, youtubeId: 'M7lc1UVf-VE', active: true },
    { id: '2', title: 'Quy trình phục vụ cơ bản', level: 1, youtubeId: 'tgbNymZ7vqY', active: true },
    { id: '3', title: 'Kỹ năng giao tiếp khách hàng', level: 2, youtubeId: '8aGhZQkoFbQ', active: true },
  ]);

  // Mobile specific state
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
  };

  const previewId = getYoutubeId(trainingUrl);

  const handleAddCourse = () => {
    if (!previewId || !trainingTitle) return;
    setManagedCourses([
      ...managedCourses,
      {
        id: Date.now().toString(),
        title: trainingTitle,
        level: trainingLevel,
        youtubeId: previewId,
        active: true
      }
    ]);
    setTrainingUrl('');
    setTrainingTitle('');
    setTrainingLevel(1);
  };

  const toggleCourseActive = (id: string) => {
    setManagedCourses(managedCourses.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCourse = (id: string) => {
    setManagedCourses(managedCourses.filter(c => c.id !== id));
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      active: true,
      roles: {
        reception: newUser.role === 'reception',
        kitchen: newUser.role === 'kitchen',
        manager: newUser.role === 'manager'
      }
    };
    setEmployees([...employees, newEmployee]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'reception' });
  };

  const toggleUserStatus = (id: string) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, active: !emp.active } : emp));
  };

  // Filter Employees Logic
  const filteredEmployees = employees.filter(emp => {
    // 1. Search
    const query = searchQuery.toLowerCase();
    const matchesSearch = emp.name.toLowerCase().includes(query) || emp.email.toLowerCase().includes(query);
    
    // 2. Role Filter
    let matchesRole = true;
    if (roleFilter === 'manager') matchesRole = emp.roles.manager;
    if (roleFilter === 'reception') matchesRole = emp.roles.reception;
    if (roleFilter === 'kitchen') matchesRole = emp.roles.kitchen;

    return matchesSearch && matchesRole;
  });

  const handleViewEmployee = (emp: Employee) => {
    setViewingEmployee(emp);
    setUserDetailModalOpen(true);
  };

  const renderMobileView = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Mobile Header Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex overflow-x-auto no-scrollbar p-2 gap-2">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'permissions' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Phân quyền
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'hours' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Giờ hoạt động
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'training' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Đào tạo
          </button>
          <button
            onClick={() => setActiveTab('operations')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'operations' ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Vận hành
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* TAB 1: PERMISSIONS (Mobile) */}
        {activeTab === 'permissions' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Tìm nhân viên..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">Tất cả</option>
                <option value="manager">Quản lý</option>
                <option value="reception">Lễ tân</option>
                <option value="kitchen">Bếp</option>
              </select>
            </div>

            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-800">Danh sách nhân viên ({filteredEmployees.length})</h3>
              <button 
                onClick={() => setIsAddUserModalOpen(true)}
                className="text-teal-600 text-sm font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Thêm mới
              </button>
            </div>
            {filteredEmployees.map((emp) => (
              <div 
                key={emp.id} 
                onClick={() => handleViewEmployee(emp)}
                className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between active:bg-gray-50 ${!emp.active ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 relative">
                    <User className="w-5 h-5" />
                    {!emp.active && (
                      <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white text-[8px] px-1 rounded-full border border-white">OFF</div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{emp.name}</div>
                    <div className="text-xs text-gray-500 flex gap-1 mt-1">
                      {emp.roles.manager && <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Quản lý</span>}
                      {emp.roles.reception && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Lễ tân</span>}
                      {emp.roles.kitchen && <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Bếp</span>}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: HOURS (Mobile) */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                Ca Trưa
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Bắt đầu</label>
                  <input 
                    type="time" 
                    value={`${lunchStart.toString().padStart(2, '0')}:00`}
                    onChange={(e) => setLunchStart(parseInt(e.target.value.split(':')[0]))}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-lg font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Kết thúc</label>
                  <input 
                    type="time" 
                    value={`${lunchEnd.toString().padStart(2, '0')}:00`}
                    onChange={(e) => setLunchEnd(parseInt(e.target.value.split(':')[0]))}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-lg font-bold text-center"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Ca Tối
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Bắt đầu</label>
                  <input 
                    type="time" 
                    value={`${dinnerStart.toString().padStart(2, '0')}:00`}
                    onChange={(e) => setDinnerStart(parseInt(e.target.value.split(':')[0]))}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-lg font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Kết thúc</label>
                  <input 
                    type="time" 
                    value={`${dinnerEnd.toString().padStart(2, '0')}:00`}
                    onChange={(e) => setDinnerEnd(parseInt(e.target.value.split(':')[0]))}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-lg font-bold text-center"
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-200">
              Lưu cấu hình
            </button>
          </div>
        )}

        {/* TAB 4: OPERATIONS (Mobile) */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Sức chứa & Khu vực
              </h3>
              
              <div className="space-y-4">
                {areas.map((area) => (
                  <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">{area.name}</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={area.capacity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setAreas(areas.map(a => a.id === area.id ? { ...a, capacity: val } : a));
                        }}
                        className="w-16 p-2 text-center font-bold border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      />
                      <span className="text-xs text-gray-500">khách</span>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                  <span className="font-bold text-teal-800">Tổng sức chứa</span>
                  <span className="text-xl font-bold text-teal-700">
                    {areas.reduce((sum, area) => sum + area.capacity, 0)} <span className="text-sm font-normal">khách</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-teal-600" />
                Quy tắc vận hành
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian ăn tiêu chuẩn (phút)</label>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input 
                      type="number" 
                      value={defaultDuration}
                      onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 0)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg font-bold text-center focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Hệ thống sẽ tự động cộng thời gian này vào giờ đặt bàn để dự tính giờ khách về.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <label className="font-bold text-gray-800">Kiểm soát chặt chẽ</label>
                    <div 
                      onClick={() => setStrictMode(!strictMode)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${strictMode ? 'bg-teal-500' : 'bg-gray-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-300 ease-in-out ${strictMode ? 'translate-x-6' : ''}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {strictMode 
                      ? "Đang BẬT: Hệ thống sẽ CHẶN không cho đặt bàn nếu quá sức chứa. Cần quản lý xác nhận để ghi đè."
                      : "Đang TẮT: Cho phép đặt bàn quá sức chứa (chỉ hiện cảnh báo)."}
                  </p>
                  
                  {strictMode && (
                    <div className="flex items-start gap-2 p-3 bg-orange-50 text-orange-700 text-xs rounded-lg border border-orange-100">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Chế độ này giúp tránh Overbooking nhưng có thể làm chậm thao tác của lễ tân khi đông khách.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-200">
              Lưu cấu hình
            </button>
          </div>
        )}
      </div>

      {/* Add User Modal - Rendered for both Mobile and Desktop */}
      {isAddUserModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsAddUserModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-2xl p-6 m-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Thêm nhân viên mới</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nhập tên nhân viên"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Tên đăng nhập)</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="example@maisonvie.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vai trò mặc định</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="reception">Lễ tân</option>
                  <option value="kitchen">Bếp</option>
                  <option value="manager">Quản lý</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email}
                  className="w-full bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-teal-100 hover:shadow-teal-200 transition-all"
                >
                  Tạo tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Role Modal (Mobile Only) */}
      {selectedEmployee && isMobile && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-end animate-in fade-in duration-200"
          onClick={() => setSelectedEmployee(null)}
        >
          <div 
            className="w-full bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Phân quyền: {selectedEmployee.name}</h3>
              <button onClick={() => setSelectedEmployee(null)} className="p-2 bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-medium text-gray-700">Kích hoạt tài khoản</span>
                <div 
                  onClick={() => toggleUserStatus(selectedEmployee.id)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${selectedEmployee.active ? 'bg-teal-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-300 ease-in-out ${selectedEmployee.active ? 'translate-x-6' : ''}`} />
                </div>
              </label>
              <label className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 ${!selectedEmployee.active ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="font-medium text-gray-700">Lễ tân</span>
                <input type="checkbox" defaultChecked={selectedEmployee.roles.reception} className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500" />
              </label>
              <label className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 ${!selectedEmployee.active ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="font-medium text-gray-700">Bếp</span>
                <input type="checkbox" defaultChecked={selectedEmployee.roles.kitchen} className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500" />
              </label>
              <label className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 ${!selectedEmployee.active ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="font-medium text-gray-700">Quản lý</span>
                <input type="checkbox" defaultChecked={selectedEmployee.roles.manager} className="w-6 h-6 text-teal-600 rounded focus:ring-teal-500" />
              </label>
            </div>
            <button 
              onClick={() => setSelectedEmployee(null)}
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold text-lg"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}

    </div>
  );

  const renderDesktopView = () => (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      {/* Header Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Cấu hình hệ thống</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'permissions' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            Phân quyền
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'hours' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            Giờ hoạt động
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'training' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <PlaySquare className="w-4 h-4" />
            Đào tạo
          </button>
          <button
            onClick={() => setActiveTab('operations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'operations' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Vận hành
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* TAB 1: PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Danh sách nhân viên & Vai trò ({filteredEmployees.length})</h3>
                <div className="flex gap-3">
                   <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 w-64"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   </div>
                   <select 
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as any)}
                      className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="all">Tất cả vai trò</option>
                      <option value="manager">Quản lý</option>
                      <option value="reception">Lễ tân</option>
                      <option value="kitchen">Bếp</option>
                    </select>
                   <button 
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm nhân viên
                  </button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold bg-gray-50/50">
                    <th className="px-6 py-4">Nhân viên</th>
                    <th className="px-6 py-4 text-center w-32">Kích hoạt</th>
                    <th className="px-6 py-4 text-center w-32">Lễ tân</th>
                    <th className="px-6 py-4 text-center w-32">Bếp</th>
                    <th className="px-6 py-4 text-center w-32">Quản lý</th>
                    <th className="px-6 py-4 text-center w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className={`hover:bg-gray-50 transition-colors ${!emp.active ? 'bg-gray-50/50' : ''}`}>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => handleViewEmployee(emp)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 relative">
                            <User className="w-5 h-5" />
                            {!emp.active && (
                              <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white text-[8px] px-1 rounded-full border border-white">OFF</div>
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${emp.active ? 'text-gray-900' : 'text-gray-500'}`}>{emp.name}</div>
                            <div className="text-xs text-gray-500">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div 
                          onClick={() => toggleUserStatus(emp.id)}
                          className={`w-10 h-5 mx-auto flex items-center rounded-full p-1 cursor-pointer transition-colors ${emp.active ? 'bg-teal-500' : 'bg-gray-300'}`}
                        >
                          <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform duration-300 ease-in-out ${emp.active ? 'translate-x-4.5' : ''}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" defaultChecked={emp.roles.reception} disabled={!emp.active} className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer disabled:opacity-50" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" defaultChecked={emp.roles.kitchen} disabled={!emp.active} className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer disabled:opacity-50" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" defaultChecked={emp.roles.manager} disabled={!emp.active} className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer disabled:opacity-50" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleViewEmployee(emp)} className="text-gray-400 hover:text-teal-600">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: OPERATING HOURS */}
          {activeTab === 'hours' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Cấu hình khung giờ hoạt động
              </h3>

              <div className="space-y-12">
                {/* Lunch Shift Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      Ca Trưa
                    </label>
                    <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">
                      {lunchStart}:00 - {lunchEnd}:00
                    </span>
                  </div>
                  <div className="relative h-12 bg-gray-100 rounded-lg flex items-center px-4">
                    {/* Track */}
                    <div className="absolute left-4 right-4 h-2 bg-gray-200 rounded-full"></div>
                    {/* Active Range */}
                    <div 
                      className="absolute h-2 bg-orange-400 rounded-full opacity-80"
                      style={{ 
                        left: `${((lunchStart - 6) / 18) * 100}%`, 
                        width: `${((lunchEnd - lunchStart) / 18) * 100}%` 
                      }}
                    ></div>
                    
                    {/* Inputs (Simulated with Range) */}
                    <input 
                      type="range" min="6" max="24" 
                      value={lunchStart} 
                      onChange={(e) => setLunchStart(Math.min(parseInt(e.target.value), lunchEnd - 1))}
                      className="absolute w-full opacity-0 cursor-pointer z-10"
                    />
                    <input 
                      type="range" min="6" max="24" 
                      value={lunchEnd} 
                      onChange={(e) => setLunchEnd(Math.max(parseInt(e.target.value), lunchStart + 1))}
                      className="absolute w-full opacity-0 cursor-pointer z-10"
                    />

                    {/* Visual Thumbs */}
                    <div 
                      className="absolute w-6 h-6 bg-white border-2 border-orange-400 rounded-full shadow cursor-grab flex items-center justify-center text-[10px] font-bold text-orange-600"
                      style={{ left: `calc(${((lunchStart - 6) / 18) * 100}% + 16px)` }}
                    >
                      {lunchStart}
                    </div>
                    <div 
                      className="absolute w-6 h-6 bg-white border-2 border-orange-400 rounded-full shadow cursor-grab flex items-center justify-center text-[10px] font-bold text-orange-600"
                      style={{ left: `calc(${((lunchEnd - 6) / 18) * 100}% + 16px)` }}
                    >
                      {lunchEnd}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2 px-4">
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>
                </div>

                {/* Dinner Shift Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Ca Tối
                    </label>
                    <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">
                      {dinnerStart}:00 - {dinnerEnd}:00
                    </span>
                  </div>
                  <div className="relative h-12 bg-gray-100 rounded-lg flex items-center px-4">
                    {/* Track */}
                    <div className="absolute left-4 right-4 h-2 bg-gray-200 rounded-full"></div>
                    {/* Active Range */}
                    <div 
                      className="absolute h-2 bg-indigo-500 rounded-full opacity-80"
                      style={{ 
                        left: `${((dinnerStart - 6) / 18) * 100}%`, 
                        width: `${((dinnerEnd - dinnerStart) / 18) * 100}%` 
                      }}
                    ></div>
                    
                    {/* Inputs */}
                    <input 
                      type="range" min="6" max="24" 
                      value={dinnerStart} 
                      onChange={(e) => setDinnerStart(Math.min(parseInt(e.target.value), dinnerEnd - 1))}
                      className="absolute w-full opacity-0 cursor-pointer z-10"
                    />
                    <input 
                      type="range" min="6" max="24" 
                      value={dinnerEnd} 
                      onChange={(e) => setDinnerEnd(Math.max(parseInt(e.target.value), dinnerStart + 1))}
                      className="absolute w-full opacity-0 cursor-pointer z-10"
                    />

                    {/* Visual Thumbs */}
                    <div 
                      className="absolute w-6 h-6 bg-white border-2 border-indigo-500 rounded-full shadow cursor-grab flex items-center justify-center text-[10px] font-bold text-indigo-600"
                      style={{ left: `calc(${((dinnerStart - 6) / 18) * 100}% + 16px)` }}
                    >
                      {dinnerStart}
                    </div>
                    <div 
                      className="absolute w-6 h-6 bg-white border-2 border-indigo-500 rounded-full shadow cursor-grab flex items-center justify-center text-[10px] font-bold text-indigo-600"
                      style={{ left: `calc(${((dinnerEnd - 6) / 18) * 100}% + 16px)` }}
                    >
                      {dinnerEnd}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2 px-4">
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors">
                  <Check className="w-4 h-4" />
                  Lưu cấu hình thời gian
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TRAINING MANAGEMENT */}
          {activeTab === 'training' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              {/* Left: Add Course Form */}
              <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-fit">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  Thêm khóa học mới
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên khóa học</label>
                    <input 
                      type="text" 
                      value={trainingTitle}
                      onChange={(e) => setTrainingTitle(e.target.value)}
                      placeholder="VD: Quy trình phục vụ cơ bản"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cấp độ (Level)</label>
                    <select 
                      value={trainingLevel}
                      onChange={(e) => setTrainingLevel(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value={1}>Level 1: Nhập môn</option>
                      <option value={2}>Level 2: Cơ bản</option>
                      <option value={3}>Level 3: Nâng cao</option>
                      <option value={4}>Level 4: Chuyên sâu</option>
                      <option value={5}>Level 5: Quản lý</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                      <Link className="w-3.5 h-3.5" /> Link YouTube
                    </label>
                    <input 
                      type="text" 
                      value={trainingUrl}
                      onChange={(e) => setTrainingUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Ảnh bìa tự động
                    </label>
                    <div className="w-full aspect-video bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                      {previewId ? (
                        <img 
                          src={`https://img.youtube.com/vi/${previewId}/maxresdefault.jpg`} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to hqdefault if maxresdefault is not available
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${previewId}/hqdefault.jpg`;
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center gap-2">
                          <Youtube className="w-8 h-8 opacity-50" />
                          <span className="text-xs">Dán link YouTube để xem trước</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleAddCourse}
                    disabled={!previewId || !trainingTitle}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm vào danh sách
                  </button>
                </div>
              </div>

              {/* Right: Course List */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Danh sách khóa học</h3>
                  <span className="text-sm text-gray-500">{managedCourses.length} khóa học</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                        <th className="px-6 py-4">Khóa học</th>
                        <th className="px-6 py-4 text-center">Level</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {managedCourses.map((course) => (
                        <tr key={course.id} className={`hover:bg-gray-50 transition-colors ${!course.active ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-16 aspect-video bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                <img 
                                  src={`https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`} 
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <PlaySquare className="w-4 h-4 text-white opacity-80" />
                                </div>
                              </div>
                              <div className="font-medium text-gray-900 line-clamp-2">{course.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">
                              Lvl {course.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div 
                              onClick={() => toggleCourseActive(course.id)}
                              className={`w-10 h-5 mx-auto flex items-center rounded-full p-1 cursor-pointer transition-colors ${course.active ? 'bg-teal-500' : 'bg-gray-300'}`}
                            >
                              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform duration-300 ease-in-out ${course.active ? 'translate-x-4.5' : ''}`} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteCourse(course.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {managedCourses.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            Chưa có khóa học nào. Hãy thêm khóa học mới!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPERATIONS (Desktop) */}
          {activeTab === 'operations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Block 1: Areas & Capacity */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Cấu hình Sức chứa & Khu vực
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-2 px-2">
                    <div className="col-span-8">Tên khu vực</div>
                    <div className="col-span-4 text-center">Sức chứa (Pax)</div>
                  </div>
                  
                  {areas.map((area) => (
                    <div key={area.id} className="grid grid-cols-12 gap-4 items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-200 transition-colors">
                      <div className="col-span-8 font-medium text-gray-700">{area.name}</div>
                      <div className="col-span-4 flex justify-center">
                        <input 
                          type="number" 
                          value={area.capacity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setAreas(areas.map(a => a.id === area.id ? { ...a, capacity: val } : a));
                          }}
                          className="w-20 p-2 text-center font-bold border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-12 gap-4 items-center p-4 bg-teal-50 rounded-lg border border-teal-100 mt-6">
                    <div className="col-span-8 font-bold text-teal-800 text-lg">Tổng sức chứa toàn nhà hàng</div>
                    <div className="col-span-4 text-center text-2xl font-bold text-teal-700">
                      {areas.reduce((sum, area) => sum + area.capacity, 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Block 2: Time & Rules */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 h-fit">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-teal-600" />
                  Quy tắc vận hành
                </h3>

                <div className="space-y-8">
                  {/* Duration Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Thời gian ăn tiêu chuẩn (Standard Duration)</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 max-w-[200px]">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="number" 
                          value={defaultDuration}
                          onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg font-bold text-lg focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <span className="text-gray-600 font-medium">phút / lượt khách</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      * Hệ thống sẽ tự động cộng thời gian này vào giờ đặt bàn để dự tính giờ khách về (ETD).
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">Chế độ Kiểm soát chặt chẽ (Strict Mode)</h4>
                        <p className="text-sm text-gray-500 max-w-sm">
                          Khi bật, hệ thống sẽ <strong>CHẶN</strong> không cho phép đặt bàn nếu số lượng khách vượt quá sức chứa.
                        </p>
                      </div>
                      <div 
                        onClick={() => setStrictMode(!strictMode)}
                        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${strictMode ? 'bg-teal-500' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform duration-300 ease-in-out ${strictMode ? 'translate-x-7' : ''}`} />
                      </div>
                    </div>

                    {strictMode && (
                      <div className="mt-4 flex items-start gap-3 p-4 bg-orange-50 text-orange-800 text-sm rounded-lg border border-orange-100">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Lưu ý:</strong> Chế độ này yêu cầu tài khoản có quyền <strong>Quản lý (Manager)</strong> xác nhận nếu muốn ghi đè (Force Booking) khi nhà hàng đã đầy.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end">
                    <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold shadow-md shadow-teal-100 transition-all">
                      <Save className="w-4 h-4" />
                      Lưu cấu hình vận hành
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
      
      {/* Add User Modal - Rendered for both Mobile and Desktop */}
      {isAddUserModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsAddUserModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-2xl p-6 m-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Thêm nhân viên mới</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Nhập tên nhân viên"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Tên đăng nhập)</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="example@maisonvie.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vai trò mặc định</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="reception">Lễ tân</option>
                  <option value="kitchen">Bếp</option>
                  <option value="manager">Quản lý</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleAddUser}
                  disabled={!newUser.name || !newUser.email}
                  className="w-full bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-teal-100 hover:shadow-teal-200 transition-all"
                >
                  Tạo tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* User Detail Modal (Shared) */}
      {userDetailModalOpen && viewingEmployee && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setUserDetailModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết nhân viên</h3>
              <button onClick={() => setUserDetailModalOpen(false)} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Profile Info */}
                <div className="w-full md:w-1/3 space-y-4">
                  <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center text-gray-400 mb-3 relative">
                      <User className="w-12 h-12" />
                      <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${viewingEmployee.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 text-center">{viewingEmployee.name}</h4>
                    <p className="text-sm text-gray-500 text-center mb-3">{viewingEmployee.email}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {viewingEmployee.roles.manager && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">Quản lý</span>}
                      {viewingEmployee.roles.reception && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Lễ tân</span>}
                      {viewingEmployee.roles.kitchen && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">Bếp</span>}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h5 className="font-bold text-gray-800 text-sm mb-3">Thông tin trạng thái</h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trạng thái</span>
                        <span className={`font-bold ${viewingEmployee.active ? 'text-green-600' : 'text-gray-500'}`}>
                          {viewingEmployee.active ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hoạt động cuối</span>
                        <span className="font-medium text-gray-900">{viewingEmployee.lastActive || 'Chưa có'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày tham gia</span>
                        <span className="font-medium text-gray-900">20/02/2026</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Activity Log */}
                <div className="w-full md:w-2/3">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-600" />
                    Lịch sử hoạt động
                  </h4>
                  <div className="space-y-4">
                    {mockActivityLogs.map((log) => (
                      <div key={log.id} className="flex gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-12 text-xs font-bold text-gray-400 text-center pt-1">
                          {log.timestamp.split(' ')[0]}
                          <div className="font-normal text-[10px]">{log.timestamp.split(' ')[1]}</div>
                        </div>
                        <div className="flex-1 border-l-2 border-gray-100 pl-4 relative">
                          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-teal-50 border-2 border-teal-500"></div>
                          <h5 className="font-bold text-gray-800 text-sm">{log.action}</h5>
                          <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-2">
                      <button className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline">
                        Xem thêm lịch sử cũ hơn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setUserDetailModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-sm">
                Chỉnh sửa thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
