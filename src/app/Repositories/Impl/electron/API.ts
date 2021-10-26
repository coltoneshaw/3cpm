import { Type_UpdateFunction } from "@/types/3Commas";
import { Type_Profile } from "@/types/config";
import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { APIRepository } from '@/app/Repositories/interfaces';

export default class ElectronAPIRepository extends BaseElectronRepository implements APIRepository {
    update = (type: string, options: Type_UpdateFunction, profileData: Type_Profile) => this.mainPreload.api.update(type, options, profileData)
    updateBots = (profileData: Type_Profile) => this.mainPreload.api.updateBots(profileData)
    getAccountData = (profileData: Type_Profile, key?: string, secret?: string, mode?: string) => {
        return this.mainPreload.api.getAccountData(profileData, key, secret, mode)
    }
    getDealOrders = (profileData: Type_Profile, dealID: number) => {
        return this.mainPreload.api.getDealOrders(profileData, dealID)
    }
}
