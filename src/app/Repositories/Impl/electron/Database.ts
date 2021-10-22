import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";

export default class ElectronDBRepository extends BaseElectronRepository implements DBRepository {
    async query(queryString:string):Promise<any[]> {
        return await this.electron.database.query(queryString);
    }
    update(table:string, data:object[]):void {
        if(!data || data.length === 0){
            console.log('no data to update');
            return 
        }

        this.electron.database.update(table, data);
    }
    upsert(table:string, data:any[], id:string, updateColumn:string):void {
        if(!data || data.length === 0){
            console.log('no data to update');
            return
        }
        this.electron.database.upsert(table, data, id, updateColumn);
    }
    run(query:string):void {
        this.electron.database.run(query);
    }
    async deleteAllData(profileID?: string):Promise<void> {
        await this.electron.database.deleteAllData(profileID);
    }
}
