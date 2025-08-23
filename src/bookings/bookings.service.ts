import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { RedisService } from '../redis/redis.service';
import { BookingEventsGateway } from './booking-events.gateway';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly redisService: RedisService,
    private readonly bookingEventsGateway: BookingEventsGateway,
  ) {}

  async create(createBookingDto: CreateBookingDto, customerId: string): Promise<BookingResponseDto> {
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      customer_id: customerId,
    });

    const savedBooking = await this.bookingRepository.save(booking);
    
    // Broadcast via WebSocket
    this.bookingEventsGateway.emitBookingCreated(savedBooking);
    
    // Store in Redis for reminders
    await this.redisService.set(
      `booking:${savedBooking.id}`,
      JSON.stringify(savedBooking)
    );

    return this.mapToDto(savedBooking);
  }

  async findOne(id: string): Promise<BookingResponseDto> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return this.mapToDto(booking);
  }

  async findUpcoming(page: number = 1, limit: number = 10): Promise<{ data: BookingResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { start_time: MoreThan(new Date()) },
      order: { start_time: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data: bookings.map(booking => this.mapToDto(booking)),
      total,
    };
  }

  async findPast(page: number = 1, limit: number = 10): Promise<{ data: BookingResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { start_time: LessThan(new Date()) },
      order: { start_time: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: bookings.map(booking => this.mapToDto(booking)),
      total,
    };
  }

  private mapToDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      provider_id: booking.provider_id,
      customer_id: booking.customer_id,
      service_id: booking.service_id,
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: booking.status,
      notes: booking.notes,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
    };
  }
}