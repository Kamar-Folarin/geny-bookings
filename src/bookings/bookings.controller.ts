import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

 @Post()
  @Roles('customer', 'admin')
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: any, // Add Req decorator
  ): Promise<BookingResponseDto> {
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }


  @Get(':id')
  @Roles('provider', 'admin')
  async findOne(@Param('id') id: string): Promise<BookingResponseDto> {
    return this.bookingsService.findOne(id);
  }

  @Get('upcoming')
  @Roles('provider', 'admin')
  async findUpcoming(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.bookingsService.findUpcoming(page, limit);
  }

  @Get('past')
  @Roles('provider', 'admin')
  async findPast(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.bookingsService.findPast(page, limit);
  }
}
