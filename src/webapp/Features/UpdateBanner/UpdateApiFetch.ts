import { logToConsole } from 'common/utils/logging';
import type { GithubReleaseType } from '@/webapp/Features/UpdateBanner/GithubRelease';

async function fetchVersions() {
  try {
    const response = await fetch(
      'https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/releases?per_page=5',
      {
        method: 'GET',
      },
    );

    return await response.json() as GithubReleaseType[] | [];
  } catch (e) {
    logToConsole('error', e);
    return [];
  }
}

export default fetchVersions;
