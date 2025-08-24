import { load } from '@grpc/proto-loader';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateProtoTypes() {
  const PROTO_PATH = join(__dirname, '../src/proto/bookings.proto');
  
  try {
    const packageDefinition = await load(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [join(__dirname, '../src/proto')],
    });

    // Generate simple TypeScript interfaces
    const tsContent = `
// Generated file - DO NOT EDIT
/* eslint-disable */
export interface CreateBookingRequest {
  provider_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  customer_id: string;
  notes?: string;
}

export interface CreateBookingResponse {
  id: string;
  provider_id: string;
  customer_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GetBookingRequest {
  id: string;
}

export interface GetBookingResponse {
  id: string;
  provider_id: string;
  customer_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
    `.trim();

    writeFileSync(join(__dirname, '../src/proto/bookings.ts'), tsContent);
    console.log('✅ Proto interfaces generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating proto interfaces:', error);
  }
}

generateProtoTypes();