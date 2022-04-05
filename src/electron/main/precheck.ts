import log from 'electron-log';
import path from 'path';
import fsExtra from 'fs-extra';
import { app } from 'electron';
import { ConfigValuesType } from 'types/config';
import { config } from 'electron/main/Config/config';
import { checkOrMakeTables } from './Database/initializeDatabase';

const appDataPath = app.getPath('userData');
const checkInvalidConfig = async (
  currentProfile: string | undefined | 'default',
  loadedConfig: ConfigValuesType,
) => {
  if (!currentProfile || currentProfile === 'default') {
    try {
      const profileIds = Object.keys(loadedConfig.profiles);
      config.set('current', profileIds[0]);

      // eslint-disable-next-line max-len
      log.debug(`Primary profile was undefined / default. Switching to ${profileIds[0]}`);
    } catch (err) {
      log.error('Unable to convert config to use a new primary profile.', err);
    }
  }
};

const checkProfileDatabase = async (currentProfile: string) => {
  await checkOrMakeTables(currentProfile);
};

const checkDatabaseDirectory = async () => {
  const databasePath = path.join(appDataPath, 'databases');
  const databaseDirExists = await fsExtra.pathExists(databasePath);
  if (!databaseDirExists) {
    await fsExtra.mkdir(databasePath);
    log.debug('Created the database directory');
    return;
  }
  log.debug('Database directory exists');
};

export default async function preloadCheck() {
  const loadedConfig = config.store;
  const currentProfile = loadedConfig?.current;

  await checkInvalidConfig(currentProfile, loadedConfig);
  await checkDatabaseDirectory();
  await checkProfileDatabase(currentProfile);
}
