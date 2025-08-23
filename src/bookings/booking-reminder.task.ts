import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingEventsGateway } from './booking-events.gateway';

@Injectable()
export class BookingReminderTask {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly bookingEventsGateway: BookingEventsGateway,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminders() {
    try {
      const now = new Date();
      const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);

      const upcomingBookings = await this.bookingRepository.find({
        where: {
          start_time: Between(now, tenMinutesFromNow),
          status: 'confirmed',
        },
      });

      for (const booking of upcomingBookings) {
        const reminderSent = await this.redisService.get(
          `reminder:${booking.id}`,
        );

        if (!reminderSent) {
          // Send reminder via WebSocket
          this.bookingEventsGateway.emitReminder({
            type: 'reminder',
            bookingId: booking.id,
            message: `Booking ${booking.id} starts in 10 minutes`,
            startTime: booking.start_time,
          });

          console.log(`Reminder sent for booking ${booking.id}`);

          // Mark as sent in Redis to prevent duplicate reminders
          await this.redisService.set(
            `reminder:${booking.id}`,
            'sent',
            'EX',
            600, // 10 minutes in seconds
          );
        }
      }
    } catch (error) {
      console.error('Error in reminder task:', error);
    }
  }
}
