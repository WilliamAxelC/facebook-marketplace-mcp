import assert from 'node:assert';
import http from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { FacebookClient } from '../src/client/facebook-client.js';
import { createExpressApp } from '../src/server.js';

interface TestResult {
  suite: string;
  testName: string;
  status: 'PASS' | 'FAIL';
  durationMs: number;
  details?: any;
  error?: string;
}

const testResults: TestResult[] = [];

async function recordTest(suite: string, testName: string, fn: () => Promise<any>) {
  const start = Date.now();
  try {
    const details = await fn();
    const durationMs = Date.now() - start;
    testResults.push({ suite, testName, status: 'PASS', durationMs, details });
    console.log(`  ✅ [PASS] ${testName} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    testResults.push({ suite, testName, status: 'FAIL', durationMs, error: err.message });
    console.error(`  ❌ [FAIL] ${testName} (${durationMs}ms):`, err.message);
    throw err;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('  Facebook Marketplace MCP Server: Verification Suite           ');
  console.log('  Conforming to MCP_HOSTING_SPEC.md Standard                    ');
  console.log('================================================================\n');

  // ========================================================================
  // SECTION 1: MCP Client & StdioClientTransport Protocol Tests (5 Tools)
  // ========================================================================
  console.log('▶ SECTION 1: MCP Client & Stdio Transport (5 Tools)');

  const stdioTransport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js', '--stdio'],
    env: {
      ...process.env,
      MOCK_ON_BLOCKED: 'true',
    },
  });

  const mcpClient = new Client(
    { name: 'qa-verification-client', version: '1.0.0' },
    { capabilities: {} }
  );

  await recordTest('MCP Protocol', 'Connect to MCP Server via StdioClientTransport', async () => {
    await mcpClient.connect(stdioTransport);
    return { connected: true };
  });

  await recordTest('MCP Protocol', 'Verify Tool Discovery (List all 5 tools)', async () => {
    const list = await mcpClient.listTools();
    const toolNames = list.tools.map((t) => t.name);
    assert.strictEqual(list.tools.length, 5, `Expected 5 tools, found ${list.tools.length}`);

    const expectedTools = [
      'search_marketplace',
      'get_listing_details',
      'get_nearby_listings',
      'get_marketplace_categories',
      'parse_listing_url',
    ];

    for (const expected of expectedTools) {
      assert(toolNames.includes(expected), `Missing registered tool: ${expected}`);
    }
    return { totalTools: list.tools.length, tools: toolNames };
  });

  // Tool 1: search_marketplace
  await recordTest('MCP Tools', 'Tool 1: search_marketplace (query: "MacBook")', async () => {
    const res = await mcpClient.callTool({
      name: 'search_marketplace',
      arguments: { query: 'MacBook', location: 'jakarta', limit: 5 },
    });
    assert.strictEqual(res.isError, undefined, 'Tool returned an error');
    assert(Array.isArray(res.content) && res.content.length > 0, 'Missing response content');
    assert.strictEqual(res.content[0].type, 'text');

    const data = JSON.parse(res.content[0].text as string);
    assert(Array.isArray(data.items), 'data.items should be an array');
    assert(data.items.length > 0, 'data.items should not be empty');
    assert(data.items[0].id !== undefined, 'Item missing id');
    assert(data.items[0].price.formatted !== undefined, 'Item missing formatted price');
    return { itemsCount: data.items.length, sampleItem: data.items[0].title };
  });

  // Tool 2: get_listing_details (by ID)
  await recordTest('MCP Tools', 'Tool 2: get_listing_details (listingId: "729481902830192")', async () => {
    const res = await mcpClient.callTool({
      name: 'get_listing_details',
      arguments: { listingIdOrUrl: '729481902830192' },
    });
    assert.strictEqual(res.isError, undefined, 'Tool returned an error');
    assert(Array.isArray(res.content) && res.content.length > 0);

    const data = JSON.parse(res.content[0].text as string);
    assert.strictEqual(data.id, '729481902830192', 'Item ID mismatch');
    assert(typeof data.title === 'string' && data.title.length > 0, 'Missing product title');
    assert(typeof data.price.formatted === 'string', 'Missing formatted price');
    assert(data.seller && data.seller.name, 'Missing seller info');
    return { title: data.title, price: data.price.formatted, seller: data.seller.name };
  });

  // Tool 2b: get_listing_details (by URL)
  await recordTest('MCP Tools', 'Tool 2b: get_listing_details via full Facebook URL', async () => {
    const res = await mcpClient.callTool({
      name: 'get_listing_details',
      arguments: { listingIdOrUrl: 'https://www.facebook.com/marketplace/item/810394829103918/' },
    });
    assert.strictEqual(res.isError, undefined, 'Tool returned an error');
    const data = JSON.parse(res.content[0].text as string);
    assert.strictEqual(data.id, '810394829103918');
    return { id: data.id, title: data.title };
  });

  // Tool 3: get_nearby_listings
  await recordTest('MCP Tools', 'Tool 3: get_nearby_listings (location: "jakarta")', async () => {
    const res = await mcpClient.callTool({
      name: 'get_nearby_listings',
      arguments: { location: 'jakarta', limit: 3 },
    });
    assert.strictEqual(res.isError, undefined, 'Tool returned an error');
    const data = JSON.parse(res.content[0].text as string);
    assert(Array.isArray(data.items));
    assert(data.items.length > 0);
    return { count: data.items.length, location: data.location };
  });

  // Tool 4: get_marketplace_categories
  await recordTest('MCP Tools', 'Tool 4: get_marketplace_categories (all & filtered)', async () => {
    const resAll = await mcpClient.callTool({
      name: 'get_marketplace_categories',
      arguments: {},
    });
    const categories = JSON.parse(resAll.content[0].text as string);
    assert(Array.isArray(categories) && categories.length > 0);

    const resFiltered = await mcpClient.callTool({
      name: 'get_marketplace_categories',
      arguments: { filter: 'vehicle' },
    });
    const filtered = JSON.parse(resFiltered.content[0].text as string);
    assert(Array.isArray(filtered) && filtered.length > 0);
    return { totalCategories: categories.length, filteredMatches: filtered.map((c: any) => c.name) };
  });

  // Tool 5: parse_listing_url
  await recordTest('MCP Tools', 'Tool 5: parse_listing_url (valid desktop, mobile, invalid)', async () => {
    const desktop = await mcpClient.callTool({
      name: 'parse_listing_url',
      arguments: { url: 'https://www.facebook.com/marketplace/item/729481902830192/' },
    });
    const parsedDesktop = JSON.parse(desktop.content[0].text as string);
    assert.strictEqual(parsedDesktop.isValid, true);
    assert.strictEqual(parsedDesktop.listingId, '729481902830192');

    const invalid = await mcpClient.callTool({
      name: 'parse_listing_url',
      arguments: { url: 'https://google.com/search' },
    });
    const parsedInvalid = JSON.parse(invalid.content[0].text as string);
    assert.strictEqual(parsedInvalid.isValid, false);
    return { desktopId: parsedDesktop.listingId, invalidHandled: true };
  });

  await recordTest('MCP Protocol', 'Clean disconnect of MCP Client', async () => {
    await mcpClient.close();
    return { closed: true };
  });

  // ========================================================================
  // SECTION 2: HTTP REST API with API_KEY and Playground Verification
  // ========================================================================
  console.log('\n▶ SECTION 2: HTTP REST API & Authentication / Playground');

  // Configure environment for the test per MCP_HOSTING_SPEC
  process.env.API_KEY = 'secret123';
  process.env.PLAYGROUND_ENABLED = 'true';
  process.env.PLAYGROUND_RATE_LIMIT = '5';
  process.env.MOCK_ON_BLOCKED = 'true';

  const fbClient = new FacebookClient({ mockOnBlocked: true });
  const app = createExpressApp(fbClient);
  const httpServer = http.createServer(app);

  let baseUrl = '';

  await recordTest('REST API Setup', 'Start Express server with API_KEY="secret123" & PLAYGROUND_ENABLED="true"', async () => {
    await new Promise<void>((resolve) => {
      httpServer.listen(0, '127.0.0.1', () => resolve());
    });
    const addr = httpServer.address() as { port: number };
    baseUrl = `http://127.0.0.1:${addr.port}`;
    return { testServerUrl: baseUrl, apiKey: 'secret123', playgroundEnabled: true };
  });

  // Test 2.1: GET /health returns exact spec fields
  await recordTest('REST API Auth', 'GET /health returns apiKeyRequired: true and playgroundEnabled: true', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.service, 'facebook-marketplace-mcp');
    assert.strictEqual(typeof body.uptime, 'number');
    assert.strictEqual(body.apiKeyRequired, true, 'apiKeyRequired must be true');
    assert.strictEqual(body.playgroundEnabled, true, 'playgroundEnabled must be true');
    assert(body.cache !== undefined, 'Cache stats must be present');
    return { status: body.status, apiKeyRequired: body.apiKeyRequired, playgroundEnabled: body.playgroundEnabled, uptime: body.uptime };
  });

  // Test 2.2: Unauthenticated request to /api/marketplace/search is allowed and capped to <= 5 items
  await recordTest('REST API Playground', 'Unauthenticated GET /api/marketplace/search?limit=10 is allowed and capped under playground rules', async () => {
    const res = await fetch(`${baseUrl}/api/marketplace/search?query=MacBook&limit=10`);
    assert.strictEqual(res.status, 200, 'Unauthenticated request should succeed under playground mode');
    assert.strictEqual(res.headers.get('X-Playground-Demo'), 'true');
    const body = await res.json();
    assert(Array.isArray(body.items), 'Response items should be array');
    // Playground caps limit to Math.min(10, 5) = 5 items
    assert(body.items.length <= 5, `Expected capped count <= 5, got ${body.items.length}`);
    return { returnedCount: body.items.length, playgroundCapApplied: true, sample: body.items[0]?.title };
  });

  // Test 2.3: Authenticated request with header 'x-api-key: secret123' has full access
  await recordTest('REST API Auth', "Authenticated GET /api/marketplace/search with 'x-api-key: secret123' has full access", async () => {
    const res = await fetch(`${baseUrl}/api/marketplace/search?query=MacBook&limit=10`, {
      headers: {
        'x-api-key': 'secret123',
      },
    });
    assert.strictEqual(res.status, 200, 'Authenticated request should return 200');
    assert.strictEqual(res.headers.get('X-Playground-Demo'), null, 'Playground demo header should not be set for authenticated requests');
    const body = await res.json();
    assert(Array.isArray(body.items));
    return { returnedCount: body.items.length, authenticated: true };
  });

  // Test 2.3b: Authenticated request with Authorization: Bearer secret123
  await recordTest('REST API Auth', "Authenticated GET /api/marketplace/search with 'Authorization: Bearer secret123'", async () => {
    const res = await fetch(`${baseUrl}/api/marketplace/search?query=MacBook&limit=2`, {
      headers: {
        Authorization: 'Bearer secret123',
      },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert(Array.isArray(body.items));
    return { itemsCount: body.items.length, status: res.status };
  });

  // Test 2.4: Request with custom 'x-facebook-cookie' header
  await recordTest('REST API Cookies', "Request with custom 'x-facebook-cookie' header", async () => {
    const customCookie = 'c_user=100012345678; xs=test_token_abc_123;';
    const res = await fetch(`${baseUrl}/api/marketplace/search?query=MacBook&limit=2`, {
      headers: {
        'x-api-key': 'secret123',
        'x-facebook-cookie': customCookie,
      },
    });
    assert.strictEqual(res.status, 200, 'Request with custom cookie should succeed');
    const body = await res.json();
    assert(Array.isArray(body.items));
    return { itemsCount: body.items.length, cookieAccepted: true };
  });

  // Test 2.5: Invalid API Key returns 401 Unauthorized
  await recordTest('REST API Security', "Invalid API key ('x-api-key: wrong_secret') returns 401 Unauthorized", async () => {
    const res = await fetch(`${baseUrl}/api/marketplace/search?query=MacBook`, {
      headers: {
        'x-api-key': 'wrong_secret',
      },
    });
    assert.strictEqual(res.status, 401, 'Should reject invalid API key with 401');
    const body = await res.json();
    assert(body.error && body.error.includes('Unauthorized'));
    return { status: res.status, error: body.error };
  });

  // Test 2.6: Playground rate limit triggers 429 when exceeded
  await recordTest('REST API Rate Limiting', 'Playground rate limit triggers 429 Too Many Requests when limit exceeded', async () => {
    // Current PLAYGROUND_RATE_LIMIT = 5.
    let rateLimited = false;
    let retryAfterHeader: string | null = null;
    let errorBody: any = null;

    for (let i = 0; i < 10; i++) {
      const res = await fetch(`${baseUrl}/api/marketplace/categories`);
      if (res.status === 429) {
        rateLimited = true;
        retryAfterHeader = res.headers.get('Retry-After');
        errorBody = await res.json();
        break;
      }
    }

    assert(rateLimited, 'Expected 429 rate limit response after exceeding limit');
    assert(retryAfterHeader !== null, 'Expected Retry-After header');
    assert(errorBody?.error?.includes('Playground rate limit exceeded'), 'Expected rate limit error message');
    return { rateLimited: true, retryAfterSeconds: retryAfterHeader, message: errorBody.error };
  });

  // Clean shutdown
  await recordTest('REST API Cleanup', 'Shutdown test HTTP server', async () => {
    await new Promise<void>((resolve, reject) => {
      httpServer.close((err) => (err ? reject(err) : resolve()));
    });
    return { closed: true };
  });

  // ========================================================================
  // SUMMARY REPORT
  // ========================================================================
  console.log('\n================================================================');
  console.log('                   VERIFICATION REPORT SUMMARY                  ');
  console.log('================================================================\n');

  const total = testResults.length;
  const passed = testResults.filter((t) => t.status === 'PASS').length;
  const failed = testResults.filter((t) => t.status === 'FAIL').length;

  console.table(
    testResults.map((t) => ({
      Suite: t.suite,
      Feature: t.testName,
      Status: t.status === 'PASS' ? '✅ PASS' : '❌ FAIL',
      'Duration (ms)': t.durationMs,
    }))
  );

  console.log(`\nTotal: ${total} | Passed: ${passed} | Failed: ${failed}`);
  if (failed === 0) {
    console.log('\n🎉 ALL FEATURES VERIFIED AND WORKING 100% PERFECTLY AGAINST MCP_HOSTING_SPEC!\n');
  } else {
    console.error(`\n❌ ${failed} FEATURE(S) FAILED!\n`);
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('\n💥 Unhandled error during verification run:', err);
  process.exit(1);
});
