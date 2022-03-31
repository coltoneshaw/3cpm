import type { Config } from 'types/preload';

export default interface ConfigRepository {
  get: Config['get'];
  profile: Config['profile'];
  getProfile: Config['getProfile']
  reset: Config['reset']
  set: Config['set']
  // setProfile: config['setProfile']
  bulk: Config['bulk']
}
