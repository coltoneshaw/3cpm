import { config } from "@/main/Config/config";
import { TconfigValues } from "@/types/config";
import { checkOrMakeTables } from "./Database/initializeDatabase";
import log from 'electron-log';
import path from "path";
import fsExtra from 'fs-extra';
import { app } from "electron";

const appDataPath = app.getPath('userData');
const checkInvalidConfig = async (currentProfile: string | undefined | 'default', loadedConfig: TconfigValues) => {
    
    if(!currentProfile || currentProfile === 'default'){
        try {
            const profileIds = Object.keys(loadedConfig.profiles);
            config.set('current', profileIds[0])
            log.debug('Primary profile was undefined / default. Switching to ' + profileIds[0])
        } catch (err) {
            log.error('Unable to convert config to use a new primary profile.', err)
        }
        
    }
}

const checkProfileDatabase = async (currentProfile: string) => {
    await checkOrMakeTables(currentProfile)
}

const checkDatabaseDirectory = async () => {

    const databaseDirExists = await fsExtra.pathExists(path.join(appDataPath, 'databases'))
    if(!databaseDirExists) {
        await fsExtra.mkdir(path.join(appDataPath, 'databases'));
        log.debug('Created the database directory')
        return;
    }
    log.debug('Database directory exists')
}

export const preloadCheck = async () => {
    const loadedConfig = config.store;
    const currentProfile = loadedConfig?.current;

    await checkInvalidConfig(currentProfile, loadedConfig)
    await checkDatabaseDirectory()
    await checkProfileDatabase(currentProfile)
}