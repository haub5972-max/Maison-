import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  Plus, 
  Clock, 
  Users, 
  AlertCircle, 
  MoreHorizontal,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  X,
  Save,
  CheckCircle,
  Phone,
  MessageSquare,
  ArrowRight,
  Ban,
  UserX,
  RefreshCw,
  HelpCircle,
  Edit,
  Search
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { initialBookings } from '../data/mockData';

const sourceLabels: Record<string, string> = {
  website: 'Website',
  facebook: 'Fanpage',
  hotline: 'Hotline',
  walk_in: 'Walk-in',
  ota: 'OTA'
};

const sourceColors: Record<string, string> = {
  website: 'bg-blue-100 text-blue-700',
  facebook: 'bg-indigo-100 text-indigo-700',
  hotline: 'bg-green-100 text-green-700',
  walk_in: 'bg-orange-100 text-orange-700',
  ota: 'bg-purple-100 text-purple-700'
};

const columns: { id: BookingStatus; label: string; color: string; borderColor: string; icon?: any }[] = [
  { id: 'new', label: 'Mới nhận', color: 'bg-blue-50', borderColor: 'border-blue-500', icon: Plus },
  { id: 'waiting_info', label: 'Chờ bổ sung', color: 'bg-yellow-50', borderColor: 'border-yellow-400', icon: HelpCircle },
  { id: 'pending', label: 'Chờ xác nhận', color: 'bg-orange-50', borderColor: 'border-orange-400', icon: Clock },
  { id: 'confirmed', label: 'Đã xác nhận', color: 'bg-green-50', borderColor: 'border-green-500', icon: CheckCircle },
  { id: 'change_requested', label: 'Đổi giờ/ngày', color: 'bg-purple-50', borderColor: 'border-purple-400', icon: RefreshCw },
  { id: 'arrived', label: 'Đã đến', color: 'bg-teal-50', borderColor: 'border-teal-500', icon: Users },
  { id: 'no_show', label: 'Không đến (No-show)', color: 'bg-red-50', borderColor: 'border-red-400', icon: UserX },
  { id: 'cancelled', label: 'Đã hủy', color: 'bg-gray-100', borderColor: 'border-gray-400', icon: Ban },
];



interface BookingKanbanProps {
  isModalOpen?: boolean;
  onToggleModal?: (isOpen: boolean) => void;
}

