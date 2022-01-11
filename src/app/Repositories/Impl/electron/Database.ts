import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { DBRepository } from '@/app/Repositories/interfaces';
import { tableNames } from "@/types/preload";

export default class ElectronDBRepository extends BaseElectronRepository implements DBRepository {
    query = async (profileId:string, queryString:string) => await this.mainPreload.database.query(profileId, queryString);
    update = (profileId:string, table:tableNames, data:object[]) => {
        if(!data || data.length === 0){
            console.log('no data to update');
            return 
        }
        this.mainPreload.database.update(profileId, table, data);
    }
    upsert = (profileId:string, table:tableNames, data:any[], id:string, updateColumn:string) => {
        if(!data || data.length === 0){
            console.log('no data to update');
            return
        }
        this.mainPreload.database.upsert(profileId, table, data, id, updateColumn);
    }
    run = (profileId:string, query:string) => this.mainPreload.database.run(profileId, query);
    deleteAllData = async (profileID?: string) =>  await this.mainPreload.database.deleteAllData(profileID);
}
