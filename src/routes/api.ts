import { Router, Request, Response, NextFunction } from 'express';
import { FacebookClient } from '../client/facebook-client.js';
import { globalCache } from '../utils/cache.js';
import {
  handleSearchMarketplace,
  handleGetListingDetails,
  handleGetNearbyListings,
  handleGetCategories,
  handleParseListingUrl,
} from '../tools/marketplace.js';

// In-memory rate limiting tracker for the limited public playground
const playgroundHits = new Map<string, { count: number; resetAt: number }>();

/**
 * Middleware: Enforces API Key authentication or strictly limits playground requests per MCP_HOSTING_SPEC.
 */
export function authAndPlaygroundMiddleware(req: Request, res: Response, next: NextFunction) {
  const configuredKey = process.env.API_KEY;

  // Open mode if no API_KEY configured on server
  if (!configuredKey) {
    return next();
  }

  const providedKey =
    req.headers['x-api-key'] ||
    (typeof req.headers['authorization'] === 'string' && req.headers['authorization'].startsWith('Bearer ')
      ? req.headers['authorization'].slice(7).trim()
      : undefined) ||
    req.query.apiKey;

  if (providedKey) {
    if (providedKey === configuredKey) {
      (req as any).isAuthenticated = true;
      return next();
    }
    return res.status(401).json({
      error: 'Unauthorized: Invalid API key provided.',
    });
  }

  // If no valid API key: check if playground is enabled
  const playgroundEnabled = process.env.PLAYGROUND_ENABLED !== 'false';
  if (!playgroundEnabled) {
    return res.status(401).json({
      error: 'Unauthorized: A valid API key is required on this server. Provide it via header "x-api-key" or "Authorization: Bearer <key>".',
    });
  }

  // Rate-limit playground: default 10 requests per minute per IP
  const clientIp =
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : req.socket.remoteAddress) || 'unknown';

  const now = Date.now();
  const rateLimit = parseInt(process.env.PLAYGROUND_RATE_LIMIT || '10', 10);
  const windowMs = 60 * 1000;

  let record = playgroundHits.get(clientIp);
  if (!record || now > record.resetAt) {
    record = { count: 1, resetAt: now + windowMs };
    playgroundHits.set(clientIp, record);
  } else {
    record.count++;
  }

  if (record.count > rateLimit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      error: `Playground rate limit exceeded (${rateLimit} requests/min). Provide a valid API key for unrestricted access.`,
      retryAfterSeconds: retryAfter,
    });
  }

  (req as any).isPlayground = true;
  res.setHeader('X-Playground-Demo', 'true');
  res.setHeader('X-RateLimit-Remaining', Math.max(0, rateLimit - record.count).toString());
  next();
}

/**
 * Extracts optional per-request user cookie from header or query param.
 */
function extractUserCookie(req: Request): string | undefined {
  const fromHeader = (req.headers['x-facebook-cookie'] as string) || (req.headers['x-fb-cookie'] as string);
  if (typeof fromHeader === 'string' && fromHeader.trim()) {
    return fromHeader.trim();
  }
  const fromQuery = req.query.cookie;
  if (typeof fromQuery === 'string' && fromQuery.trim()) {
    return fromQuery.trim();
  }
  return undefined;
}

export function createApiRouter(client: FacebookClient): Router {
  const router = Router();

  // Public Health check (no auth required per MCP_HOSTING_SPEC)
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'facebook-marketplace-mcp',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      apiKeyRequired: Boolean(process.env.API_KEY),
      playgroundEnabled: process.env.PLAYGROUND_ENABLED !== 'false',
      cache: globalCache.getStats(),
    });
  });

  // Apply authentication & playground rate limiting to /api routes
  router.use('/api', authAndPlaygroundMiddleware);

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
      
      let limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
      // Cap limit in playground mode per Section 3
      if ((req as any).isPlayground) {
        limit = Math.min(limit, 5);
      }

      const cookie = extractUserCookie(req);

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
      const cookie = extractUserCookie(req);
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
      const cookie = extractUserCookie(req);
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
      let limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
      if ((req as any).isPlayground) {
        limit = Math.min(limit, 5);
      }
      const cookie = extractUserCookie(req);
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
