/**
 * @jest-environment jsdom
 */
import 'whatwg-fetch';

// import reducer from 'webapp/Features/UpdateBanner/redux/bannerSlice';
import store from 'webapp/redux/store';
// import mockData from '@/tests/mocks/mockData';
import { rest } from 'msw';
import fetchVersion from './fetchVersion';
import { version } from '#/package.json';

import server from '@/tests/mocks/server';
// import errorHandlers from '@/tests/handlers/errorHandlers';
// import { logoutGlobally } from '@/webapp/redux/globalFunctions';

const mockGithubVersion = (mockVersion: string) => rest
  .get('https://api.github.com/repos/3cpm/desktop*', (req, res, ctx) => res(
    ctx.status(200),
    ctx.json([{
      tag_name: `v${mockVersion}`,
      prerelease: false,
    }]),
  ));

describe('Fetch Version handler', () => {
  it('should have the default state in the banner', () => {
    expect(store.getState().banner)
      .toEqual({ message: '', show: false, type: '' });
  });

  it('fetches new versions and updates the store', async () => {
    const increasedVersion = (Number(version[0]) + 1) + version.substring(1);
    server.use(mockGithubVersion(increasedVersion));
    await fetchVersion();
    expect(store.getState().banner)
      .toEqual({ message: `v${increasedVersion}`, show: true, type: 'updateVersion' });
  });
  it('does nothing if on current version', async () => {
    server.use(mockGithubVersion(version));
    await fetchVersion();
    expect(store.getState().banner)
      .toEqual({ message: '', show: false, type: '' });
  });
});
