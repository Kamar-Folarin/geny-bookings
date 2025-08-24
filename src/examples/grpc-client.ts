import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

const PROTO_PATH = join(__dirname, '../src/proto/bookings.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const bookings = protoDescriptor.bookings as any;

export class GrpcClient {
  private client: any;

  constructor(address: string = 'localhost:50051') {
    this.client = new bookings.BookingsService(
      address,
      grpc.credentials.createInsecure()
    );
  }

  createBooking(request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.createBooking(request, (error: any, response: any) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  getBooking(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.getBooking({ id }, (error: any, response: any) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }
}

// Usage example
async function testGrpc() {
  const client = new GrpcClient();
  
  try {
    const booking = await client.createBooking({
      provider_id: 'provider-uuid-123',
      service_id: 'service-uuid-456',
      customer_id: 'customer-uuid-789',
      start_time: new Date(Date.now() + 86400000).toISOString(),
      end_time: new Date(Date.now() + 90000000).toISOString(),
      notes: 'Test booking via gRPC',
    });
    
    console.log('Booking created:', booking);
    
    const foundBooking = await client.getBooking(booking.id);
    console.log('Booking found:', foundBooking);
    
  } catch (error) {
    console.error('gRPC Error:', error);
  }
}

// testGrpc();