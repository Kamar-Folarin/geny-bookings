import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Simple ping check
      await this.redisService.set('healthcheck', 'ok', 'EX', 10);
      const result = await this.redisService.get('healthcheck');

      const isHealthy = result === 'ok';
      const status = this.getStatus(key, isHealthy);

      if (isHealthy) {
        return status;
      }

      throw new HealthCheckError('Redis health check failed', status);
    } catch (error) {
      throw new HealthCheckError('Redis health check failed', error);
    }
  }
}
