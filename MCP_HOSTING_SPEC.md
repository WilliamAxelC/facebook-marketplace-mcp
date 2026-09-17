# mcp.cuang.dev Unified Hosting & Architecture Specification

> **MANDATORY DIRECTIVE FOR ALL AGENTS & DEVELOPERS**:
> This document defines the unified hosting architecture, deployment strategy, and authentication policy established for all e-commerce MCP servers (`shopee-indonesia-mcp`, `tokopedia-mcp`, and `facebook-marketplace-mcp`).
> 
> **Reference Implementation**: See [`/home/agent/orca/shopee-indonesia-mcp`](file:///home/agent/orca/shopee-indonesia-mcp) which has this fully implemented and verified with a 20/20 test suite.

---

## 1. Hosting Architecture: Local Node Server + Cloudflare Reverse Proxy
- **Target Domain**: `https://mcp.cuang.dev`
- **Infrastructure Strategy**: 
  - The server is **hosted locally on the machine/home server in Indonesia**.
  - Public access is routed via a **Cloudflare Reverse Proxy / Cloudflare Tunnel** (`cloudflared`) pointing to the local port (e.g. `http://localhost:3000` or per-service port).
- **Why this architecture is required**:
  - Outgoing requests to Indonesian platforms (Tokopedia, Shopee, FB Marketplace) exit through the local residential ISP, bypassing datacenter IP bans (`Error 90309999` on Shopee, Akamai/Cloudflare bot triggers on Tokopedia, automated blockades on FB).
  - Incoming requests from remote AI agents and users enter through Cloudflare Tunnel with free TLS/SSL and DDoS protection.

---

## 2. Authentication: API Key Based
All production access on `mcp.cuang.dev` must be gated by an **API Key**:

### Accepted Authentication Headers & Parameters:
1. `x-api-key: <API_KEY>`
2. `Authorization: Bearer <API_KEY>`
3. Query parameter for SSE stream connections: `?apiKey=<API_KEY>`

When `process.env.API_KEY` is configured:
- Callers presenting a valid key receive full, unrestricted throughput according to their quota.
- Callers with an invalid key are rejected with `HTTP 401 Unauthorized`.
- When `API_KEY` is unset, the server runs in open mode for local development.

---

## 3. Limited Public Playground
To allow developers and evaluators to test the tools without an API key:
- A public playground is enabled by default (`PLAYGROUND_ENABLED=true`):
  - **Strict IP Rate Limiting**: Max 10 requests per minute per IP address. Exceeding limits triggers `HTTP 429 Too Many Requests` with a `Retry-After` header.
  - **Capped Output**: Responses are capped to a small number of items (max 3 to 5 items) to prevent heavy data extraction.

---

## 4. User-Submitted Session Cookies & Privacy
- Platform session cookies (e.g. Tokopedia `_SID_Tokopedia`, Shopee `SPC_EC`, Facebook `c_user`/`xs`) can be provided by users:
  - Header: `x-facebook-cookie` (or service-specific cookie header)
  - Tool Argument: Optional `cookie?: string` in tool schemas
- **Rules for Cookie Handling**:
  - Ephemeral in-memory handling only (NEVER write user cookies to logs, stdout, or disk).
  - Cache keys must be salted with a hash of the cookie (`c_${hash}`) to prevent cross-tenant data leakage.

---

## 5. Dual Interfaces & Tools Standard
Each server must expose both interfaces:
1. **MCP Interface**:
   - `stdio` transport for local AI assistants (Claude Desktop, Cursor).
   - `SSE` transport (`/sse`, `/messages`) for remote MCP clients.
2. **REST API**:
   - Direct HTTP endpoints under `/api/*` and public `/health`.
3. **Health Check Endpoint (`GET /health`)**:
   - Must return `{ status: "ok", service: "<name>", apiKeyRequired: boolean, playgroundEnabled: boolean, cache: ... }`.

---

## 6. Code Patterns to Replicate
Follow the implementation in `shopee-indonesia-mcp`:
- **Auth & Playground Middleware**: [`src/routes/api.ts`](file:///home/agent/orca/shopee-indonesia-mcp/src/routes/api.ts)
- **MCP Server & SSE Setup**: [`src/server.ts`](file:///home/agent/orca/shopee-indonesia-mcp/src/server.ts)
- **Salted LRU Cache**: [`src/utils/cache.ts`](file:///home/agent/orca/shopee-indonesia-mcp/src/utils/cache.ts)
- **Verification Test Harness**: [`test/verify-all.ts`](file:///home/agent/orca/shopee-indonesia-mcp/test/verify-all.ts)
