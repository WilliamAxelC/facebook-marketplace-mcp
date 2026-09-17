import assert from 'node:assert';
import { spawn } from 'node:child_process';
import http from 'node:http';
import readline from 'node:readline';
import { FacebookClient } from '../src/client/facebook-client.js';
import { createExpressApp } from '../src/server.js';

interface TestResult {
  section: string;
  name: string;
  status: 'PASSED' | 'FAILED';
  details?: string;
}

const results: TestResult[] = [];

function recordTest(section: string, name: string, passed: boolean, details?: string) {
  results.push({
    section,
    name,
    status: passed ? 'PASSED' : 'FAILED',
    details,
  });
  const icon = passed ? '✅' : '❌';
  console.log(`  ${icon} [${section}] ${name}${details ? ` - ${details}` : ''}`);
  if (!passed) {
    throw new Error(`Test failed: [${section}] ${name}`);
  }
}

// =========================================================================
// 1. Stdio MCP Protocol Verification
// =========================================================================
async function verifyStdioProtocol() {
  console.log('\n=============================================================');
  console.log('TEST SUITE 1: Stdio MCP Protocol Verification');
  console.log('=============================================================');

  const proc = spawn('node', ['dist/index.js', '--stdio'], {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const pendingRequests = new Map<number | string, (res: any) => void>();
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];

  const rlOut = readline.createInterface({ input: proc.stdout });
  rlOut.on('line', (line) => {
    stdoutLines.push(line);
    try {
      const msg = JSON.parse(line);
      if (msg.id !== undefined && pendingRequests.has(msg.id)) {
        const resolve = pendingRequests.get(msg.id)!;
        pendingRequests.delete(msg.id);
        resolve(msg);
      }
    } catch {}
  });

  const rlErr = readline.createInterface({ input: proc.stderr });
  rlErr.on('line', (line) => {
    stderrLines.push(line);
  });

  function sendRpc(msg: any): Promise<any> {
    return new Promise((resolve) => {
      if (msg.id !== undefined) {
        pendingRequests.set(msg.id, resolve);
      }
      proc.stdin.write(JSON.stringify(msg) + '\n');
    });
  }

  function sendNotification(msg: any): void {
    proc.stdin.write(JSON.stringify(msg) + '\n');
  }

  try {
    // 1a. initialize
    const initRes = await sendRpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'stdio-verifier', version: '1.0.0' },
      },
    });
    recordTest('Stdio', 'MCP initialize handshake', initRes.result?.serverInfo?.name === 'facebook-marketplace-mcp', `Server: ${initRes.result?.serverInfo?.name} v${initRes.result?.serverInfo?.version}`);

    // 1b. notifications/initialized
    sendNotification({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    });
    await new Promise((r) => setTimeout(r, 100));
    recordTest('Stdio', 'MCP notifications/initialized notification sent', true);

    // 1c. tools/list
    const toolsRes = await sendRpc({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    });
    const tools = toolsRes.result?.tools || [];
    const expectedTools = [
      'search_marketplace',
      'get_listing_details',
      'get_nearby_listings',
      'get_marketplace_categories',
      'parse_listing_url',
    ];
    const hasAllTools = expectedTools.every((t) => tools.some((tool: any) => tool.name === t));
    recordTest('Stdio', 'MCP tools/list returns all 5 tools', hasAllTools && tools.length === 5, `Found: ${tools.map((t: any) => t.name).join(', ')}`);

    // 1d. tools/call search_marketplace with query, location, price, category, condition, sortBy
    const searchCallRes = await sendRpc({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'search_marketplace',
        arguments: {
          query: 'MacBook',
          location: 'jakarta',
          minPrice: 10000000,
          maxPrice: 35000000,
          category: 'electronics',
          condition: 'used_like_new',
          sortBy: 'price_asc',
          limit: 5,
        },
      },
    });
    const searchParsed = JSON.parse(searchCallRes.result.content[0].text);
    recordTest('Stdio', 'tools/call search_marketplace (all filters)', searchParsed.items && searchParsed.items.length > 0, `Returned ${searchParsed.items?.length} items`);

    // 1e. tools/call get_listing_details (ID and URL)
    const detailsIdRes = await sendRpc({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'get_listing_details',
        arguments: { listingIdOrUrl: '729481902830192' },
      },
    });
    const detailsIdParsed = JSON.parse(detailsIdRes.result.content[0].text);
    recordTest('Stdio', 'tools/call get_listing_details (ID)', detailsIdParsed.id === '729481902830192', `Item: ${detailsIdParsed.title}`);

    const detailsUrlRes = await sendRpc({
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'get_listing_details',
        arguments: { listingIdOrUrl: 'https://www.facebook.com/marketplace/item/729481902830192/' },
      },
    });
    const detailsUrlParsed = JSON.parse(detailsUrlRes.result.content[0].text);
    recordTest('Stdio', 'tools/call get_listing_details (full URL)', detailsUrlParsed.id === '729481902830192', `Item: ${detailsUrlParsed.title}`);

    // 1f. tools/call get_nearby_listings
    const nearbyRes = await sendRpc({
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'get_nearby_listings',
        arguments: { location: 'jakarta', limit: 3 },
      },
    });
    const nearbyParsed = JSON.parse(nearbyRes.result.content[0].text);
    recordTest('Stdio', 'tools/call get_nearby_listings', Array.isArray(nearbyParsed.items), `Found ${nearbyParsed.items?.length} items in ${nearbyParsed.location}`);

    // 1g. tools/call get_marketplace_categories (with and without filter)
    const catNoFilter = await sendRpc({
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: {
        name: 'get_marketplace_categories',
        arguments: {},
      },
    });
    const catNoFilterList = JSON.parse(catNoFilter.result.content[0].text);
    recordTest('Stdio', 'tools/call get_marketplace_categories (no filter)', catNoFilterList.length === 6, `Total top categories: ${catNoFilterList.length}`);

    const catFilter = await sendRpc({
      jsonrpc: '2.0',
      id: 8,
      method: 'tools/call',
      params: {
        name: 'get_marketplace_categories',
        arguments: { filter: 'vehicle' },
      },
    });
    const catFilterList = JSON.parse(catFilter.result.content[0].text);
    recordTest('Stdio', 'tools/call get_marketplace_categories (filtered)', catFilterList.length === 1 && catFilterList[0].id === 'vehicles', `Filtered matches: ${catFilterList.map((c: any) => c.name).join(', ')}`);

    // 1h. tools/call parse_listing_url (desktop, mobile, invalid)
    const parseDesk = await sendRpc({
      jsonrpc: '2.0',
      id: 9,
      method: 'tools/call',
      params: {
        name: 'parse_listing_url',
        arguments: { url: 'https://www.facebook.com/marketplace/item/729481902830192/' },
      },
    });
    const parseDeskJson = JSON.parse(parseDesk.result.content[0].text);
    recordTest('Stdio', 'tools/call parse_listing_url (desktop)', parseDeskJson.isValid === true && parseDeskJson.listingId === '729481902830192', `ID: ${parseDeskJson.listingId}`);

    const parseMobile = await sendRpc({
      jsonrpc: '2.0',
      id: 10,
      method: 'tools/call',
      params: {
        name: 'parse_listing_url',
        arguments: { url: 'https://m.facebook.com/marketplace/item/810394829103918?ref=search' },
      },
    });
    const parseMobileJson = JSON.parse(parseMobile.result.content[0].text);
    recordTest('Stdio', 'tools/call parse_listing_url (mobile m.facebook.com)', parseMobileJson.isValid === true && parseMobileJson.listingId === '810394829103918', `ID: ${parseMobileJson.listingId}`);

    const parseInvalid = await sendRpc({
      jsonrpc: '2.0',
      id: 11,
      method: 'tools/call',
      params: {
        name: 'parse_listing_url',
        arguments: { url: 'https://google.com/search?q=fb' },
      },
    });
    const parseInvalidJson = JSON.parse(parseInvalid.result.content[0].text);
    recordTest('Stdio', 'tools/call parse_listing_url (invalid URL)', parseInvalidJson.isValid === false, `isValid=${parseInvalidJson.isValid}`);

    // Stdout frame validation
    let allStdoutValid = true;
    for (const line of stdoutLines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.jsonrpc !== '2.0') allStdoutValid = false;
      } catch {
        allStdoutValid = false;
      }
    }
    recordTest('Stdio', 'Stdout purity (only JSON-RPC frames, zero log corruption)', allStdoutValid && stdoutLines.length > 0, `${stdoutLines.length} valid frames, stderr received ${stderrLines.length} log lines`);
  } finally {
    proc.kill();
  }
}

