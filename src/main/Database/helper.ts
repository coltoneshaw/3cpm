import { chooseDatabase } from './database'

const query = async (profileId: string, query: string): Promise<any[]> => {
    const db = chooseDatabase(profileId)
    const row = db.prepare(query)
    return row.all()
}


const run = (profileId: string, query: string): void => {
    const db = chooseDatabase(profileId)
    const stmt = db.prepare(query);
    stmt.run()
}

function normalizeData(data: any) {
    if (typeof data == 'string') return data.replaceAll('?', '')
    if (typeof data == 'boolean') return (data) ? 1 : 0;

    return data;
}


export { query, run, normalizeData }