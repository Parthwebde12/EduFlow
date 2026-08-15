const Redis = require('ioredis');
const { LRUCache } = require('lru-cache');

// Initialize L1 Cache (Memory)
const l1Cache = new LRUCache({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 60, // 1 hour TTL default
});

// Initialize L2 Cache (Redis)
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
let redisClient;
try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1, // Don't block forever if Redis is down
    retryStrategy(times) {
      if (times > 3) return null; // Stop retrying after 3 attempts
      return Math.min(times * 50, 2000);
    }
  });
  
  redisClient.on('error', (err) => {
    console.warn('[Redis] Connection error or unavailable, falling back to L1/MongoDB:', err.message);
  });
} catch (error) {
  console.warn('[Redis] Initialization failed:', error.message);
}

/**
 * Cache middleware to check L1 and L2 caches before falling back to MongoDB.
 * @param {string} prefix - The prefix for the cache keys (e.g., 'notes', 'resources')
 * @param {number} ttl - Time to live in seconds (default: 3600)
 */
const cache = (prefix, ttl = 3600) => {
  return async (req, res, next) => {
    // We must include the user ID to prevent data leakage between users
    const userId = req.user ? req.user._id.toString() : 'public';
    
    // Create a key: e.g. cache:5f8d0...:notes:/api/notes?page=1
    const cacheKey = `cache:${userId}:${prefix}:${req.originalUrl}`;
    
    try {
      // 1. Check L1 Cache
      const l1Data = l1Cache.get(cacheKey);
      if (l1Data) {
        return res.json(l1Data);
      }

      // 2. Check L2 Cache
      if (redisClient && redisClient.status === 'ready') {
        const l2Data = await redisClient.get(cacheKey);
        if (l2Data) {
          const parsedData = JSON.parse(l2Data);
          // Store in L1 for faster subsequent accesses
          l1Cache.set(cacheKey, parsedData, { ttl: ttl * 1000 });
          return res.json(parsedData);
        }
      }
    } catch (err) {
      console.error('[Cache] Read error:', err.message);
      // Fallthrough to next() on cache error
    }

    // 3. Cache Miss - Intercept the res.json to capture data
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful requests
      if (res.statusCode >= 200 && res.statusCode < 300 && body.success) {
        try {
          // Set L1
          l1Cache.set(cacheKey, body, { ttl: ttl * 1000 });
          
          // Set L2
          if (redisClient && redisClient.status === 'ready') {
            redisClient.set(cacheKey, JSON.stringify(body), 'EX', ttl).catch(err => {
              console.error('[Cache] Write error L2:', err.message);
            });
          }
        } catch (err) {
          console.error('[Cache] Write error:', err.message);
        }
      }
      return originalJson(body);
    };

    next();
  };
};

/**
 * Utility to clear caches for a specific user and prefix.
 * @param {string} userId - The user ID to clear caches for
 * @param {string} prefix - The prefix of the caches (e.g., 'notes')
 */
const clearCache = async (userId, prefix) => {
  const matchPattern = `cache:${userId.toString()}:${prefix}:*`;
  
  // 1. Clear L1 Cache
  // lru-cache v10 doesn't have a pattern delete, so we clear everything, 
  // or we can iterate over keys. For safety, let's iterate.
  for (const key of l1Cache.keys()) {
    if (key.startsWith(`cache:${userId.toString()}:${prefix}:`)) {
      l1Cache.delete(key);
    }
  }

  // 2. Clear L2 Cache using SCAN
  if (redisClient && redisClient.status === 'ready') {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', matchPattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } while (cursor !== '0');
    } catch (err) {
      console.error('[Cache] Clear error L2:', err.message);
    }
  }
};

module.exports = {
  cache,
  clearCache,
};
