import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export default redis

// Утилиты для кеширования
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  },

  async set(key: string, value: unknown, expireSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      if (expireSeconds) {
        await redis.setex(key, expireSeconds, serialized)
      } else {
        await redis.set(key, serialized)
      }
    } catch (error) {
      console.error('Redis set error:', error)
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Redis del error:', error)
    }
  },

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis invalidate pattern error:', error)
    }
  }
}
