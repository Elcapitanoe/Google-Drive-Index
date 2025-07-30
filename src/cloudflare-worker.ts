/**
 * Cloudflare Worker script to handle requests for PAMBI Drive
 * This is a modernized TypeScript version of the worker
 */

import { RequestHandler } from './handlers/request-handler';

// Initialize the request handler
const requestHandler = RequestHandler.getInstance();

// Event listener for fetch events
addEventListener('fetch', (event: any) => {
  event.respondWith(requestHandler.handleRequest(event.request));
});
