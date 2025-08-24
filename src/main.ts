import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Enable WebSockets
  app.useWebSocketAdapter(new WsAdapter(app));
  
  // Enable CORS for WebSockets and HTTP
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Create gRPC microservice
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'bookings',
        protoPath: join(__dirname, 'proto/bookings.proto'),
        url: process.env.GRPC_URL || '0.0.0.0:50051',
      },
    },
  );

  await grpcApp.listen();
  console.log('gRPC server started on port 50051');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`HTTP server running on port ${port}`);
}
bootstrap();