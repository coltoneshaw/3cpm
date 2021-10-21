import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import {UpdateDealRequest} from "@/main/3Commas/types/Deals";
import {Type_Profile} from "@/types/config";

export default class ElectronDealsRepository extends BaseElectronRepository implements DealsRepository {
    update(profileData: Type_Profile, deal: UpdateDealRequest): any {
        return  this.electron.deals.update(profileData, deal)
    }
}
