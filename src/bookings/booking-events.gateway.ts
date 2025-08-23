import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
})
@Injectable()
export class BookingEventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  emitBookingCreated(booking: any): void {
    this.server.emit('booking.created', booking);
  }

  emitReminder(reminderData: any): void {
    this.server.emit('booking.reminder', reminderData);
  }
}