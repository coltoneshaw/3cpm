import {chooseDatabase} from './database'

async function query(profileId:string, query: string) {
    const db = chooseDatabase(profileId)
    const row = db.prepare(query)
    return row.all()
}


function run(profileId:string, query: string):void {
    const db = chooseDatabase(profileId)
    const stmt = db.prepare(query);
    stmt.run()
}

function normalizeData(data: any) {
    if (typeof data == 'string') return data.replaceAll('?', '')
    if (typeof data == 'boolean') return (data) ? 1 : 0;

    return data;
}


export {
    query,
    run,
    normalizeData
}