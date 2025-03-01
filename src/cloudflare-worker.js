/**
 * Cloudflare Worker script to handle requests for PAMBI Drive
 * This is a modular version of the worker.js file
 */

import { handleRequest } from './js/handler.js';

// Event listener for fetch events
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});