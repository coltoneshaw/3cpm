import {Type_UpdateFunction} from "@/types/3Commas";
import {Type_Profile} from "@/types/config";
import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";

export default class ElectronAPIRepository extends BaseElectronRepository implements APIRepository {
    update(type: string, options: Type_UpdateFunction, profileData: Type_Profile): any {
        return this.electron.api.update(type, options, profileData)
    }

    updateBots(profileData: Type_Profile): any {
        return this.electron.api.updateBots(profileData)
    }

    getAccountData(profileData: Type_Profile, key?: string, secret?: string, mode?: string): any {
        return this.electron.api.getAccountData(profileData, key, secret, mode)
    }

    getDealOrders(profileData: Type_Profile, dealID: number): any {
        return this.electron.api.getDealOrders(profileData, dealID)
    }
}
