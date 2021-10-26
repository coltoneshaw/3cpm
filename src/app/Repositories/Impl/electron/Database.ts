import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { DBRepository } from '@/app/Repositories/interfaces';
import { tableNames } from "@/types/preload";

export default class ElectronDBRepository extends BaseElectronRepository implements DBRepository {
    query = async (queryString:string) => await this.mainPreload.database.query(queryString);
    update = (table:tableNames, data:object[]) => {
        if(!data || data.length === 0){
            console.log('no data to update');
            return 
        }
        this.mainPreload.database.update(table, data);
    }
    upsert = (table:tableNames, data:any[], id:string, updateColumn:string) => {
        if(!data || data.length === 0){
            console.log('no data to update');
            return
        }
        this.mainPreload.database.upsert(table, data, id, updateColumn);
    }
    run = (query:string) => this.mainPreload.database.run(query);
    deleteAllData = async (profileID?: string) =>  await this.mainPreload.database.deleteAllData(profileID);
}
