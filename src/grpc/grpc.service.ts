import { Injectable } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { CreateBookingRequest, CreateBookingResponse, GetBookingRequest, GetBookingResponse } from 'src/proto/bookings';

@Injectable()
export class GrpcService {
  constructor(private readonly bookingsService: BookingsService) {}

  async createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    const createBookingDto = {
      provider_id: data.provider_id,
      service_id: data.service_id,
      start_time: new Date(data.start_time),
      end_time: new Date(data.end_time),
      notes: data.notes,
    };

    const booking = await this.bookingsService.create(createBookingDto, data.customer_id);
    
    return {
      id: booking.id,
      provider_id: booking.provider_id,
      customer_id: booking.customer_id,
      service_id: booking.service_id,
      start_time: booking.start_time.toISOString(),
      end_time: booking.end_time.toISOString(),
      status: booking.status,
      notes: booking.notes,
      created_at: booking.created_at.toISOString(),
      updated_at: booking.updated_at.toISOString(),
    };
  }

  async getBooking(data: GetBookingRequest): Promise<GetBookingResponse> {
    const booking = await this.bookingsService.findOne(data.id);
    
    return {
      id: booking.id,
      provider_id: booking.provider_id,
      customer_id: booking.customer_id,
      service_id: booking.service_id,
      start_time: booking.start_time.toISOString(),
      end_time: booking.end_time.toISOString(),
      status: booking.status,
      notes: booking.notes,
      created_at: booking.created_at.toISOString(),
      updated_at: booking.updated_at.toISOString(),
    };
  }
}