import { ICacheService } from "../../../domain/interfaces/ICacheService";
import { redisClient } from "../services/redisClient";

export class RedisCacheService implements ICacheService {
  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  }

  async set(key: string, value: string, ttl = 600): Promise<void>  {
    await redisClient.set(key, value, { EX: ttl });
  }
}
