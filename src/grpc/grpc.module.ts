import { Module } from '@nestjs/common';
import { GrpcController } from './grpc.controller';
import { GrpcService } from './grpc.service';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class GrpcModule {}