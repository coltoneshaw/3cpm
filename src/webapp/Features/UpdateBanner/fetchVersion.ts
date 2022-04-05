import fetchHandler from 'webapp/utils/fetchHandler';
import { updateBannerData } from 'webapp/Features/UpdateBanner/redux/bannerSlice';
import type { GithubReleaseType } from 'webapp/Features/UpdateBanner/GithubRelease';
import store from 'webapp/redux/store';

import { version } from '#/package.json';

async function fetchVersions() {
  const versionData = await fetchHandler<GithubReleaseType[]>(
    'https://api.github.com/repos/3cpm/desktop/releases?per_page=5',
  );
  if (versionData instanceof Error || !versionData || versionData.length === 0) return;
  const currentVersion = versionData.filter((release) => !release.prerelease)[0];
  if (`v${version}` !== currentVersion.tag_name) {
    store.dispatch(updateBannerData({
      show: true,
      message: currentVersion.tag_name,
      type: 'updateVersion',
    }));
  }
}

export default fetchVersions;
