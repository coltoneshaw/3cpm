/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
// src/mocks/handlers.js

// src/mocks/handlers.js
import { rest } from 'msw';

export default [
  // Mocking a network error to handle when the client doesn't have connection.
  rest.get('*', (req, res) => res.networkError('Network request failed')),
  rest.post('*', (req, res) => res.networkError('Network request failed')),
  rest.patch('*', (req, res) => res.networkError('Network request failed')),
  rest.put('*', (req, res) => res.networkError('Network request failed')),
  rest.delete('*', (req, res) => res.networkError('Network request failed')),
];
