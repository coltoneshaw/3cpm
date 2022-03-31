import log from 'electron-log';
import fsExtra from 'fs-extra';
import path from 'path';
import { app } from 'electron';
import { checkOrMakeTables } from 'electron/main/Database/database';

const appDataPath = app.getPath('userData');

const convertToProfileDatabases = async (profileIds: string[]) => {
  if (!profileIds || profileIds.length === 0) return;
  await fsExtra.mkdir(path.join(appDataPath, 'databases'));

  profileIds.forEach((profileId) => {
    log.info(`Converting ${profileId} to it's own database`);
    checkOrMakeTables(profileId);
  });

  fsExtra.remove(path.join(appDataPath, 'db.sqlite3'), (err) => {
    if (err) return log.error('Unable to delete original database file', err);
    return log.info('Deleted db.sqlite3 file from user directory');
  });
};

export default convertToProfileDatabases;
