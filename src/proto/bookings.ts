// Generated from bookings.proto
export interface CreateBookingRequest {
  provider_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  customer_id: string;
  notes?: string;
}

export interface CreateBookingResponse {
  id: string;
  provider_id: string;
  customer_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GetBookingRequest {
  id: string;
}

export interface GetBookingResponse {
  id: string;
  provider_id: string;
  customer_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}