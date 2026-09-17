# Facebook Marketplace MCP Server

[![npm version](https://img.shields.io/npm/v/facebook-marketplace-mcp.svg)](https://www.npmjs.com/package/facebook-marketplace-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP Compliant](https://img.shields.io/badge/MCP-2024--11--05-brightgreen.svg)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)

Production-grade [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server and REST API service for **Facebook Marketplace**. 

Designed to support **stdio**, **SSE (Server-Sent Events)**, and **Streamable HTTP (JSON-RPC 2.0)**, ready for local desktop assistants (Claude Desktop, Cursor, Antigravity) and multi-service cloud deployments behind **Nginx** and **Docker Compose** on [`https://mcp.cuang.dev/facebook`](https://mcp.cuang.dev) alongside Shopee and Tokopedia.

---

## 🚀 Features

- **Triple Transport Architecture**:
  - 🖥️ **Stdio**: Zero-configuration desktop MCP execution (`npx facebook-marketplace-mcp --stdio`).
  - ⚡ **SSE (Server-Sent Events)**: Long-lived streaming endpoint at `/sse` with prefix-aware `/messages` dispatch.
  - 🌐 **Streamable HTTP**: Stateless JSON-RPC 2.0 POST endpoint at `/mcp`.
  - 🔌 **REST API**: Direct HTTP routes (`/api/marketplace/...`) and health checks.
- **Reverse Proxy & Prefix Awareness**:
  - Automatically honors `X-Forwarded-Prefix` and `BASE_PATH` (e.g. `/facebook` under `mcp.cuang.dev/facebook`).
- **Unified Multi-Platform Gateway**:
  - Includes Nginx and Docker Compose configurations ready to run alongside `shopee-indonesia-mcp` and `tokopedia-mcp`.
- **5 High-Level MCP Tools**:
  - `search_marketplace`: Full query, location, price min/max, condition, category, and sorting filters.
  - `get_listing_details`: Deep listing inspection, price, seller info, location, attributes, and photos.
  - `get_nearby_listings`: Browse local/trending items in any city without keywords.
  - `get_marketplace_categories`: Category taxonomy navigation.
  - `parse_listing_url`: Extract IDs, location slugs, and canonical links.
- **Enterprise Security & Isolation**:
  - API Key protection (`x-api-key`, `Authorization: Bearer`, or query parameter `?apiKey=`).
  - Ephemeral user session cookies (`x-facebook-cookie` header or `cookie` parameter) processed strictly in-memory without persistent logging.
  - Cache keys salted by hash of session cookies to prevent cross-tenant data leakage.
  - Built-in simulation fallback mode (`MOCK_ON_BLOCKED=true`) ensuring zero downtime during testing or anti-bot blocks.

---

## 📦 Quickstart via NPM (Local Desktop MCP)

You can run the server directly without cloning:

```bash
# Stdio mode (recommended for Claude Desktop, Cursor, Antigravity)
npx facebook-marketplace-mcp --stdio

# Or start as a local HTTP / SSE server on port 3000
npx facebook-marketplace-mcp --port 3000
```

### Claude Desktop Configuration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "facebook-marketplace": {
      "command": "npx",
      "args": ["-y", "facebook-marketplace-mcp", "--stdio"],
      "env": {
        "DEFAULT_LOCATION": "jakarta",
        "FB_COOKIE": ""
      }
    }
  }
}
```

### Cursor & Antigravity Configuration

In Cursor (`Settings -> Features -> MCP Servers`) or Antigravity:

- **Name**: `facebook-marketplace`
- **Type**: `command` (stdio)
- **Command**: `npx -y facebook-marketplace-mcp --stdio`

---

## 🛠️ MCP Tools Overview

### 1. `search_marketplace`
Search listings with query keywords, city location, price filters, category, condition, and sorting.

```json
{
  "query": "MacBook Pro M3",
  "location": "jakarta",
  "minPrice": 15000000,
  "maxPrice": 30000000,
  "category": "electronics",
  "condition": "used_like_new",
  "sortBy": "price_asc",
  "limit": 10
}
```

### 2. `get_listing_details`
Retrieve item attributes, seller details, formatted prices, and high-resolution photo URLs.

```json
{
  "listingIdOrUrl": "729481902830192"
}
```
*(Accepts either numeric listing IDs or full Facebook Marketplace URLs).*

### 3. `get_nearby_listings`
Browse trending or recent marketplace listings in a specific city.

```json
{
  "location": "jakarta",
  "limit": 20
}
```

### 4. `get_marketplace_categories`
Get taxonomy of categories and subcategories.

```json
{
  "filter": "vehicles"
}
```

### 5. `parse_listing_url`
Parses and validates Facebook Marketplace URLs into canonical formats.

```json
{
  "url": "https://www.facebook.com/marketplace/item/729481902830192/"
}
```

---

## 🌐 HTTP & SSE Transports

When running as an HTTP server (`PORT=3000`, `BASE_PATH=/facebook`):

| Protocol | Endpoint | Description |
|---|---|---|
| **MCP SSE Stream** | `GET /facebook/sse` | MCP Server-Sent Events handshake |
| **MCP SSE Messages** | `POST /facebook/messages?sessionId=...` | Client JSON-RPC dispatch endpoint |
| **MCP Streamable HTTP** | `POST /facebook/mcp` | Direct JSON-RPC 2.0 request/response |
| **REST Search** | `GET /facebook/api/marketplace/search` | REST endpoint for search queries |
| **REST Item Details** | `GET /facebook/api/marketplace/items/:id` | REST endpoint for item details |
| **Health Check** | `GET /facebook/health` | Container and cache health check |
| **Service Root** | `GET /facebook/` | Interactive JSON discovery & docs |

---

## 🐳 Docker & Multi-Service Deployment (`mcp.cuang.dev`)

This server is designed to be deployed alongside **Shopee** and **Tokopedia** behind an **Nginx** reverse proxy under `https://mcp.cuang.dev/<mcp-name>`.

### Standalone Docker

```bash
docker build -t facebook-marketplace-mcp .
docker run -d -p 3002:3000 --name facebook-mcp facebook-marketplace-mcp
```

### Unified Multi-Service Stack

To launch Nginx, Facebook Marketplace, Shopee, and Tokopedia together:

```bash
docker compose -f deploy/docker-compose.unified.yml up -d --build
```

Nginx routes traffic as follows:
- `https://mcp.cuang.dev/facebook/` ➔ `facebook-marketplace-mcp:3000/`
- `https://mcp.cuang.dev/shopee/` ➔ `shopee-indonesia-mcp:3000/`
- `https://mcp.cuang.dev/tokopedia/` ➔ `tokopedia-mcp:3000/`
- `https://mcp.cuang.dev/health` ➔ Aggregated Gateway Health

---

## ⚙️ Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port to listen on |
| `HOST` | `0.0.0.0` | Network binding interface |
| `BASE_PATH` | `""` | Base route prefix (e.g. `/facebook`) |
| `API_KEY` | `""` | Optional API key protecting public endpoints |
| `FB_COOKIE` | `""` | Optional Facebook session cookies (`c_user=...; xs=...`) |
| `DEFAULT_LOCATION` | `jakarta` | Default city for unlocalized searches |
| `HTTP_PROXY` | `""` | HTTP proxy URL |
| `HTTPS_PROXY` | `""` | HTTPS proxy URL |
| `REQUEST_DELAY_MS` | `400` | Minimum delay between live scraper requests |
| `MOCK_ON_BLOCKED` | `true` | Fallback to simulation mode if blocked or unauthenticated |
| `LOG_LEVEL` | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`) |

---

## 🧪 Development & Testing

```bash
# Install dependencies
npm install

# Run test suite
npm test

# Build TypeScript to dist/
npm run build

# Verify npm package tarball
npm pack --dry-run
```

---

## 📄 License

MIT © [William Axel](https://github.com/WilliamAxelC)
