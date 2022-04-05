/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
// src/mocks/handlers.js

// src/mocks/handlers.js
import { rest } from 'msw';

import mocks from '@/tests/mocks/mockData';

export default [
  rest.get('https://api.3commas.io/public/api/ver1/deals/:dealID/show', (req, res, ctx) => {
    const { dealID } = req.params;
    const filterData = mocks.threeCommas.DealsArray.filter((d) => String(d.id) === dealID);
    if (filterData.length === 0) {
      return res(
        ctx.status(404),
        ctx.json({
          error: 'not_found',
          error_description: 'Not Found',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json(filterData[0]),
    );
  }),
  rest.get('https://api.3commas.io/public/api/ver1/deals', (req, res, ctx) => {
    const accountId = req.url.searchParams.get('account_id');

    const filterData = [...mocks.threeCommas.DealsArray];
    if (accountId) filterData.filter((d) => String(d.account_id) === accountId);

    return res(
      ctx.status(200),
      ctx.json(filterData),
    );
  }),

  // Catching all unhandled 3Commas requests
  rest.get('https://api.3commas.io/*', (req, res, ctx) => res(
    ctx.status(404),
    ctx.text('unmocked api endpoint'),
  )),

  // desktop version requests
  rest.get('https://api.github.com/repos/3cpm/desktop*', (req, res, ctx) => res(
    ctx.status(200),
    ctx.json(mocks.GitHubReleases),
  )),

  rest.get('https://api.github.com/repos/3cpm/desktop*', (req, res, ctx) => res(
    ctx.status(200),
    ctx.json(mocks.GitHubReleases),
  )),

];
