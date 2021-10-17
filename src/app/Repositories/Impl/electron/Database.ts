import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";

export default class ElectronDBRepository extends BaseElectronRepository implements DBRepository {
    query(queryString:string):any {
        return this.electron.database.query(queryString);
    }
    update(table:string, updateData:object[]):any {
        return this.electron.database.update(table, updateData);
    }
    upsert(table:string, data:any[], id:string, updateColumn:string):any {
        return this.electron.database.upsert(table, data, id, updateColumn);
    }
    run(query:string):any {
        return this.electron.database.run(query);
    }
    deleteAllData(profileID: string):any {
        return this.electron.database.deleteAllData(profileID);
    }
}
