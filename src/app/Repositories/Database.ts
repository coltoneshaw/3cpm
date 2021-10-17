interface DBRepository {
    query(queryString:string):any;
    update(table:string, updateData:object[]):any;
    upsert(table:string, data:any[], id:string, updateColumn:string):any;
    run(query:string):any;
    deleteAllData(profileID: string):any;
}
