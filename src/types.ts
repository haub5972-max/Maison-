export type BookingStatus = 'new' | 'waiting_info' | 'confirmed' | 'arrived' | 'completed' | 'cancelled' | 'no_show' | 'change_requested' | 'pending';

export interface Booking {
  id: string;
  customerName: string;
  time: string;
  pax: number;
  status: BookingStatus;
  notes?: string[];
  phone?: string;
  area?: 'indoor' | 'outdoor' | 'vip' | 'rooftop';
  source?: 'website' | 'facebook' | 'hotline' | 'walk_in' | 'ota';
}
