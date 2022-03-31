import fetch from 'electron-fetch';

import { logToConsole } from 'common/utils/logging';
import type { GithubReleaseType } from 'common/repositories/Types/GithubRelease';

const fetchVersions = async () => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/releases?per_page=5',
      {
        method: 'GET',
        timeout: 30000,
      },
    );

    return await response.json<GithubReleaseType[] | []>();
  } catch (e) {
    logToConsole('error', e);
    return false;
  }
};

export default fetchVersions;
