import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { ConfigRepository } from '@/app/Repositories/interfaces';

export default class ElectronConfigRepository extends BaseElectronRepository implements ConfigRepository {
    get(value: string): any {
        return this.mainPreload.config.get(value)
    }
    getProfile(value: string): any {
        return this.mainPreload.config.getProfile(value)
    }
    reset(): any {
        return this.mainPreload.config.reset()
    }
    set(key: string, value: any): any {
        return this.mainPreload.config.set(key, value)
    }
    setProfile(key: string, value: any): any {
        return this.mainPreload.config.setProfile(key, value)
    }
    bulk(changes: object): any {
        return this.mainPreload.config.bulk(changes)
    }
}
