// Cache management for data fetching
// This helps reduce unnecessary Firestore reads and improves performance

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  expirationTimeMs?: number; // How long to keep items in cache (default: 5 minutes)
  bypassCache?: boolean;     // Force a fresh fetch
}

// In-memory cache
const cache: Record<string, CacheItem<any>> = {};

// Default cache expiration: 5 minutes
const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Get data from cache or fetch it if not available
 * @param cacheKey Unique key for this data
 * @param fetchFn Function that fetches the data if not in cache
 * @param options Cache options
 */
export async function getCachedData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { 
    expirationTimeMs = DEFAULT_CACHE_EXPIRATION,
    bypassCache = false 
  } = options;
  
  const now = Date.now();
  
  // Check if we have a valid cached item
  const cachedItem = cache[cacheKey];
  
  if (
    !bypassCache && 
    cachedItem && 
    cachedItem.expiresAt > now
  ) {
    // Return cached data if it's still valid
    return cachedItem.data;
  }
  
  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  cache[cacheKey] = {
    data,
    timestamp: now,
    expiresAt: now + expirationTimeMs
  };
  
  return data;
}

/**
 * Invalidate a specific cache entry
 * @param cacheKey Key to invalidate
 */
export function invalidateCache(cacheKey: string): void {
  delete cache[cacheKey];
}

/**
 * Invalidate all cache entries that match a prefix
 * @param keyPrefix Prefix to match
 */
export function invalidateCacheByPrefix(keyPrefix: string): void {
  Object.keys(cache).forEach(key => {
    if (key.startsWith(keyPrefix)) {
      delete cache[key];
    }
  });
}

/**
 * Clear the entire cache
 */
export function clearCache(): void {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
}

/**
 * Update a cached item without changing its expiration
 * @param cacheKey Key to update
 * @param updateFn Function that receives the old data and returns new data
 */
export function updateCachedData<T>(
  cacheKey: string,
  updateFn: (oldData: T) => T
): void {
  const cachedItem = cache[cacheKey];
  
  if (cachedItem) {
    cachedItem.data = updateFn(cachedItem.data);
  }
}
