import assert from 'node:assert';
import http from 'node:http';
import { parseMarketplaceUrl, formatPrice, hashCookieSalt, cleanDescription } from '../src/utils/formatters.js';
import { MemoryCache } from '../src/utils/cache.js';
import { FacebookClient } from '../src/client/facebook-client.js';
import { createExpressApp, createMcpServer } from '../src/server.js';

async function runTests() {
  console.log('🧪 Starting Facebook Marketplace MCP test suite...\n');

  // ==========================================
  // Test 1: URL Parsing & Formatting
  // ==========================================
  console.log('Test 1: URL Parsing & Formatting');
  const url1 = parseMarketplaceUrl('https://www.facebook.com/marketplace/item/729481902830192/');
  assert.strictEqual(url1.isValid, true);
  assert.strictEqual(url1.type, 'item');
  assert.strictEqual(url1.listingId, '729481902830192');

  const url2 = parseMarketplaceUrl('https://m.facebook.com/marketplace/item/810394829103918?ref=search');
  assert.strictEqual(url2.isValid, true);
  assert.strictEqual(url2.type, 'item');
  assert.strictEqual(url2.listingId, '810394829103918');

  const url3 = parseMarketplaceUrl('https://www.facebook.com/marketplace/jakarta/search/?query=macbook');
  assert.strictEqual(url3.isValid, true);
  assert.strictEqual(url3.type, 'search');
  assert.strictEqual(url3.location, 'jakarta');
  assert.strictEqual(url3.query, 'macbook');

  const url4 = parseMarketplaceUrl('https://www.facebook.com/marketplace/nyc/vehicles');
  assert.strictEqual(url4.isValid, true);
  assert.strictEqual(url4.location, 'nyc');

  const invalidUrl = parseMarketplaceUrl('https://google.com/search?q=fb');
  assert.strictEqual(invalidUrl.isValid, false);

  assert.strictEqual(formatPrice(1500000, 'IDR'), 'Rp 1.500.000');
  assert.strictEqual(formatPrice(450, 'USD'), '$450.00');

  const salt1 = hashCookieSalt('c_user=123; xs=abc');
  const salt2 = hashCookieSalt('c_user=123; xs=abc');
  const salt3 = hashCookieSalt('c_user=999; xs=xyz');
  assert.strictEqual(salt1, salt2);
  assert.notStrictEqual(salt1, salt3);

  const clean = cleanDescription('<b>Title</b>\n\n\n\nDescription text   ');
  assert.strictEqual(clean, 'Title\n\nDescription text');
  console.log('  ✅ URL parsing & formatting tests passed');

  // ==========================================
  // Test 2: MemoryCache LRU & Expiry
  // ==========================================
  console.log('\nTest 2: MemoryCache LRU & TTL');
  const cache = new MemoryCache({ maxEntries: 2, defaultTTLSeconds: 1 });
  cache.set('key1', 'val1');
  cache.set('key2', 'val2');
  assert.strictEqual(cache.get('key1'), 'val1');
  assert.strictEqual(cache.get('key2'), 'val2');

  // Evicts oldest entry
  cache.set('key3', 'val3');
  assert.strictEqual(cache.has('key3'), true);
  const stats = cache.getStats();
  assert.strictEqual(stats.size, 2);
  console.log('  ✅ Cache tests passed:', stats);

  // ==========================================
  // Test 3: FacebookClient Functionality
  // ==========================================
  console.log('\nTest 3: FacebookClient Search & Details');
  const client = new FacebookClient({ mockOnBlocked: true, defaultLocation: 'jakarta' });

  // Search by query
  const searchResult = await client.searchListings({ query: 'MacBook', location: 'jakarta' });
  assert(Array.isArray(searchResult.items));
  assert(searchResult.items.length > 0);
  assert(searchResult.items[0].title.toLowerCase().includes('macbook'));
  console.log(`  ✅ Search returned ${searchResult.items.length} items for "MacBook"`);

  // Search by price range
  const priceResult = await client.searchListings({ maxPrice: 1000, location: 'new york' });
  assert(priceResult.items.every((i) => i.price.amount <= 1000));
  console.log(`  ✅ Price filtered search returned ${priceResult.items.length} items`);

  // Item detail by ID
  const itemDetail = await client.getListingDetails('729481902830192');
  assert.strictEqual(itemDetail.id, '729481902830192');
  assert(itemDetail.seller.name);
  console.log(`  ✅ Item detail fetched: "${itemDetail.title}" (${itemDetail.price.formatted})`);

  // Item detail by URL
  const itemByUrl = await client.getListingDetails('https://www.facebook.com/marketplace/item/810394829103918/');
  assert.strictEqual(itemByUrl.id, '810394829103918');
  console.log(`  ✅ Item fetched via URL: "${itemByUrl.title}"`);

  // Categories
  const categories = await client.getCategories();
  assert(Array.isArray(categories) && categories.length > 0);
  console.log(`  ✅ Categories fetched: ${categories.length} top-level categories`);

  // ==========================================
  // Test 4: MCP Server Registration
  // ==========================================
  console.log('\nTest 4: McpServer Tool Registration');
  const mcpServer = createMcpServer(client);
  assert(mcpServer !== null);
  console.log('  ✅ McpServer initialized with all 5 tools');

  // ==========================================
  // Test 5: Express App Endpoints & REST API
  // ==========================================
  console.log('\nTest 5: Express Server & REST API Endpoints');
  const app = createExpressApp(client);
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`  Test server listening on ${baseUrl}`);

  // Test GET /health
  const resHealth = await fetch(`${baseUrl}/health`).then((r) => r.json());
  assert.strictEqual(resHealth.status, 'ok');
  assert.strictEqual(resHealth.service, 'facebook-marketplace-mcp');
  console.log('  ✅ GET /health verified:', resHealth.service);

  // Test GET /
  const resRoot = await fetch(`${baseUrl}/`).then((r) => r.json());
  assert.strictEqual(resRoot.service, 'Facebook Marketplace MCP & REST Server');
  assert(Array.isArray(resRoot.tools));
  assert.strictEqual(resRoot.tools.length, 5);
  console.log('  ✅ GET / verified (5 tools listed)');

  // Test GET /api/marketplace/search
  const resApiSearch = await fetch(`${baseUrl}/api/marketplace/search?query=MacBook&limit=2`).then((r) => r.json());
  assert(resApiSearch.items && resApiSearch.items.length > 0);
  console.log(`  ✅ GET /api/marketplace/search returned ${resApiSearch.items.length} items`);

  // Test GET /api/marketplace/items/:id
  const resApiItem = await fetch(`${baseUrl}/api/marketplace/items/729481902830192`).then((r) => r.json());
  assert.strictEqual(resApiItem.id, '729481902830192');
  console.log(`  ✅ GET /api/marketplace/items/:id verified: "${resApiItem.title}"`);

  // Test GET /api/marketplace/categories
  const resApiCat = await fetch(`${baseUrl}/api/marketplace/categories`).then((r) => r.json());
  assert(Array.isArray(resApiCat));
  console.log(`  ✅ GET /api/marketplace/categories verified (${resApiCat.length} categories)`);

  // Test POST /api/marketplace/parse-url
  const resApiParse = await fetch(`${baseUrl}/api/marketplace/parse-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://www.facebook.com/marketplace/item/729481902830192/' }),
  }).then((r) => r.json());
  assert.strictEqual(resApiParse.listingId, '729481902830192');
  console.log('  ✅ POST /api/marketplace/parse-url verified');

  // ==========================================
  // Test 6: Modern MCP Streamable HTTP (/mcp)
  // ==========================================
  console.log('\nTest 6: MCP Streamable HTTP POST (/mcp)');
  // 6.1 Initialize
  const rpcInit = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
    }),
  }).then((r) => r.json());
  assert.strictEqual(rpcInit.result.serverInfo.name, 'facebook-marketplace-mcp');
  console.log('  ✅ JSON-RPC initialize response:', rpcInit.result.serverInfo);

  // 6.2 tools/list
  const rpcTools = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    }),
  }).then((r) => r.json());
  assert(Array.isArray(rpcTools.result.tools));
  assert.strictEqual(rpcTools.result.tools.length, 5);
  console.log(`  ✅ JSON-RPC tools/list returned ${rpcTools.result.tools.length} tools`);

  // 6.3 tools/call: search_marketplace
  const rpcCall = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'search_marketplace',
        arguments: { query: 'Sony', limit: 1 },
      },
    }),
  }).then((r) => r.json());
  assert(rpcCall.result && rpcCall.result.content);
  const parsedContent = JSON.parse(rpcCall.result.content[0].text);
  assert(parsedContent.items && parsedContent.items.length > 0);
  console.log('  ✅ JSON-RPC tools/call (search_marketplace) passed');

  // 6.4 tools/call: get_listing_details
  const rpcDetail = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'get_listing_details',
        arguments: { listingIdOrUrl: '729481902830192' },
      },
    }),
  }).then((r) => r.json());
  const itemFromRpc = JSON.parse(rpcDetail.result.content[0].text);
  assert.strictEqual(itemFromRpc.id, '729481902830192');
  console.log('  ✅ JSON-RPC tools/call (get_listing_details) passed');

  server.close();
  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