// =========================================================================
// 2. HTTP Server & SSE Transport Verification
// =========================================================================
async function verifyHttpAndSSE() {
  console.log('\n=============================================================');
  console.log('TEST SUITE 2: HTTP Server & SSE Transport Verification');
  console.log('=============================================================');

  const client = new FacebookClient({ mockOnBlocked: true });
  const app = createExpressApp(client);
  const server = http.createServer(app);

  const port = 3189;
  await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', () => resolve()));
  const baseUrl = `http://127.0.0.1:${port}`;

  let sseReq: http.ClientRequest | null = null;
  try {
    // 2a. Connect to GET /sse
    let endpointUrl: string | null = null;
    const sseMessages: any[] = [];

    const endpointPromise = new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout waiting for SSE endpoint event')), 5000);

      sseReq = http.request({
        hostname: '127.0.0.1',
        port,
        path: '/sse',
        method: 'GET',
        headers: { Accept: 'text/event-stream' },
      });

      sseReq.on('response', (res) => {
        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk.toString();
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() || '';

          for (const block of blocks) {
            if (block.includes('event: endpoint')) {
              const match = block.match(/data: (.+)/);
              if (match) {
                endpointUrl = match[1].trim();
                clearTimeout(timer);
                resolve(endpointUrl);
              }
            } else if (block.includes('data: ')) {
              const match = block.match(/data: (.+)/);
              if (match) {
                try {
                  sseMessages.push(JSON.parse(match[1]));
                } catch {}
              }
            }
          }
        });
      });
      sseReq.on('error', reject);
      sseReq.end();
    });

    const endpoint = await endpointPromise;
    recordTest('SSE', 'SSE endpoint event received with sessionId', endpoint.startsWith('/messages?sessionId='), endpoint);

    // 2b. Perform initialize over SSE message endpoint
    const initRes = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'sse-tester', version: '1.0.0' },
        },
      }),
    });
    recordTest('SSE', 'POST initialize to SSE session endpoint', initRes.status === 202, `HTTP status: ${initRes.status}`);

    // Wait for initialize response
    await new Promise((r) => setTimeout(r, 200));

    // Send initialized notification
    await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
      }),
    });

    // 2c. Send tools/list request via POST
    const toolsRes = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
      }),
    });
    recordTest('SSE', 'POST tools/list to SSE session endpoint', toolsRes.status === 202, `HTTP status: ${toolsRes.status}`);

    // Wait for response in SSE stream
    await new Promise((r) => setTimeout(r, 600));

    const toolsResponse = sseMessages.find((m) => m.id === 2);
    const toolsFound = toolsResponse?.result?.tools;
    recordTest(
      'SSE',
      'JSON-RPC response received through SSE connection',
      Array.isArray(toolsFound) && toolsFound.length === 5,
      `Tools received over SSE: ${toolsFound?.map((t: any) => t.name).join(', ')}`
    );
  } finally {
    if (sseReq) (sseReq as http.ClientRequest).destroy();
    server.close();
  }
}