export default function BookingKanban({ isModalOpen, onToggleModal }: BookingKanbanProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filterShift, setFilterShift] = useState<'lunch' | 'dinner'>('dinner');
  const [isMobile, setIsMobile] = useState(false);
  
  // Advanced Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeStatusTab, setActiveStatusTab] = useState<'action_needed' | 'upcoming' | 'active' | 'done'>('action_needed');

  // Internal modal state for when component is used without controlling props
  const [internalIsModalOpen, setInternalIsModalOpen] = useState(false);
  const showModal = isModalOpen !== undefined ? isModalOpen : internalIsModalOpen;
  const setShowModal = onToggleModal || setInternalIsModalOpen;
  
  // Mobile Action Sheet State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Status Groups Definition
  const statusGroups = {
    action_needed: ['new', 'waiting_info', 'pending', 'change_requested'],
    upcoming: ['confirmed'],
    active: ['arrived'],
    done: ['completed', 'cancelled', 'no_show']
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'action_needed': return 'Cần xử lý';
      case 'upcoming': return 'Đã chốt';
      case 'active': return 'Đang phục vụ';
      case 'done': return 'Lịch sử';
      default: return '';
    }
  };

  const getTabCount = (tab: 'action_needed' | 'upcoming' | 'active' | 'done') => {
    return bookings.filter(b => statusGroups[tab].includes(b.status)).length;
  };

  // Filter Logic
  const filteredBookings = bookings.filter(b => {
    // 1. Filter by Tab (Mobile only logic, but useful to have)
    if (isMobile && !statusGroups[activeStatusTab].includes(b.status)) return false;

    // 2. Filter by Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(query) ||
        b.phone?.includes(query) ||
        b.id.includes(query)
      );
    }

    return true;
  });

  // New Booking Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    customerName: '',
    phone: '',
    time: '',
    pax: 2,
    notes: [],
    source: 'hotline'
  });
  const [noteInput, setNoteInput] = useState('');

  // Duplicate Check Logic
  const [duplicateBooking, setDuplicateBooking] = useState<Booking | null>(null);
  // Slot Suggestion Logic
  const [suggestedSlots, setSuggestedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (newBooking.phone && newBooking.phone.length > 3) {
      const found = bookings.find(b => 
        b.phone === newBooking.phone && 
        b.id !== editingId // Don't warn if editing the same booking
      );
      setDuplicateBooking(found || null);
    } else {
      setDuplicateBooking(null);
    }
  }, [newBooking.phone, bookings, editingId]);

  // Mock Slot Availability Check
  useEffect(() => {
    if (newBooking.time === '19:00') {
       setSuggestedSlots(['18:30', '19:30', '20:00']);
    } else {
       setSuggestedSlots([]);
    }
  }, [newBooking.time]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      setEditingId(null);
      setNewBooking({ customerName: '', phone: '', time: '', pax: 2, notes: [], area: undefined, source: 'hotline' });
    }
  }, [showModal]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId as BookingStatus;
    const destStatus = destination.droppableId as BookingStatus;

    if (sourceStatus === destStatus) return;

    const updatedBookings = bookings.map(booking => {
      if (booking.id === result.draggableId) {
        return { ...booking, status: destStatus };
      }
      return booking;
    });

    setBookings(updatedBookings);
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    setSelectedBooking(null);
  };

  const handleSaveBooking = () => {
    if (!newBooking.customerName || !newBooking.time) return;
    
    if (editingId) {
      // Update existing booking
      setBookings(bookings.map(b => b.id === editingId ? {
        ...b,
        customerName: newBooking.customerName!,
        phone: newBooking.phone,
        time: newBooking.time!,
        pax: newBooking.pax || 2,
        notes: newBooking.notes,
        area: newBooking.area,
        source: newBooking.source
      } : b));
    } else {
      // Create new booking
      const booking: Booking = {
        id: Date.now().toString(),
        customerName: newBooking.customerName!,
        phone: newBooking.phone,
        time: newBooking.time!,
        pax: newBooking.pax || 2,
        status: 'new',
        notes: newBooking.notes,
        area: newBooking.area,
        source: newBooking.source
      };
      setBookings([booking, ...bookings]);
    }
    
    setShowModal(false);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingId(booking.id);
    setNewBooking({
      customerName: booking.customerName,
      phone: booking.phone,
      time: booking.time,
      pax: booking.pax,
      notes: booking.notes,
      area: booking.area,
      source: booking.source
    });
    setSelectedBooking(null); // Close mobile sheet if open
    setShowModal(true);
  };

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNewBooking({
        ...newBooking,
        notes: [...(newBooking.notes || []), noteInput.trim()]
      });
      setNoteInput('');
    }
  };

  // --- Mobile View Components ---

  const renderMobileList = () => (
    <div className="h-full bg-gray-50 overflow-y-auto pb-24">
      {/* Mobile Filter Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 shadow-sm flex flex-col gap-3">
        {/* Row 1: Date & Shift & Add */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-gray-800 focus:ring-0 p-0 w-28"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilterShift('lunch')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${filterShift === 'lunch' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                Trưa
              </button>
              <button 
                onClick={() => setFilterShift('dinner')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${filterShift === 'dinner' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                Tối
              </button>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="p-1.5 bg-teal-600 text-white rounded-lg shadow-sm active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Row 2: Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm tên khách, SĐT..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 3: Status Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['action_needed', 'upcoming', 'active', 'done'] as const).map(tab => {
            const count = getTabCount(tab);
            const isActive = activeStatusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all
                  ${isActive 
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
                `}
              >
                {getTabLabel(tab)}
                {count > 0 && (
                  <span className={`
                    px-1.5 py-0.5 rounded-full text-[10px] 
                    ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking List */}
      <div className="p-4 space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 mt-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Search className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm">Không tìm thấy đơn đặt bàn nào</p>
          </div>
        ) : (
          filteredBookings
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(booking => {
              const statusConfig = columns.find(c => c.id === booking.status);
              return (
                <div 
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform relative overflow-hidden"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig?.color.replace('bg-', 'bg-').replace('-50', '-500')}`}></div>
                  
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig?.color}`}>
                        {statusConfig?.icon && <statusConfig.icon className={`w-5 h-5 ${statusConfig.borderColor.replace('border-', 'text-')}`} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{booking.customerName}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.time}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.pax} Pax</span>
                          {booking.source && (
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${sourceColors[booking.source] || 'bg-gray-100 text-gray-600'}`}>
                              {sourceLabels[booking.source] || booking.source}
                            </span>
                          )}
                          {booking.area && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium uppercase">
                              {booking.area === 'indoor' ? 'Trong nhà' : booking.area === 'outdoor' ? 'Ngoài trời' : booking.area === 'vip' ? 'VIP' : 'Sân thượng'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${statusConfig?.borderColor} ${statusConfig?.color} ${statusConfig?.borderColor.replace('border-', 'text-')}`}>
                      {statusConfig?.label}
                    </span>
                  </div>
                  {booking.notes && booking.notes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 pl-[54px]">
                      {booking.notes.map((note, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded border border-amber-100">
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      {/* Mobile Action Sheet (Bottom Sheet) */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedBooking.customerName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{selectedBooking.time} • {selectedBooking.pax} Khách</span>
                  {selectedBooking.source && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sourceColors[selectedBooking.source]}`}>
                      {sourceLabels[selectedBooking.source]}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-2 bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Smart Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedBooking.status === 'new' && (
                <>
                  <button onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')} className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-700 rounded-xl font-bold border border-green-200 active:bg-green-100 shadow-sm">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    Xác nhận
                  </button>
                  <button onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')} className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-700 rounded-xl font-bold border border-red-200 active:bg-red-100 shadow-sm">
                    <Ban className="w-8 h-8 mb-2" />
                    Hủy đơn
                  </button>
                </>
              )}
              {selectedBooking.status === 'confirmed' && (
                <button onClick={() => handleStatusChange(selectedBooking.id, 'arrived')} className="col-span-2 flex flex-col items-center justify-center p-6 bg-teal-50 text-teal-700 rounded-xl font-bold border border-teal-200 active:bg-teal-100 shadow-sm">
                  <Users className="w-10 h-10 mb-2" />
                  <span className="text-lg">Khách đã đến (Check-in)</span>
                </button>
              )}
              {selectedBooking.status === 'arrived' && (
                <button onClick={() => handleStatusChange(selectedBooking.id, 'completed')} className="col-span-2 flex flex-col items-center justify-center p-6 bg-purple-50 text-purple-700 rounded-xl font-bold border border-purple-200 active:bg-purple-100 shadow-sm">
                  <CheckCircle className="w-10 h-10 mb-2" />
                  <span className="text-lg">Hoàn thành / Thanh toán</span>
                </button>
              )}
              {/* Fallback for other statuses or secondary smart actions could go here if needed */}
              {['waiting_info', 'pending', 'change_requested'].includes(selectedBooking.status) && (
                 <button onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')} className="col-span-2 flex flex-col items-center justify-center p-4 bg-green-50 text-green-700 rounded-xl font-bold border border-green-200 active:bg-green-100">
                   <CheckCircle className="w-6 h-6 mb-1" />
                   Xác nhận lại
                 </button>
              )}
            </div>

            {/* Secondary Actions */}
            <div className="space-y-2">
              <button 
                onClick={() => handleEditBooking(selectedBooking)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
              >
                <Edit className="w-5 h-5 text-gray-400" />
                Chỉnh sửa thông tin
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
                <Phone className="w-5 h-5 text-gray-400" />
                Gọi điện thoại
              </button>
              <div className="h-px bg-gray-100 my-2"></div>
              <button onClick={() => handleStatusChange(selectedBooking.id, 'no_show')} className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-lg text-red-600 font-medium">
                <UserX className="w-5 h-5" />
                Đánh dấu No-show (Không đến)
              </button>
              <button onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')} className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg text-gray-500 font-medium">
                <Ban className="w-5 h-5" />
                Hủy đặt bàn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- Desktop Kanban View ---

  const renderDesktopKanban = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-4 h-full min-w-[1600px]"> {/* Increased width for more columns */}
          {columns.map((col) => {
            const colBookings = bookings.filter(b => b.status === col.id);
            
            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col min-w-[260px] max-w-[300px] rounded-xl border transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-100/50 border-gray-200/60'
                    }`}
                  >
                    {/* Column Header */}
                    <div className={`p-3 border-b border-gray-200 flex items-center justify-between rounded-t-xl ${col.color}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full border ${col.borderColor} bg-white`}></span>
                        <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
                      </div>
                      <span className="bg-white/60 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                        {colBookings.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {colBookings.map((booking, index) => (
                        // @ts-ignore
                        <Draggable key={booking.id} draggableId={booking.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                bg-white p-3 rounded-lg shadow-sm border-l-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative
                                ${col.borderColor}
                                ${snapshot.isDragging ? 'shadow-xl rotate-2 scale-105 z-50' : ''}
                              `}
                              style={provided.draggableProps.style}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900 text-sm">{booking.customerName}</h4>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditBooking(booking);
                                  }}
                                  className="text-gray-400 hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  {booking.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-gray-400" />
                                  {booking.pax} Pax
                                </div>
                                {booking.source && (
                                  <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${sourceColors[booking.source]}`}>
                                    {sourceLabels[booking.source]}
                                  </div>
                                )}
                              </div>

                              {booking.notes && booking.notes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {booking.notes.map((note, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded border border-amber-100">
                                      <AlertCircle className="w-3 h-3" />
                                      {note}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 relative">
      {/* Filter Bar (Shared) */}
      <div className="hidden md:flex px-4 md:px-6 py-4 bg-white border-b border-gray-200 items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800 hidden md:block">Lịch Đặt Bàn</h2>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          
          {/* Shift Filter (Desktop Only - Mobile has its own) */}
          <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setFilterShift('lunch')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                filterShift === 'lunch' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sun className="w-4 h-4" />
              Ca Trưa
            </button>
            <button 
              onClick={() => setFilterShift('dinner')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                filterShift === 'dinner' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Moon className="w-4 h-4" />
              Ca Tối
            </button>
          </div>
        </div>


      </div>

      {/* Conditional Rendering */}
      {isMobile ? renderMobileList() : renderDesktopKanban()}

      {/* Add Booking Modal (Shared) */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">
                {editingId ? 'Cập nhật thông tin' : 'Thêm đặt bàn mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
                <input 
                  type="text" 
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    type="text" 
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                    placeholder="09..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${duplicateBooking ? 'border-orange-300 bg-orange-50' : 'border-gray-300'}`}
                  />
                  {duplicateBooking && (
                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-orange-800">Cảnh báo trùng lặp!</p>
                        <p className="text-xs text-orange-700 mt-1">
                          Khách <strong>{duplicateBooking.customerName}</strong> đã có đơn lúc <strong>{duplicateBooking.time}</strong> ({duplicateBooking.pax} khách).
                        </p>
                        <button 
                          onClick={() => handleEditBooking(duplicateBooking)}
                          className="mt-2 text-xs font-bold text-orange-700 underline hover:text-orange-900"
                        >
                          Xem đơn cũ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số khách (Pax)</label>
                  <input 
                    type="number" 
                    value={newBooking.pax}
                    onChange={(e) => setNewBooking({ ...newBooking, pax: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn đặt bàn</label>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {Object.entries(sourceLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setNewBooking({ ...newBooking, source: key as any })}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all
                        ${newBooking.source === key 
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực mong muốn</label>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'indoor', label: 'Trong nhà' },
                    { id: 'outdoor', label: 'Ngoài trời' },
                    { id: 'vip', label: 'Phòng VIP' },
                    { id: 'rooftop', label: 'Sân thượng' }
                  ].map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setNewBooking({ ...newBooking, area: area.id as any })}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all
                        ${newBooking.area === area.id 
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ đến</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${suggestedSlots.length > 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  />
                  {suggestedSlots.length > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center gap-2 mb-2">
                         <AlertCircle className="w-4 h-4 text-blue-600" />
                         <span className="text-xs font-bold text-blue-800">Khung giờ này đã kín chỗ!</span>
                      </div>
                      <p className="text-xs text-blue-700 mb-2">Gợi ý các khung giờ còn trống:</p>
                      <div className="flex gap-2">
                        {suggestedSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setNewBooking({ ...newBooking, time: slot })}
                            className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-md shadow-sm hover:bg-blue-100 transition-colors"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tags)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    placeholder="VD: Sinh nhật, Dị ứng..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button 
                    onClick={handleAddNote}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newBooking.notes?.map((note, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded border border-amber-100">
                      {note}
                      <button 
                        onClick={() => setNewBooking({ ...newBooking, notes: newBooking.notes?.filter((_, i) => i !== idx) })}
                        className="hover:text-amber-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveBooking}
                className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Lưu thay đổi' : 'Lưu đặt bàn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
