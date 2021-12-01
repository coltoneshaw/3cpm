import { TconfigValues, Type_Profile } from "@/types/config";
import log from 'electron-log';
import { checkOrMakeTables } from "@/main/Database/database";
import fsExtra from 'fs-extra';
import path from "path";
import { app } from "electron";

const appDataPath = app.getPath('userData');




export const convertToProfileDatabases = async (profileIds: string[]) => {
    if (!profileIds || profileIds.length === 0) return

    await fsExtra.mkdir(path.join(appDataPath, 'databases'));
    for (let profileId of profileIds) {
        log.info(`Converting ${profileId} to it's own database`)
        checkOrMakeTables(profileId)
    }
    fsExtra.remove(path.join(appDataPath, 'db.sqlite3'), err => {
        if (err) return log.error('Unable to delete original database file', err)
        log.info('Deleted db.sqlite3 file from user directory')
    })

}