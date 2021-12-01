import { app } from "electron";
import { config } from "@/main/Config/config";
import log from 'electron-log';
import { query, run, normalizeData } from "./helper";
import { checkOrMakeTables } from './initializeDatabase'
import path from "path";
import fsExtra from 'fs-extra';
import Database from 'better-sqlite3';

const appDataPath = app.getPath('userData');


export const chooseDatabase = (profileId: string) => new Database(path.join(appDataPath, 'databases', profileId + '.sqlite3'));

/********************************************
 * 
 *        Database Action Commands
 * 
 ********************************************/

/**
 * 
 * @param {object} data Array of Objects. 
 * @param {string} tableName valid table name for the sqlite database
 * 
 * @description Inserting data into a table. Data coming in needs to be an array of objects.
 */

 const normalizedData = (data:any) => data.map((row:any) => {
    let newRow: any = {};
    Object.keys(row).forEach(item => {
        newRow[normalizeData(item)] = normalizeData(row[item])
    })

    return newRow
})

const update = (table: string, data: any[], profileId: string): void => {
    const db = chooseDatabase(profileId)
    if (data.length == 0) {
        log.log('no data to write')
        return
    }

    const newData = normalizedData(data)
    const KEYS = Object.keys(newData[0]).map(e => normalizeData(e)).join()
    const valueKey = Object.keys(newData[0]).map(key => '@' + key).map(e => normalizeData(e)).join();
    const insert = db.prepare(`INSERT OR REPLACE INTO ${table} (${KEYS}) VALUES (${valueKey})`)

    const insertMany = db.transaction(dataArray => {
            for (const row of dataArray) insert.run(row)
        });

    insertMany(newData)
}

function upsert(table: string, data: any[], id: string, updateColumn: string, profileId: string): void {
    const db = chooseDatabase(profileId)

    if (data.length == 0) {
        log.log('no data to write')
        return
    }

    // removing any inconsistencies with how sqlite handles the data.
    let normalizedData = data.map(row => {
        let newRow: any = {};
        Object.keys(row).forEach(item => {
            newRow[normalizeData(item)] = normalizeData(row[item])
        })
        return newRow
    })


    // const KEYS = Object.keys(normalizedData[0]).map(e => normalizeData(e)).join()
    // const valueKey = Object.keys(normalizedData[0]).map(key => '@' + key).map(e => normalizeData(e)).join()

    const insertMany = db.transaction((dataArray) => {
        for (const row of dataArray) {
            const statement = db.prepare(`UPDATE ${table} SET ${updateColumn} = ${row[updateColumn]} where ${id} = ${row[id]} AND profile_id = '${config.get('current')}';`)
            statement.run(row)
        }
    });
    insertMany(normalizedData)
}

/**
 * 
 * @param {string} query The full query string for the information.
 * @returns JSON array of objects containing the matching information.
 * 
 * @docs - https://github.com/JoshuaWise/better-sqlite3/blob/HEAD/docs/api.md#allbindparameters---array-of-rows
 * 
 * ### TODO 
 * - Can add the ability to set custom filters to be returned. Not sure the exact benefit of this but it's possible.
 */




async function deleteAllData(profileID?: string): Promise<void> {

    if (!profileID) {
        fsExtra.emptyDirSync(path.join(appDataPath, 'databases'));
        log.info('deleting all database info.');
        return
    }
    log.info('attempting to delete all database info for ' + profileID)

    await fsExtra.remove(path.join(appDataPath, 'databases', profileID + '.sqlite3'), err => {
        if (err) return log.error('unable to delete database for ' + profileID + err)
        log.info('database info deleted for ' + profileID)
      })

    

}


export {
    update,
    query,
    run,
    checkOrMakeTables,
    deleteAllData,
    upsert
}
