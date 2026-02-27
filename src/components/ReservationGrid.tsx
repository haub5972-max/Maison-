import React from 'react';
import { Clock, User, Info } from 'lucide-react';

type ReservationStatus = 'empty' | 'booked';

interface Reservation {
  id: string;
  status: ReservationStatus;
  area: string;
  capacity: number;
  bookingName?: string;
  customerName?: string;
  time?: string;
  specialRequests?: string[];
}

const mockData: Reservation[] = [
  {
    id: '1',
    status: 'booked',
    area: 'Tầng 1 - Sảnh chung',
    capacity: 8,
    bookingName: 'Bàn VIP 1',
    customerName: 'Nguyễn Trọng Hữu',
    time: '18:00 - 20:00',
    specialRequests: ['Sinh nhật', 'Dị ứng hải sản']
  },
  {
    id: '2',
    status: 'empty',
    area: 'Tầng 1 - Sảnh chung',
    capacity: 4,
  },
  {
    id: '3',
    status: 'booked',
    area: 'Phòng VIP Tầng 2',
    capacity: 12,
    bookingName: 'Phòng Lotus',
    customerName: 'Trần Thị Bích',
    time: '19:00 - 21:30',
    specialRequests: ['Cần ghế trẻ em', 'Trang trí hoa hồng']
  },
  {
    id: '4',
    status: 'empty',
    area: 'Tầng 1 - Sảnh chung',
    capacity: 2,
  },
  {
    id: '5',
    status: 'booked',
    area: 'Tầng 3 - Ban công',
    capacity: 4,
    bookingName: 'Bàn B3',
    customerName: 'Lê Văn Cường',
    time: '18:30 - 20:00',
    specialRequests: ['Góc nhìn đẹp']
  },
  {
    id: '6',
    status: 'empty',
    area: 'Tầng 3 - Ban công',
    capacity: 4,
  },
  {
    id: '7',
    status: 'booked',
    area: 'Phòng VIP Tầng 2',
    capacity: 6,
    bookingName: 'Phòng Orchid',
    customerName: 'Phạm Hoàng Anh',
    time: '20:00 - 22:00',
    specialRequests: []
  },
  {
    id: '8',
    status: 'empty',
    area: 'Tầng 1 - Sảnh chung',
    capacity: 6,
  }
];

export default function ReservationGrid() {
  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-121px)] bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockData.map((item) => (
          <div 
            key={item.id} 
            className={`rounded-lg border shadow-sm overflow-hidden flex flex-col bg-white ${
              item.status === 'booked' ? 'border-blue-100' : 'border-gray-200'
            }`}
          >
            {item.status === 'booked' ? (
              // Booked Card
              <>
                <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
                  <h3 className="font-semibold text-sm">{item.bookingName}</h3>
                  <span className="text-xs bg-blue-500/50 px-2 py-1 rounded font-medium">
                    {item.capacity} Pax
                  </span>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{item.customerName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Đã xác nhận
                    </span>
                  </div>

                  {item.specialRequests && item.specialRequests.length > 0 && (
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-1.5 text-xs text-amber-600 italic">
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>{item.specialRequests.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50/50">
                  <button className="py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border-r border-gray-100">
                    Hủy bàn
                  </button>
                  <button className="py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors border-r border-gray-100">
                    Dịch vụ
                  </button>
                  <button className="py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                    Check-in
                  </button>
                </div>
              </>
            ) : (
              // Empty Card
              <div className="p-5 flex-1 flex flex-col justify-center items-center text-center min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                  <span className="text-gray-400 font-medium text-sm">{item.capacity}</span>
                </div>
                <h3 className="font-medium text-gray-800 text-sm mb-1">{item.area}</h3>
                <p className="text-xs text-gray-500 mb-4">{item.capacity} Pax</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                  Sẵn sàng đón khách
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