// =========================================================================
// 3. Streamable HTTP POST (/mcp) Verification
// =========================================================================
async function verifyStreamableHttp() {
  console.log('\n=============================================================');
  console.log('TEST SUITE 3: Streamable HTTP POST (/mcp) Verification');
  console.log('=============================================================');

  const client = new FacebookClient({ mockOnBlocked: true });
  const app = createExpressApp(client);
  const server = http.createServer(app);

  const port = 3190;
  await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', () => resolve()));
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 3a. initialize
    const initRes = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize' }),
    }).then((r) => r.json());
    recordTest('Streamable HTTP', 'POST /mcp initialize', initRes.result?.serverInfo?.name === 'facebook-marketplace-mcp', `Server: ${initRes.result?.serverInfo?.name}`);

    // 3b. ping
    const pingRes = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'ping' }),
    }).then((r) => r.json());
    recordTest('Streamable HTTP', 'POST /mcp ping', pingRes.jsonrpc === '2.0' && pingRes.id === 2, `Result: ${JSON.stringify(pingRes.result)}`);

    // 3c. tools/list
    const toolsRes = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'tools/list' }),
    }).then((r) => r.json());
    const toolCount = toolsRes.result?.tools?.length;
    recordTest('Streamable HTTP', 'POST /mcp tools/list', toolCount === 5, `${toolCount} tools listed`);

    // 3d. tools/call
    const callRes = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'get_marketplace_categories',
          arguments: { filter: 'electronics' },
        },
      }),
    }).then((r) => r.json());
    const callContent = JSON.parse(callRes.result?.content?.[0]?.text || '[]');
    recordTest('Streamable HTTP', 'POST /mcp tools/call', callContent.length === 1 && callContent[0].id === 'electronics', `Category: ${callContent[0]?.name}`);

    // 3e. Malformed payload (-32600 Invalid Request)
    const malformed1 = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '1.0', id: 5, method: 'ping' }),
    });
    const malformed1Json = await malformed1.json();
    recordTest(
      'Streamable HTTP',
      'Malformed payload (invalid jsonrpc version) yields -32600',
      malformed1.status === 400 && malformed1Json.error?.code === -32600,
      `Error code: ${malformed1Json.error?.code}, Message: ${malformed1Json.error?.message}`
    );

    const malformed2 = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 6 }), // missing method
    });
    const malformed2Json = await malformed2.json();
    recordTest(
      'Streamable HTTP',
      'Malformed payload (missing method) yields -32600',
      malformed2.status === 400 && malformed2Json.error?.code === -32600,
      `Error code: ${malformed2Json.error?.code}`
    );

    // 3f. Unknown method / tool (-32601 Method not found)
    const unknownMethod = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'non_existent_method' }),
    });
    const unknownMethodJson = await unknownMethod.json();
    recordTest(
      'Streamable HTTP',
      'Unknown method yields -32601 Method not found',
      unknownMethod.status === 404 && unknownMethodJson.error?.code === -32601,
      `Error code: ${unknownMethodJson.error?.code}, Message: ${unknownMethodJson.error?.message}`
    );

    const unknownTool = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 8,
        method: 'tools/call',
        params: { name: 'non_existent_tool', arguments: {} },
      }),
    });
    const unknownToolJson = await unknownTool.json();
    recordTest(
      'Streamable HTTP',
      'Unknown tool name yields -32601 Tool not found',
      unknownTool.status === 404 && unknownToolJson.error?.code === -32601,
      `Error code: ${unknownToolJson.error?.code}, Message: ${unknownToolJson.error?.message}`
    );
  } finally {
    server.close();
  }
}

