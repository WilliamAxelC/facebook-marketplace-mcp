import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { FacebookClient } from './client/facebook-client.js';
import { logger } from './utils/logger.js';
import { createApiRouter } from './routes/api.js';
import {
  SearchMarketplaceSchema,
  GetListingDetailsSchema,
  GetNearbyListingsSchema,
  GetCategoriesSchema,
  ParseListingUrlSchema,
  handleSearchMarketplace,
  handleGetListingDetails,
  handleGetNearbyListings,
  handleGetCategories,
  handleParseListingUrl,
} from './tools/marketplace.js';
import { JsonRpcRequest, JsonRpcResponse } from './client/types.js';

/**
 * Creates and registers all tools on an McpServer instance.
 */
export function createMcpServer(client: FacebookClient): McpServer {
  const server = new McpServer({
    name: 'facebook-marketplace-mcp',
    version: '1.0.0',
  });

  // Tool 1: search_marketplace
  server.tool(
    'search_marketplace',
    'Search Facebook Marketplace listings with query keywords, city location, price min/max, condition, category, and sorting.',
    SearchMarketplaceSchema.shape,
    async (args) => {
      try {
        const result = await handleSearchMarketplace(client, args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error searching Facebook Marketplace: ${err.message}` }],
        };
      }
    }
  );

  // Tool 2: get_listing_details
  server.tool(
    'get_listing_details',
    'Get full listing details, price, description, seller profile, images, location, and condition by Facebook listing ID or Marketplace URL.',
    GetListingDetailsSchema.shape,
    async (args) => {
      try {
        const result = await handleGetListingDetails(client, args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error fetching listing details: ${err.message}` }],
        };
      }
    }
  );

  // Tool 3: get_nearby_listings
  server.tool(
    'get_nearby_listings',
    'Browse recent and trending marketplace listings in a specific city/location.',
    GetNearbyListingsSchema.shape,
    async (args) => {
      try {
        const result = await handleGetNearbyListings(client, args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error fetching nearby listings: ${err.message}` }],
        };
      }
    }
  );

  // Tool 4: get_marketplace_categories
  server.tool(
    'get_marketplace_categories',
    'Explore Facebook Marketplace category taxonomy tree (Vehicles, Property Rentals, Electronics, Home Goods, Apparel, Hobbies).',
    GetCategoriesSchema.shape,
    async (args) => {
      try {
        const result = await handleGetCategories(client, args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error fetching categories: ${err.message}` }],
        };
      }
    }
  );

  // Tool 5: parse_listing_url
  server.tool(
    'parse_listing_url',
    'Parse and validate a Facebook Marketplace URL to extract the listing ID, location, or search query.',
    ParseListingUrlSchema.shape,
    async (args) => {
      try {
        const result = handleParseListingUrl(args as any);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error parsing URL: ${err.message}` }],
        };
      }
    }
  );

  return server;
}

/**
 * Creates the Express application containing:
 * 1. API Key & Demo Rate-Limiting Authentication
 * 2. Prefix-aware MCP SSE endpoint (/sse + /messages)
 * 3. Modern MCP Streamable HTTP / HTTP POST endpoint (/mcp)
 * 4. REST API routes (/api/marketplace/...)
 * 5. Health check and service metadata
 */
export function createExpressApp(client: FacebookClient): Express {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));

  // In-memory rate limiting map for demo / unauthenticated playground
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  // Authentication Middleware conforming to MCP_HOSTING_SPEC.md
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Exempt public health check and root info
    const path = req.path;
    if (path === '/' || path === '/health' || path.endsWith('/health')) {
      return next();
    }

    const configuredApiKey = process.env.API_KEY?.trim();
    if (!configuredApiKey) {
      // No server API key configured: allow request
      return next();
    }

    // Extract incoming API Key
    let clientKey: string | undefined = undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      clientKey = authHeader.substring(7).trim();
    } else if (req.headers['x-api-key']) {
      clientKey = (req.headers['x-api-key'] as string).trim();
    } else if (req.query.apiKey) {
      clientKey = (req.query.apiKey as string).trim();
    }

    if (clientKey === configuredApiKey) {
      // Authenticated with full quota
      return next();
    }

    // Section 3: Limited Public Playground / Demo Mode
    // Rate limit per IP: 10 requests per minute
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 10;

    let tracker = rateLimitMap.get(ip);
    if (!tracker || now > tracker.resetTime) {
      tracker = { count: 1, resetTime: now + windowMs };
      rateLimitMap.set(ip, tracker);
    } else {
      tracker.count++;
    }

    if (tracker.count > maxRequests) {
      res.status(429).json({
        error: 'Rate limit exceeded for public playground. Please provide a valid API key via x-api-key header.',
        retryAfter: Math.ceil((tracker.resetTime - now) / 1000),
      });
      return;
    }

    res.setHeader('X-Playground-Demo', 'true');
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - tracker.count).toString());
    next();
  });

  // Mount REST API routes
  app.use(createApiRouter(client));

  // Active SSE transports keyed by sessionId
  const transports = new Map<string, SSEServerTransport>();

  // Determine prefix for reverse proxy setups (e.g. mcp.cuang.dev/facebook)
  const getBasePath = (req: Request): string => {
    const forwardedPrefix = (req.headers['x-forwarded-prefix'] as string) || '';
    if (forwardedPrefix) {
      return forwardedPrefix.replace(/\/+$/, '');
    }
    const envPrefix = process.env.BASE_PATH || '';
    return envPrefix.replace(/\/+$/, '');
  };

  // ==========================================
  // MCP SSE Stream Endpoint
  // ==========================================
  app.get('/sse', async (req: Request, res: Response) => {
    const basePath = getBasePath(req);
    const messagesPath = `${basePath}/messages`;

    logger.info(`New MCP client connected via SSE (/sse) - Messages path: ${messagesPath}`);
    const transport = new SSEServerTransport(messagesPath, res);
    transports.set(transport.sessionId, transport);

    res.on('close', () => {
      logger.info(`MCP client disconnected (sessionId: ${transport.sessionId})`);
      transports.delete(transport.sessionId);
    });

    const mcpServer = createMcpServer(client);
    await mcpServer.connect(transport);
  });

  // ==========================================
  // MCP Message POST Endpoint
  // ==========================================
  app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.get(sessionId);

    if (!transport) {
      res.status(404).json({ error: `Session ${sessionId} not found.` });
      return;
    }

    await transport.handlePostMessage(req, res);
  });

  // ==========================================
  // Modern MCP Streamable HTTP / HTTP POST Endpoint
  // Accepts direct JSON-RPC 2.0 requests over HTTP POST
  // ==========================================
  app.post('/mcp', async (req: Request, res: Response) => {
    const body: JsonRpcRequest = req.body;
    if (!body || body.jsonrpc !== '2.0' || !body.method) {
      res.status(400).json({
        jsonrpc: '2.0',
        id: body?.id ?? null,
        error: { code: -32600, message: 'Invalid JSON-RPC 2.0 Request' },
      });
      return;
    }

    const { id, method, params } = body;

    try {
      if (method === 'initialize') {
        const response: JsonRpcResponse = {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'facebook-marketplace-mcp',
              version: '1.0.0',
            },
            capabilities: {
              tools: {},
            },
          },
        };
        res.json(response);
        return;
      }

      if (method === 'ping') {
        res.json({ jsonrpc: '2.0', id, result: {} });
        return;
      }

      if (method === 'tools/list') {
        const response: JsonRpcResponse = {
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'search_marketplace',
                description: 'Search Facebook Marketplace listings with keyword, location, price filters, category, condition, and sorting.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string', description: 'Product search keyword' },
                    location: { type: 'string', description: 'Target city name' },
                    minPrice: { type: 'number', description: 'Minimum price filter' },
                    maxPrice: { type: 'number', description: 'Maximum price filter' },
                    category: { type: 'string', enum: ['all', 'vehicles', 'property_rentals', 'electronics', 'home_goods', 'apparel', 'hobbies'] },
                    condition: { type: 'string', enum: ['new', 'used_like_new', 'used_good', 'used_fair'] },
                    sortBy: { type: 'string', enum: ['best_match', 'price_asc', 'price_desc', 'creation_time_desc'] },
                    limit: { type: 'integer', minimum: 1, maximum: 50 },
                    cookie: { type: 'string', description: 'Optional Facebook session cookie' },
                  },
                },
              },
              {
                name: 'get_listing_details',
                description: 'Get full listing details, price, seller info, and photos by Facebook listing ID or URL.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    listingIdOrUrl: { type: 'string', description: 'Marketplace listing ID or URL' },
                    cookie: { type: 'string', description: 'Optional Facebook session cookie' },
                  },
                  required: ['listingIdOrUrl'],
                },
              },
              {
                name: 'get_nearby_listings',
                description: 'Browse recent/trending marketplace items in a specified city.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    location: { type: 'string', description: 'City name' },
                    limit: { type: 'integer' },
                    cookie: { type: 'string' },
                  },
                },
              },
              {
                name: 'get_marketplace_categories',
                description: 'Explore Facebook Marketplace category taxonomy tree.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    filter: { type: 'string', description: 'Category keyword filter' },
                  },
                },
              },
              {
                name: 'parse_listing_url',
                description: 'Parse Facebook Marketplace URLs to extract listing IDs and canonical formats.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', description: 'Marketplace URL to parse' },
                  },
                  required: ['url'],
                },
              },
            ],
          },
        };
        res.json(response);
        return;
      }

      if (method === 'tools/call') {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};

        let toolResult: any;
        if (toolName === 'search_marketplace') {
          toolResult = await handleSearchMarketplace(client, toolArgs);
        } else if (toolName === 'get_listing_details') {
          toolResult = await handleGetListingDetails(client, toolArgs);
        } else if (toolName === 'get_nearby_listings') {
          toolResult = await handleGetNearbyListings(client, toolArgs);
        } else if (toolName === 'get_marketplace_categories') {
          toolResult = await handleGetCategories(client, toolArgs);
        } else if (toolName === 'parse_listing_url') {
          toolResult = handleParseListingUrl(toolArgs);
        } else {
          res.status(404).json({
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Tool '${toolName}' not found.` },
          });
          return;
        }

        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(toolResult, null, 2) }],
          },
        });
        return;
      }

      res.status(404).json({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method '${method}' not found.` },
      });
    } catch (err: any) {
      res.status(500).json({
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: err.message },
      });
    }
  });

  // Root information endpoint
  app.get('/', (req: Request, res: Response) => {
    const basePath = getBasePath(req);
    res.json({
      service: 'Facebook Marketplace MCP & REST Server',
      description: 'Model Context Protocol (MCP) server supporting Stdio, SSE, Streamable HTTP, and REST API for Facebook Marketplace',
      version: '1.0.0',
      domain: 'mcp.cuang.dev',
      basePath: basePath || '/',
      transports: {
        mcp_stdio: 'npx facebook-marketplace-mcp --stdio',
        mcp_sse: `${basePath}/sse`,
        mcp_messages: `${basePath}/messages`,
        mcp_streamable_http: `${basePath}/mcp`,
        rest_api: `${basePath}/api/marketplace`,
        health: `${basePath}/health`,
      },
      tools: [
        'search_marketplace',
        'get_listing_details',
        'get_nearby_listings',
        'get_marketplace_categories',
        'parse_listing_url',
      ],
      restEndpoints: [
        `GET ${basePath}/api/marketplace/search?query=...&location=...&minPrice=...&maxPrice=...`,
        `GET ${basePath}/api/marketplace/items/:id`,
        `GET ${basePath}/api/marketplace/nearby?location=...`,
        `GET ${basePath}/api/marketplace/categories`,
        `POST ${basePath}/api/marketplace/parse-url`,
      ],
    });
  });

  return app;
}

/**
 * Starts the server in stdio mode for local desktop AI assistants (Claude Desktop, Cursor, Antigravity).
 */
export async function startStdioServer(client: FacebookClient): Promise<void> {
  logger.setStdioMode(true);
  logger.info('Starting Facebook Marketplace MCP server in stdio mode...');
  const server = createMcpServer(client);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('Facebook Marketplace MCP server connected to stdio.');
}
