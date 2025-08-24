import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';
import {
  CreateBookingRequest,
  CreateBookingResponse,
  GetBookingRequest,
  GetBookingResponse,
} from 'src/proto/bookings';

@Controller()
export class GrpcController {
  constructor(private readonly grpcService: GrpcService) {}

  @GrpcMethod('BookingsService', 'CreateBooking')
  async createBooking(
    data: CreateBookingRequest,
  ): Promise<CreateBookingResponse> {
    return this.grpcService.createBooking(data);
  }

  @GrpcMethod('BookingsService', 'GetBooking')
  async getBooking(data: GetBookingRequest): Promise<GetBookingResponse> {
    return this.grpcService.getBooking(data);
  }
}
