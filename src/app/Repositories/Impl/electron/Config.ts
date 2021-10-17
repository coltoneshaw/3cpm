import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";

export default class ElectronConfigRepository extends BaseElectronRepository implements ConfigRepository {
    get(value: string): any {
        return this.electron.config.get(value)
    }
    getProfile(value: string): any {
        return this.electron.config.getProfile(value)
    }
    reset(): any {
        return this.electron.config.reset()
    }
    set(key: string, value: any): any {
        return this.electron.config.set(key, value)
    }
    setProfile(key: string, value: any): any {
        return this.electron.config.setProfile(key, value)
    }
    bulk(changes: object): any {
        return this.electron.config.bulk(changes)
    }
}
