type tableNames = 'deals' | 'bots' | 'accountData'

interface DBRepository {
    query(queryString:string):Promise<any[]>;
    update( table: tableNames, updateData:object[] ):void;
    upsert(table:string, data:any[], id:string, updateColumn:string):void;
    run(query:string):void;
    deleteAllData(profileID?: string):Promise<void>;
}
