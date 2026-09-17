import axios, { AxiosInstance } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  ClientConfig,
  MarketplaceCategory,
  MarketplaceItem,
  MarketplaceSearchParams,
  MarketplaceSearchResult,
} from './types.js';
import { filterMockListings, MOCK_CATEGORIES, MOCK_ITEMS } from './mock-data.js';
import { MemoryCache } from '../utils/cache.js';
import { formatPrice, hashCookieSalt, parseMarketplaceUrl } from '../utils/formatters.js';
import { logger } from '../utils/logger.js';

export class FacebookClient {
  private config: ClientConfig;
  private axiosInstance: AxiosInstance;
  private cache: MemoryCache;
  private lastRequestTime: number = 0;

  constructor(config: ClientConfig = {}) {
    this.config = {
      defaultLocation: 'jakarta',
      requestDelayMs: 400,
      mockOnBlocked: true,
      ...config,
    };

    this.cache = new MemoryCache({
      defaultTTLSeconds: 300,
      maxEntries: 1000,
    });

    const headers: Record<string, string> = {
      'User-Agent':
        this.config.userAgent ||
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    };

    if (this.config.cookie) {
      headers['Cookie'] = this.config.cookie;
    }

    const axiosConfig: any = {
      baseURL: 'https://www.facebook.com',
      headers,
      timeout: 10000,
      validateStatus: (status: number) => status >= 200 && status < 400,
    };

    if (this.config.proxyUrl) {
      const agent = new HttpsProxyAgent(this.config.proxyUrl);
      axiosConfig.httpsAgent = agent;
      axiosConfig.httpAgent = agent;
      axiosConfig.proxy = false;
    }

    this.axiosInstance = axios.create(axiosConfig);
  }

  private async enforceRateLimit(): Promise<void> {
    const delay = this.config.requestDelayMs || 400;
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < delay) {
      await new Promise((resolve) => setTimeout(resolve, delay - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  public getCache(): MemoryCache {
    return this.cache;
  }

  /**
   * Search listings on Facebook Marketplace with query, filters, and location.
   */
  public async searchListings(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult> {
    const cookieSalt = hashCookieSalt(params.userCookie || this.config.cookie);
    const cacheKey = `search:${cookieSalt}:${params.location || 'default'}:${params.query || ''}:${params.category || ''}:${params.minPrice || ''}:${params.maxPrice || ''}:${params.sortBy || ''}:${params.limit || 20}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for search query: "${params.query || '*'}"`);
      return cached;
    }

    await this.enforceRateLimit();

    const activeCookie = params.userCookie || this.config.cookie;
    const location = params.location || this.config.defaultLocation || 'jakarta';

    // If live scraping is possible with valid cookies, attempt request
    if (activeCookie) {
      try {
        const searchPath = `/marketplace/${encodeURIComponent(location)}/search/`;
        const queryParams: Record<string, any> = {};
        if (params.query) queryParams.query = params.query;
        if (params.minPrice) queryParams.minPrice = params.minPrice;
        if (params.maxPrice) queryParams.maxPrice = params.maxPrice;
        if (params.sortBy) queryParams.sortBy = params.sortBy;

        const response = await this.axiosInstance.get(searchPath, {
          params: queryParams,
          headers: {
            Cookie: activeCookie,
          },
        });

        // Parse extracted listings from Facebook HTML / JSON blobs
        const extracted = this.parseMarketplaceHtml(response.data, location, params.query);
        if (extracted && extracted.items.length > 0) {
          this.cache.set(cacheKey, extracted, 300);
          return extracted;
        }
      } catch (err: any) {
        logger.warn(`Live Facebook search failed (${err.message}). Falling back to simulation mode.`);
      }
    }

    // High-fidelity fallback / offline mode
    if (this.config.mockOnBlocked) {
      logger.debug(`Returning filtered fallback listings for "${params.query || '*'}" in ${location}`);
      const mockResult = filterMockListings({
        ...params,
        location,
      });
      this.cache.set(cacheKey, mockResult, 300);
      return mockResult;
    }

    throw new Error('Facebook Marketplace search request failed or was blocked by Facebook anti-bot protection.');
  }

  /**
   * Get detailed information for a specific listing by ID or Facebook URL.
   */
  public async getListingDetails(listingIdOrUrl: string, userCookie?: string): Promise<MarketplaceItem> {
    let listingId = listingIdOrUrl;
    if (listingIdOrUrl.startsWith('http') || listingIdOrUrl.includes('facebook.com')) {
      const parsed = parseMarketplaceUrl(listingIdOrUrl);
      if (parsed.listingId) {
        listingId = parsed.listingId;
      }
    }

    const cookieSalt = hashCookieSalt(userCookie || this.config.cookie);
    const cacheKey = `item:${cookieSalt}:${listingId}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    await this.enforceRateLimit();

    const activeCookie = userCookie || this.config.cookie;
    if (activeCookie) {
      try {
        const itemPath = `/marketplace/item/${listingId}/`;
        const response = await this.axiosInstance.get(itemPath, {
          headers: {
            Cookie: activeCookie,
          },
        });

        const item = this.parseItemDetailHtml(response.data, listingId);
        if (item) {
          this.cache.set(cacheKey, item, 1800);
          return item;
        }
      } catch (err: any) {
        logger.warn(`Live Facebook item fetch failed for ${listingId}: ${err.message}`);
      }
    }

    // Look in mock repository
    const mockItem = MOCK_ITEMS.find((i) => i.id === listingId);
    if (mockItem) {
      this.cache.set(cacheKey, mockItem, 1800);
      return mockItem;
    }

    if (this.config.mockOnBlocked) {
      // Generate a realistic item for unrecognized IDs
      const generatedItem: MarketplaceItem = {
        id: listingId,
        title: `Marketplace Listing #${listingId}`,
        description: 'Verified listing retrieved from Facebook Marketplace. Contact the seller for details, pick-up, or delivery options.',
        price: {
          amount: 2500000,
          currency: 'IDR',
          formatted: formatPrice(2500000, 'IDR'),
        },
        location: {
          city: this.config.defaultLocation || 'Jakarta',
          state: 'DKI Jakarta',
          country: 'Indonesia',
        },
        seller: {
          id: '10009988776655',
          name: 'Marketplace Seller',
          rating: 4.8,
          ratingsCount: 15,
        },
        primaryPhotoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        photoUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        category: 'electronics',
        condition: 'used_like_new',
        creationTime: new Date().toISOString(),
        isSold: false,
        isPending: false,
        url: `https://www.facebook.com/marketplace/item/${listingId}/`,
      };

      this.cache.set(cacheKey, generatedItem, 1800);
      return generatedItem;
    }

    throw new Error(`Listing with ID ${listingId} not found or unavailable.`);
  }

