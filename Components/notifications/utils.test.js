import http from 'node:http';

import { UNITED_STATES_ENGLISH } from '@ecosia/common-js/universal/market-codes.js';

import { getNotifications, getNotificationsUrl } from './utils.js';

const testPort = 58587;
const apiUrl = `http://localhost:${testPort}`;
let mockContentType = 'application/json';

const mockFetch = () => vi.fn(() => (
  Promise.resolve({
    ok: true,
    headers: {
      get: vi.fn((name) => (name === 'content-type' ? mockContentType : null)),
    },
    json: () => ({ test: true }),
  })
));

describe('Notifications getter function', () => {
  let server;
  const port = testPort;

  beforeAll(() => {
    server = http.createServer((req, res) => {
      res.setHeader('access-control-allow-origin', '*');
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ test: true }));
    });
    server.listen(port);
    window.fetch = mockFetch();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    mockContentType = 'application/json';
  });

  it('loads a response correctly', async () => {
    const resp = await getNotifications({ apiUrl });
    expect(resp).toBeTruthy();
    expect(resp.test).toEqual(true);
  });

  it('returns empty array if response is not json', async () => {
    // can happen in case of 404 HTML page being returned
    mockContentType = 'text/html';
    const resp = await getNotifications({ apiUrl });
    expect(resp).toBeTruthy();
    expect(resp).toEqual([]);
  });

  it('includes required parameters', () => {
    const url = getNotificationsUrl({ locale: 'en', apiUrl });
    expect(url.endsWith('language=en&limit=3')).toBe(true);
  });

  it('includes optional parameters', () => {
    const url = getNotificationsUrl({
      locale: 'en',
      market: UNITED_STATES_ENGLISH,
      browser: 'chrome',
      apiUrl,
    });
    expect(url.endsWith('&market=en-us&browser=chrome')).toBe(true);
  });
});
