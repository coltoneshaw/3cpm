import type { config } from "@/types/preload";


export default interface ConfigRepository {
    get: config['get'];
    profile: config['profile'];
    getProfile: config['getProfile']
    reset: config['reset']
    set: config['set']
    // setProfile: config['setProfile']
    bulk: config['bulk']
}
