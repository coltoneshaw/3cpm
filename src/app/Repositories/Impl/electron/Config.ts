import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { ConfigRepository } from '@/app/Repositories/interfaces';
import type { defaultConfig } from "@/utils/defaultConfig";

export default class ElectronConfigRepository extends BaseElectronRepository implements ConfigRepository {
    get =  (value: 'all' | string) => {
        return this.mainPreload.config.get(value)
    }
    getProfile = (value: string, profileId: string)  =>  {
        return this.mainPreload.config.getProfile(value, profileId)
    }
    reset = async () => {
        await this.mainPreload.config.reset()
    }
    set = async (key: string, value: any) => {
        await this.mainPreload.config.set(key, value)
    }
    // setProfile(key: string, value: any): any {
    //     return this.mainPreload.config.setProfile(key, value)
    // }
    bulk = async (changes: typeof defaultConfig) => {
        await this.mainPreload.config.bulk(changes)
    }
}
