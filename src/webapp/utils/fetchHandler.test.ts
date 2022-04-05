/**
 * @jest-environment jsdom
 */
import 'whatwg-fetch';

import type { GithubReleaseType } from 'webapp/Features/UpdateBanner/GithubRelease';
import mockData from '@/tests/mocks/mockData';
import fetchHandler from './fetchHandler';

import server from '@/tests/mocks/server';
import errorHandlers from '@/tests/handlers/errorHandlers';

describe('Webapp fetch handler', () => {
  it('properly fetches data', async () => {
    const test = await fetchHandler<GithubReleaseType[] | []>(
      'https://api.github.com/repos/3cpm/desktop/releases?per_page=5',
    );
    expect(test).toStrictEqual(mockData.GitHubReleases);
  });

  it('propertly throws an error on invalid url', async () => {
    server.use(...errorHandlers);
    jest.spyOn(console, 'error').mockImplementation();
    const errorResponse = 'Error fetching for https://badurl.com TypeError: Network request failed';

    await expect(fetchHandler('https://badurl.com'))
      .rejects
      .toThrowError(errorResponse);
    expect(console.error).toHaveBeenCalledWith(errorResponse);
  });
});
