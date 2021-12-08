import fetch from 'electron-fetch'

import type { Type_GithubRelease } from '@/app/Repositories/Types/GithubRelease'


const fetchVersions = async () => {
  try {
    let response = await fetch('https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/releases?per_page=5',
      {
        method: 'GET',
        timeout: 30000,
      })

    return await response.json<Type_GithubRelease[] | []>()
  } catch (e) {
    console.log(e);
    return false
  }

}


export {
  fetchVersions
}