# Bookings Microservice

A minimal NestJS-based microservice for managing bookings with real-time notifications, background jobs, and authentication.

---

## Features

- ✅ JWT Authentication with role-based access (provider/admin)
- ✅ Create and retrieve bookings
- ✅ Paginated upcoming/past bookings
- ✅ Redis integration for caching and pub/sub
- ✅ WebSocket real-time notifications for booking creation
- ✅ Background job for 10-minute reminders
- ✅ PostgreSQL with TypeORM migrations
- ✅ Health checks and basic metrics
- ✅ Unit and E2E tests
- ✅ Docker containerization

---

## Tech Stack

- **Framework**: NestJS v10
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Real-time**: WebSockets (Socket.IO)
- **Auth**: JWT with Passport
- **Testing**: Jest + Supertest
- **Container**: Docker + Docker Compose

---

## Assumptions & Decisions

### Authentication & Authorization

- JWT tokens are provided via `Authorization` header
- User roles are embedded in JWT payload (`roles` array)
- `provider` and `admin` roles can access most endpoints
- `customer` role can only create bookings
- User ID is extracted from JWT token for ownership

### Database Design

- UUID primary keys for better distribution
- Timestamp-based filtering for upcoming/past bookings
- Status field for future booking state management
- Indexed date fields for performance

### Real-time Features

- WebSocket events for real-time booking creation
- Redis-backed reminder system to prevent duplicates
- 10-minute pre-booking reminders via background cron

### Architecture Decisions

- **Service layer** handles business logic
- **Controllers** handle HTTP concerns
- **Gateway** handles WebSocket events
- **Scheduled tasks** for background jobs
- **Repository pattern** for data access

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 13+
- Redis 7+

### Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/bookings
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3001 ```


### Installation

Clone the repository:

```git clone https://github.com/your-org/bookings-microservice.git
cd bookings-microservice```


### Install dependencies:

```npm install```


### Start dependencies with Docker (Postgres + Redis):

```docker-compose up -d db redis```


### Run database migrations:

```npm run typeorm migration:run```

## Running the Service
### Development Mode
#### Start database and Redis
```docker-compose up -d db redis```

#### Run migrations
```npm run typeorm migration:run```

#### Start development server
```npm run start:dev```

### Production Mode with Docker
#### Build and start all services
```docker-compose up --build```

#### Or run in background
```docker-compose up -d --build```

### Running Tests
#### Unit tests
```npm run test```

#### E2E tests
```npm run test:e2e```

#### Test coverage
```npm run test:cov```

#### Watch mode
```npm run test:watch```

## API Testing

### Generate a JWT token (via login endpoint or test token).

### Create a booking
```curl -X POST http://localhost:3000/bookings \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "provider-uuid",
    "service_id": "service-uuid",
    "start_time": "2024-01-01T10:00:00Z",
    "end_time": "2024-01-01T11:00:00Z"
  }'```

### Get upcoming bookings
```curl -X GET "http://localhost:3000/bookings/upcoming?page=1&limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"```

### Health check
```curl -X GET http://localhost:3000/health```

### WebSocket Testing

#### Connect to WebSocket endpoint:

```// Client-side example
const socket = io('http://localhost:3000', {
  transports: ['websocket']
});

socket.on('booking.created', (booking) => {
  console.log('New booking:', booking);
});

socket.on('booking.reminder', (reminder) => {
  console.log('Reminder:', reminder);
});```