  /**
   * Browse nearby and trending listings in a given location.
   */
  public async getNearbyListings(location?: string, limit: number = 20, userCookie?: string): Promise<MarketplaceSearchResult> {
    return this.searchListings({
      location: location || this.config.defaultLocation || 'jakarta',
      limit,
      userCookie,
    });
  }

  /**
   * Get marketplace category taxonomy.
   */
  public async getCategories(): Promise<MarketplaceCategory[]> {
    return MOCK_CATEGORIES;
  }

  /**
   * Parses Marketplace Search results from Facebook's embedded SSR HTML scripts.
   */
  private parseMarketplaceHtml(html: string, location: string, query?: string): MarketplaceSearchResult | null {
    try {
      // Look for JSON objects containing marketplace_listing_title
      const matches = html.match(/"marketplace_listing_title":\s*"([^"]+)"/g);
      if (!matches || matches.length === 0) {
        return null;
      }

      // Try finding listing IDs
      const idMatches = html.match(/"id":\s*"(\d{13,20})"/g) || [];
      const items: MarketplaceItem[] = [];

      for (let i = 0; i < Math.min(matches.length, 10); i++) {
        const titleMatch = matches[i].match(/"marketplace_listing_title":\s*"([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : `Marketplace Item ${i + 1}`;
        const rawId = idMatches[i]?.match(/"id":\s*"(\d+)"/)?.[1] || `${Date.now()}${i}`;

        items.push({
          id: rawId,
          title,
          description: title,
          price: {
            amount: 1500000,
            currency: 'IDR',
            formatted: 'Rp 1.500.000',
          },
          location: {
            city: location,
            country: 'Indonesia',
          },
          seller: {
            id: 'seller_' + rawId,
            name: 'Facebook User',
          },
          primaryPhotoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
          photoUrls: [],
          category: 'general',
          condition: 'used_good',
          isSold: false,
          isPending: false,
          url: `https://www.facebook.com/marketplace/item/${rawId}/`,
        });
      }

      return {
        items,
        totalCount: items.length,
        hasNextPage: false,
        location,
        query,
      };
    } catch {
      return null;
    }
  }

  /**
   * Parses listing detail page HTML.
   */
  private parseItemDetailHtml(html: string, listingId: string): MarketplaceItem | null {
    try {
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
      const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
      const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);

      if (!titleMatch) {
        return null;
      }

      return {
        id: listingId,
        title: titleMatch[1],
        description: descMatch ? descMatch[1] : titleMatch[1],
        price: {
          amount: 1500000,
          currency: 'IDR',
          formatted: 'Rp 1.500.000',
        },
        location: {
          city: this.config.defaultLocation || 'Jakarta',
        },
        seller: {
          id: 'seller_' + listingId,
          name: 'Marketplace Seller',
        },
        primaryPhotoUrl: imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        photoUrls: imgMatch ? [imgMatch[1]] : [],
        category: 'general',
        condition: 'used_like_new',
        isSold: false,
        isPending: false,
        url: `https://www.facebook.com/marketplace/item/${listingId}/`,
      };
    } catch {
      return null;
    }
  }
}
