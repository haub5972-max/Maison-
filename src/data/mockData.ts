import { Booking } from '../types';

export const initialBookings: Booking[] = [
  { id: '1', customerName: 'Nguyễn Văn A', time: '18:00', pax: 4, status: 'new', phone: '0901234567', source: 'website' },
  { id: '2', customerName: 'Trần Thị B', time: '18:30', pax: 2, status: 'waiting_info', notes: ['Chưa có SĐT'], source: 'facebook' },
  { id: '3', customerName: 'Lê Văn C', time: '19:00', pax: 8, status: 'confirmed', notes: ['Dị ứng tôm'], source: 'hotline' },
  { id: '4', customerName: 'Phạm Thị D', time: '19:15', pax: 6, status: 'arrived', source: 'walk_in' },
  { id: '5', customerName: 'Hoàng Văn E', time: '12:00', pax: 10, status: 'completed', source: 'ota' },
  { id: '6', customerName: 'Vũ Thị F', time: '20:00', pax: 2, status: 'change_requested', notes: ['Xin đổi sang 20:30'], source: 'website' },
  { id: '7', customerName: 'Đặng Văn G', time: '18:45', pax: 5, status: 'confirmed', source: 'hotline' },
  { id: '8', customerName: 'Bùi Thị H', time: '19:30', pax: 4, status: 'new', source: 'facebook' },
  { id: '9', customerName: 'Ngô Văn I', time: '18:00', pax: 2, status: 'no_show', source: 'website' },
];
