interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheOptions {
  defaultTTLSeconds?: number;
  maxEntries?: number;
}

export class MemoryCache<T = any> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private defaultTTL: number;
  private maxEntries: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = (options.defaultTTLSeconds ?? 300) * 1000;
    this.maxEntries = options.maxEntries ?? 1000;
  }

  public get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return undefined;
    }

    this.hits++;
    // Refresh LRU order by re-inserting
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  public set(key: string, value: T, ttlSeconds?: number): void {
    const ttl = (ttlSeconds !== undefined ? ttlSeconds : this.defaultTTL / 1000) * 1000;
    const expiresAt = Date.now() + ttl;

    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxEntries) {
      // Evict oldest entry (first item in Map iterator)
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    this.store.set(key, { value, expiresAt });
  }

  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  public getStats(): { size: number; hits: number; misses: number; hitRate: string } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? `${((this.hits / total) * 100).toFixed(1)}%` : '0%';
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate,
    };
  }
}

// Global cache instance conforming to MCP_HOSTING_SPEC
const defaultTTL = parseInt(process.env.CACHE_DEFAULT_TTL || '300', 10);
export const globalCache = new MemoryCache({ defaultTTLSeconds: defaultTTL });

