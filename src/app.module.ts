import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { Booking } from './bookings/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Booking],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    BookingsModule,
    AuthModule,
    HealthModule,
    RedisModule,
  ],
})
export class AppModule {}