type GithubAuthor = {
  'login': string // "coltoneshaw",
  'id': number // 46071821,
  'node_id': string // "MDQ6VXNlcjQ2MDcxODIx",
  'avatar_url': number // "https://avatars.githubusercontent.com/u/46071821?v=4",
  'gravatar_id': string,
  'url': string // "https://api.github.com/users/coltoneshaw",
  'html_url': string // "https://github.com/coltoneshaw",
  'followers_url': string // "https://api.github.com/users/coltoneshaw/followers",
  'following_url': string // "https://api.github.com/users/coltoneshaw/following{/other_user}",
  'gists_url': string // "https://api.github.com/users/coltoneshaw/gists{/gist_id}",
  'starred_url': string // "https://api.github.com/users/coltoneshaw/starred{/owner}{/repo}",
  'subscriptions_url': string // "https://api.github.com/users/coltoneshaw/subscriptions",
  'organizations_url': string // "https://api.github.com/users/coltoneshaw/orgs",
  'repos_url': string // "https://api.github.com/users/coltoneshaw/repos",
  'events_url': string // "https://api.github.com/users/coltoneshaw/events{/privacy}",
  'received_events_url': string // "https://api.github.com/users/coltoneshaw/received_events",
  'type': 'user' // "User",
  'site_admin': boolean
};

type Assets = {
  'url': string // "https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/releases/assets/46530447",
  'id': number // 46530447,
  'node_id': string // "RA_kwDOFv81Ic4Cxf-P",
  'name': string // "3c-portfolio-manager-1.0.0-linux-x86_64.AppImage",
  'label': null | string,
  'uploader': GithubAuthor,
  'content_type': string// "application/octet-stream",
  'state': string // "uploaded",
  'size': number // 93781957,
  'download_count': number // 34,
  'created_at': string // "2021-10-08T15:47:44Z",
  'updated_at': string // "2021-10-08T15:48:43Z",
  'browser_download_url': string // "https://github.com/coltoneshaw/3c-portfolio-manager/releases/download/v1.0.0/3c-portfolio-manager-1.0.0-linux-x86_64.AppImage"
};

export type GithubReleaseType = {
  'url': string,
  'assets_url': string,
  'upload_url': string,
  'html_url': string,
  'id': number,
  'author': GithubAuthor,
  'node_id': string // "RE_kwDOFv81Ic4DClhw",
  'tag_name': string // "v1.0.0",
  'target_commitish': string // "main",
  'name': string // "v1.0.0",
  'draft': false,
  'prerelease': false,
  'created_at': string // "2021-10-08T14:39:46Z",
  'published_at': string // "2021-10-08T14:40:27Z",
  'assets': Assets[],
  'tarball_url': string // "https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/tarball/v1.0.0",
  'zipball_url': string // "https://api.github.com/repos/coltoneshaw/3c-portfolio-manager/zipball/v1.0.0",
  'body': string // it's long.
};

export interface GithubAPIError {
  'message': 'Not Found',
  'documentation_url': string
}
