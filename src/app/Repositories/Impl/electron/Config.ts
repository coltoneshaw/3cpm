import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { ConfigRepository } from '@/app/Repositories/interfaces';
import { Type_Profile } from "@/types/config";
import type { defaultConfig } from "@/utils/defaultConfig";

export default class ElectronConfigRepository extends BaseElectronRepository implements ConfigRepository {
    get =  (value: 'all' | string) => {
        return this.mainPreload.config.get(value)
    }
    profile =  (type: 'create' | 'delete', profileData: Type_Profile, profileId: string) => {
        return this.mainPreload.config.profile(type, profileData, profileId)
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
    bulk = async (changes: typeof defaultConfig) => {
        await this.mainPreload.config.bulk(changes)
    }
}
