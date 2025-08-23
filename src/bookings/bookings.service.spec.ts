import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { RedisService } from '../redis/redis.service';
import { BookingEventsGateway } from './booking-events.gateway';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const mockBookingEventsGateway = {
    emitBookingCreated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: BookingEventsGateway,
          useValue: mockBookingEventsGateway,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const createDto = {
        provider_id: 'provider-uuid',
        service_id: 'service-uuid',
        start_time: new Date(),
        end_time: new Date(Date.now() + 3600000),
      };

      const savedBooking = {
        id: 'booking-uuid',
        ...createDto,
        customer_id: 'customer-uuid',
        status: 'confirmed',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBookingRepository.create.mockReturnValue(createDto);
      mockBookingRepository.save.mockResolvedValue(savedBooking);

      const result = await service.create(createDto, 'customer-uuid');

      expect(result).toEqual(expect.objectContaining({
        id: 'booking-uuid',
        provider_id: 'provider-uuid',
        customer_id: 'customer-uuid',
      }));
      expect(mockRedisService.set).toHaveBeenCalled();
      expect(mockBookingEventsGateway.emitBookingCreated).toHaveBeenCalled();
    });
  });
});