// =========================================================================
// 4. REST API Verification
// =========================================================================
async function verifyRestApi() {
  console.log('\n=============================================================');
  console.log('TEST SUITE 4: REST API Verification');
  console.log('=============================================================');

  const client = new FacebookClient({ mockOnBlocked: true });
  const app = createExpressApp(client);
  const server = http.createServer(app);

  const port = 3191;
  await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', () => resolve()));
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 4a. GET /health
    const health = await fetch(`${baseUrl}/health`).then((r) => r.json());
    recordTest('REST API', 'GET /health', health.status === 'ok' && health.service === 'facebook-marketplace-mcp', `Status: ${health.status}, Service: ${health.service}`);

    // 4b. GET / (discovery document)
    const discovery = await fetch(`${baseUrl}/`).then((r) => r.json());
    recordTest('REST API', 'GET / (discovery document)', discovery.service && Array.isArray(discovery.tools) && discovery.tools.length === 5, `Service: ${discovery.service}, Tools: ${discovery.tools?.length}`);

    // 4c. GET /api/marketplace/search with parameters
    const search = await fetch(`${baseUrl}/api/marketplace/search?query=Honda&location=jakarta&sortBy=price_asc&limit=2`).then((r) => r.json());
    recordTest('REST API', 'GET /api/marketplace/search with params', Array.isArray(search.items) && search.items.length > 0, `Returned ${search.items?.length} items for "Honda"`);

    // 4d. GET /api/marketplace/items/:id
    const itemById = await fetch(`${baseUrl}/api/marketplace/items/729481902830192`).then((r) => r.json());
    recordTest('REST API', 'GET /api/marketplace/items/:id', itemById.id === '729481902830192', `Title: "${itemById.title}", Price: ${itemById.price?.formatted}`);

    // 4e. GET /api/marketplace/item?url=...
    const itemByUrl = await fetch(`${baseUrl}/api/marketplace/item?url=https://www.facebook.com/marketplace/item/729481902830192/`).then((r) => r.json());
    recordTest('REST API', 'GET /api/marketplace/item?url=...', itemByUrl.id === '729481902830192', `Title: "${itemByUrl.title}"`);

    // 4f. GET /api/marketplace/nearby
    const nearby = await fetch(`${baseUrl}/api/marketplace/nearby?location=jakarta&limit=3`).then((r) => r.json());
    recordTest('REST API', 'GET /api/marketplace/nearby', Array.isArray(nearby.items) && nearby.items.length > 0, `Items in ${nearby.location}: ${nearby.items?.length}`);

    // 4g. GET /api/marketplace/categories
    const categories = await fetch(`${baseUrl}/api/marketplace/categories?filter=apparel`).then((r) => r.json());
    recordTest('REST API', 'GET /api/marketplace/categories', Array.isArray(categories) && categories[0]?.id === 'apparel', `Categories found: ${categories.map((c: any) => c.name).join(', ')}`);

    // 4h. POST /api/marketplace/parse-url
    const parsed = await fetch(`${baseUrl}/api/marketplace/parse-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.facebook.com/marketplace/item/729481902830192/' }),
    }).then((r) => r.json());
    recordTest('REST API', 'POST /api/marketplace/parse-url', parsed.isValid === true && parsed.listingId === '729481902830192', `Parsed ID: ${parsed.listingId}`);
  } finally {
    server.close();
  }
}

// =========================================================================
// 5. Prefix Awareness (BASE_PATH & X-Forwarded-Prefix)
// =========================================================================
async function verifyPrefixAwareness() {
  console.log('\n=============================================================');
  console.log('TEST SUITE 5: Prefix Awareness (BASE_PATH & X-Forwarded-Prefix)');
  console.log('=============================================================');

  // Test Case A: BASE_PATH environment variable set to /facebook
  const origBasePath = process.env.BASE_PATH;
  process.env.BASE_PATH = '/facebook';

  try {
    const client = new FacebookClient({ mockOnBlocked: true });
    const app = createExpressApp(client);
    const server = http.createServer(app);

    const port = 3192;
    await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', () => resolve()));

    let sseReq: http.ClientRequest | null = null;
    try {
      const endpointPromise = new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timeout waiting for SSE endpoint event with BASE_PATH')), 5000);

        sseReq = http.request({
          hostname: '127.0.0.1',
          port,
          path: '/sse',
          method: 'GET',
          headers: { Accept: 'text/event-stream' },
        });

        sseReq.on('response', (res) => {
          let buffer = '';
          res.on('data', (chunk) => {
            buffer += chunk.toString();
            if (buffer.includes('event: endpoint')) {
              const match = buffer.match(/data: (.+)/);
              if (match) {
                clearTimeout(timer);
                resolve(match[1].trim());
              }
            }
          });
        });
        sseReq.on('error', reject);
        sseReq.end();
      });

      const endpoint = await endpointPromise;
      recordTest(
        'Prefix Awareness',
        'BASE_PATH=/facebook yields /facebook/messages?sessionId=...',
        endpoint.startsWith('/facebook/messages?sessionId='),
        `Endpoint: ${endpoint}`
      );
    } finally {
      if (sseReq) (sseReq as http.ClientRequest).destroy();
      server.close();
    }
  } finally {
    process.env.BASE_PATH = origBasePath;
  }

  // Test Case B: X-Forwarded-Prefix header: /facebook (without BASE_PATH)
  const clientB = new FacebookClient({ mockOnBlocked: true });
  const appB = createExpressApp(clientB);
  const serverB = http.createServer(appB);

  const portB = 3193;
  await new Promise<void>((resolve) => serverB.listen(portB, '127.0.0.1', () => resolve()));

  let sseReqB: http.ClientRequest | null = null;
  try {
    const endpointPromiseB = new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout waiting for SSE endpoint with X-Forwarded-Prefix')), 5000);

      sseReqB = http.request({
        hostname: '127.0.0.1',
        port: portB,
        path: '/sse',
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'X-Forwarded-Prefix': '/facebook',
        },
      });

      sseReqB.on('response', (res) => {
        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk.toString();
          if (buffer.includes('event: endpoint')) {
            const match = buffer.match(/data: (.+)/);
            if (match) {
              clearTimeout(timer);
              resolve(match[1].trim());
            }
          }
        });
      });
      sseReqB.on('error', reject);
      sseReqB.end();
    });

    const endpointB = await endpointPromiseB;
    recordTest(
      'Prefix Awareness',
      'X-Forwarded-Prefix: /facebook yields /facebook/messages?sessionId=...',
      endpointB.startsWith('/facebook/messages?sessionId='),
      `Endpoint: ${endpointB}`
    );
  } finally {
    if (sseReqB) (sseReqB as http.ClientRequest).destroy();
    serverB.close();
  }
}

// =========================================================================
// 6. Authentication & Rate Limiting (API_KEY)
// =========================================================================
async function verifyAuthAndRateLimiting() {
  console.log('\n=============================================================');
  console.log('TEST SUITE 6: Authentication & Rate Limiting (API_KEY)');
  console.log('=============================================================');

  const origApiKey = process.env.API_KEY;
  process.env.API_KEY = 'test_secret_key';

  try {
    const client = new FacebookClient({ mockOnBlocked: true });
    const app = createExpressApp(client);
    const server = http.createServer(app);

    const port = 3194;
    await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', () => resolve()));
    const baseUrl = `http://127.0.0.1:${port}`;

    try {
      // 6a. Authenticated via x-api-key header
      const resApiKey = await fetch(`${baseUrl}/api/marketplace/categories`, {
        headers: { 'x-api-key': 'test_secret_key' },
      });
      const isApiKeyAuth = resApiKey.status === 200 && resApiKey.headers.get('x-playground-demo') === null;
      recordTest('Auth & RateLimit', 'Authentication via x-api-key header', isApiKeyAuth, `HTTP ${resApiKey.status}, X-Playground-Demo=${resApiKey.headers.get('x-playground-demo')}`);

      // 6b. Authenticated via Authorization: Bearer header
      const resBearer = await fetch(`${baseUrl}/api/marketplace/categories`, {
        headers: { Authorization: 'Bearer test_secret_key' },
      });
      const isBearerAuth = resBearer.status === 200 && resBearer.headers.get('x-playground-demo') === null;
      recordTest('Auth & RateLimit', 'Authentication via Authorization: Bearer header', isBearerAuth, `HTTP ${resBearer.status}, X-Playground-Demo=${resBearer.headers.get('x-playground-demo')}`);

      // 6c. Authenticated via ?apiKey query parameter
      const resQuery = await fetch(`${baseUrl}/api/marketplace/categories?apiKey=test_secret_key`);
      const isQueryAuth = resQuery.status === 200 && resQuery.headers.get('x-playground-demo') === null;
      recordTest('Auth & RateLimit', 'Authentication via ?apiKey query parameter', isQueryAuth, `HTTP ${resQuery.status}, X-Playground-Demo=${resQuery.headers.get('x-playground-demo')}`);

      // 6d. Unauthenticated playground mode (verify X-Playground-Demo and X-RateLimit-Remaining)
      const resDemo = await fetch(`${baseUrl}/api/marketplace/categories`);
      const isDemo = resDemo.status === 200 && resDemo.headers.get('x-playground-demo') === 'true';
      const remaining = resDemo.headers.get('x-ratelimit-remaining');
      recordTest('Auth & RateLimit', 'Unauthenticated playground mode (X-Playground-Demo: true)', isDemo, `X-Playground-Demo=${resDemo.headers.get('x-playground-demo')}, X-RateLimit-Remaining=${remaining}`);

      // 6e. Rate limiting enforcement after 10 requests per minute
      console.log('  Triggering rate limit by making unauthenticated requests...');
      let rateLimited = false;
      let lastStatus = 200;
      for (let i = 0; i < 12; i++) {
        const res = await fetch(`${baseUrl}/api/marketplace/categories`);
        lastStatus = res.status;
        if (res.status === 429) {
          rateLimited = true;
          const body = await res.json();
          recordTest('Auth & RateLimit', 'Rate limit enforced (HTTP 429 on request > 10)', true, `HTTP 429 after ${i + 1} requests: "${body.error}"`);
          break;
        }
      }
      if (!rateLimited) {
        recordTest('Auth & RateLimit', 'Rate limit enforced (HTTP 429 on request > 10)', false, `Last status was ${lastStatus}`);
      }
    } finally {
      server.close();
    }
  } finally {
    process.env.API_KEY = origApiKey;
  }
}

// =========================================================================
// Main Execution
// =========================================================================
async function runAllVerifications() {
  console.log('🚀 Launching Full Comprehensive Verification for Facebook Marketplace MCP Server');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  await verifyStdioProtocol();
  await verifyHttpAndSSE();
  await verifyStreamableHttp();
  await verifyRestApi();
  await verifyPrefixAwareness();
  await verifyAuthAndRateLimiting();

  console.log('\n=============================================================');
  console.log('VERIFICATION SUMMARY');
  console.log('=============================================================');
  const passed = results.filter((r) => r.status === 'PASSED').length;
  const failed = results.filter((r) => r.status === 'FAILED').length;
  console.log(`Total tests executed: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 ALL VERIFICATION TESTS COMPLETED WITH 100% SUCCESS!\n');
  } else {
    console.error(`\n❌ ${failed} verification tests failed.`);
    process.exit(1);
  }
}

runAllVerifications().catch((err) => {
  console.error('\n💥 Fatal test suite failure:', err);
  process.exit(1);
});
