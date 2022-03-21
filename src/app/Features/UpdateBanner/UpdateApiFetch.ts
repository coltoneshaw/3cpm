import fetch from 'electron-fetch';

import type { GithubReleaseType } from '@/app/Repositories/Types/GithubRelease';

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
    console.log(e);
    return false;
  }
};

export default fetchVersions;
