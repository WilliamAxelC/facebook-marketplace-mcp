#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { FacebookClient } from './client/facebook-client.js';
import { createExpressApp, startStdioServer } from './server.js';
import { logger } from './utils/logger.js';

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Facebook Marketplace MCP Server
Usage:
  npx facebook-marketplace-mcp [options]

Options:
  --stdio             Start in MCP stdio mode (for Claude Desktop, Cursor, Antigravity)
  --port, -p <number> Specify port for HTTP/SSE server (default: 3000, or env PORT)
  --host <string>     Specify host address (default: 0.0.0.0, or env HOST)
  --help, -h          Show this help message
  --version, -v       Show version

Transports Supported:
  • stdio             Local stdin/stdout JSON-RPC
  • sse               Server-Sent Events (/sse & /messages)
  • http              MCP Streamable HTTP POST (/mcp) and REST API (/api/marketplace)

Environment Variables:
  PORT                Server port (default: 3000)
  HOST                Server host (default: 0.0.0.0)
  BASE_PATH           Gateway prefix (e.g. /facebook for mcp.cuang.dev/facebook)
  API_KEY             Optional API key for gateway security
  FB_COOKIE           Facebook session cookie string (c_user=...; xs=...)
  HTTP_PROXY          Proxy URL
  HTTPS_PROXY         Proxy URL
  MOCK_ON_BLOCKED     Fallback to realistic mock data if blocked (default: true)
    `);
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log('facebook-marketplace-mcp v1.0.0');
    process.exit(0);
  }

  const isStdio = args.includes('--stdio') || process.env.MCP_TRANSPORT === 'stdio';

  const client = new FacebookClient({
    cookie: process.env.FB_COOKIE,
    dtsgToken: process.env.FB_DTSG,
    proxyUrl: process.env.HTTPS_PROXY || process.env.HTTP_PROXY,
    userAgent: process.env.USER_AGENT,
    defaultLocation: process.env.DEFAULT_LOCATION || 'jakarta',
    requestDelayMs: process.env.REQUEST_DELAY_MS ? parseInt(process.env.REQUEST_DELAY_MS, 10) : 400,
    mockOnBlocked: process.env.MOCK_ON_BLOCKED !== 'false',
  });

  if (isStdio) {
    await startStdioServer(client);
  } else {
    let port = parseInt(process.env.PORT || '3000', 10);
    const portArgIdx = args.findIndex((a) => a === '--port' || a === '-p');
    if (portArgIdx !== -1 && args[portArgIdx + 1]) {
      port = parseInt(args[portArgIdx + 1], 10);
    }

    let host = process.env.HOST || '0.0.0.0';
    const hostArgIdx = args.findIndex((a) => a === '--host');
    if (hostArgIdx !== -1 && args[hostArgIdx + 1]) {
      host = args[hostArgIdx + 1];
    }

    const app = createExpressApp(client);

    app.listen(port, host, () => {
      const basePath = (process.env.BASE_PATH || '').replace(/\/+$/, '');
      logger.info(`================================================================`);
      logger.info(`  Facebook Marketplace MCP & REST Server is running!            `);
      logger.info(`  Listening on:         http://${host}:${port}                  `);
      logger.info(`  MCP SSE Endpoint:     http://${host}:${port}${basePath}/sse   `);
      logger.info(`  MCP Streamable HTTP:  http://${host}:${port}${basePath}/mcp   `);
      logger.info(`  REST Health Check:    http://${host}:${port}${basePath}/health`);
      logger.info(`  API Documentation:    http://${host}:${port}${basePath}/      `);
      logger.info(`================================================================`);
    });
  }
}

main().catch((err) => {
  logger.error('Fatal server startup error:', err);
  process.exit(1);
});
