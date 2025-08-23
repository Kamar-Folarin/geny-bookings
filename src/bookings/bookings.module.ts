import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { RedisModule } from '../redis/redis.module';
import { BookingReminderTask } from './booking-reminder.task';
import { AuthModule } from '../auth/auth.module';
import { BookingEventsGateway } from './booking-events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    RedisModule,
    AuthModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingReminderTask, BookingEventsGateway],
  exports: [BookingsService],
})
export class BookingsModule {}