# mcp.cuang.dev Unified Hosting Specification

> **Notice for Agents & Developers**:
> This document specifies the unified hosting architecture and authentication policy decided by the platform owner for all e-commerce MCP servers (`shopee-indonesia-mcp`, `tokopedia-mcp`, and `facebook-marketplace-mcp`).

---

## 1. Hosting Target & Domain
- **Base Domain**: `https://mcp.cuang.dev`
- **Target Services**:
  - Shopee Indonesia: `/shopee` (or dedicated subdomain)
  - Tokopedia: `/tokopedia`
  - Facebook Marketplace: `/facebook`

---

## 2. Authentication Policy: API Key Based
All production access to MCP endpoints and REST APIs on `mcp.cuang.dev` must be gated by an **API Key**:

### Accepted Authentication Headers & Parameters:
1. `x-api-key: <API_KEY>`
2. `Authorization: Bearer <API_KEY>`
3. Query parameter for SSE stream connections: `?apiKey=<API_KEY>`

Requests with a valid API key have full access according to their quota.

---

## 3. Limited Public Playground
To allow developers and evaluators to test the tools without an API key:
- A public playground / demo mode is enabled with **strict rate limits**:
  - E.g., max 5 to 10 requests per minute per IP address.
  - Returns sample or cached queries, or live search with pagination capped to 5 items.
- Protects the underlying platform and proxy pools from scraping abuse and denial of service.

---

## 4. User-Submitted Cookies & Personalization
- Users with their own platform session cookies (e.g. Tokopedia `_SID_Tokopedia`, Shopee `SPC_EC`, Facebook `c_user`/`xs`) can supply them per-request:
  - Custom header: `x-tokopedia-cookie`, `x-shopee-cookie`, or `x-facebook-cookie`
  - Or as an optional `cookie?: string` parameter in tool schemas.
- The server processes user cookies **ephemerally** in memory (never logged, never stored on disk or DB).
- Cache keys must be salted by a hash of the user cookie to prevent cross-tenant data leakage.

---

## 5. Dual Packaging Support
In addition to the hosted deployment on `mcp.cuang.dev`:
- Each repository should remain compatible with local desktop execution via `stdio` (e.g. `npx` or local clone for Claude Desktop and Cursor).
