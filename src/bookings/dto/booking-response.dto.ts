export class BookingResponseDto {
  id: string;
  provider_id: string;
  customer_id: string;
  service_id: string;
  start_time: Date;
  end_time: Date;
  status: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}