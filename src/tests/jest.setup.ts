// src/setupTests.js
import server from './mocks/server';
// Establish API mocking before all tests.
import { logoutGlobally } from '@/webapp/redux/globalFunctions';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// beforeEach(() => {
//   logoutGlobally();
// });
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  logoutGlobally();
});

// Clean up after the tests are finished.
afterAll(() => server.close());
