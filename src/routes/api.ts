import { Router, Request, Response } from 'express';
import { FacebookClient } from '../client/facebook-client.js';
import {
  handleSearchMarketplace,
  handleGetListingDetails,
  handleGetNearbyListings,
  handleGetCategories,
  handleParseListingUrl,
} from '../tools/marketplace.js';

export function createApiRouter(client: FacebookClient): Router {
  const router = Router();

  // Helper to extract user-submitted cookie from headers or query
  const getUserCookie = (req: Request): string | undefined => {
    const headerCookie = (req.headers['x-facebook-cookie'] as string) || (req.headers['x-fb-cookie'] as string);
    if (headerCookie) return headerCookie;
    return (req.query.cookie as string) || undefined;
  };

  // Health check endpoint
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'facebook-marketplace-mcp',
      timestamp: new Date().toISOString(),
      cacheStats: client.getCache().getStats(),
    });
  });

  // Search Marketplace items
  router.get('/api/marketplace/search', async (req: Request, res: Response) => {
    try {
      const query = (req.query.query as string) || (req.query.q as string) || undefined;
      const location = (req.query.location as string) || 'jakarta';
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const category = (req.query.category as any) || 'all';
      const condition = (req.query.condition as any) || undefined;
      const sortBy = (req.query.sortBy as any) || 'best_match';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const cookie = getUserCookie(req);

      const result = await handleSearchMarketplace(client, {
        query,
        location,
        minPrice,
        maxPrice,
        category,
        condition,
        sortBy,
        limit,
        cookie,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get item detail by ID
  router.get('/api/marketplace/items/:id', async (req: Request, res: Response) => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
      const cookie = getUserCookie(req);
      const item = await handleGetListingDetails(client, {
        listingIdOrUrl: id,
        cookie,
      });
      res.json(item);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  // Get item detail by URL query
  router.get('/api/marketplace/item', async (req: Request, res: Response) => {
    try {
      const url = (req.query.url as string) || (req.query.id as string);
      if (!url) {
        res.status(400).json({ error: 'Query parameter "url" or "id" is required.' });
        return;
      }
      const cookie = getUserCookie(req);
      const item = await handleGetListingDetails(client, {
        listingIdOrUrl: url,
        cookie,
      });
      res.json(item);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  // Get nearby listings
  router.get('/api/marketplace/nearby', async (req: Request, res: Response) => {
    try {
      const location = (req.query.location as string) || 'jakarta';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const cookie = getUserCookie(req);
      const result = await handleGetNearbyListings(client, {
        location,
        limit,
        cookie,
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get categories taxonomy
  router.get('/api/marketplace/categories', async (req: Request, res: Response) => {
    try {
      const filter = (req.query.filter as string) || undefined;
      const categories = await handleGetCategories(client, { filter });
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Parse marketplace URL
  router.post('/api/marketplace/parse-url', (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'Body parameter "url" is required.' });
      return;
    }
    const parsed = handleParseListingUrl({ url });
    res.json(parsed);
  });

  return router;
}
