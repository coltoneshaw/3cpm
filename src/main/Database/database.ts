import { app } from 'electron';
import log from 'electron-log';
import path from 'path';
import fsExtra from 'fs-extra';
import Database from 'better-sqlite3';
// eslint-disable-next-line import/no-cycle
import { checkOrMakeTables } from './initializeDatabase';
// eslint-disable-next-line import/no-cycle
import { query, run, normalizeData } from './helper';
// import { config } from '@/main/Config/config';

const appDataPath = app.getPath('userData');

export const chooseDatabase = (
  profileId: string,
) => new Database(path.join(appDataPath, 'databases', `${profileId}.sqlite3`));

/**
 *
 * @param {object} data Array of Objects.
 * @param {string} tableName valid table name for the sqlite database
 *
 * @description Inserting data into a table. Data coming in needs to be an array of objects.
 */

const normalizedData = (data: any) => data.map((row: any) => {
  const newRow: any = {};
  Object.keys(row).forEach((item) => {
    newRow[normalizeData(item)] = normalizeData(row[item]);
  });

  return newRow;
});

const update = (table: string, data: any[], profileId: string): void => {
  const db = chooseDatabase(profileId);
  if (data.length === 0) {
    log.log('no data to write');
    return;
  }

  const newData = normalizedData(data);
  const KEYS = Object.keys(newData[0]).map((e) => normalizeData(e)).join();
  const valueKey = Object.keys(newData[0])
    .map((key) => `@${key}`)
    .map((e) => normalizeData(e))
    .join();
  const insert = db
    .prepare(`INSERT OR REPLACE INTO ${table} (${KEYS}) VALUES (${valueKey})`);

  const insertMany = db.transaction((dataArray) => {
    for (const row of dataArray) insert.run(row);
  });

  insertMany(newData);
};

function upsert(
  table: string,
  data: any[],
  id: string,
  updateColumn: string,
  profileId: string,
): void {
  const db = chooseDatabase(profileId);

  if (data.length === 0) {
    log.log('no data to write');
    return;
  }

  // removing any inconsistencies with how sqlite handles the data.
  const normalizedDataArray = data.map((row) => {
    const newRow: any = {};
    Object.keys(row).forEach((item) => {
      newRow[normalizeData(item)] = normalizeData(row[item]);
    });
    return newRow;
  });

  const insertMany = db.transaction((dataArray) => {
    for (const row of dataArray) {
      const statement = db
        .prepare(
          // eslint-disable-next-line max-len
          `UPDATE ${table} SET ${updateColumn} = ${row[updateColumn]} where ${id} = ${row[id]}';`,
        );
      statement.run(row);
    }
  });
  insertMany(normalizedDataArray);
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
    return;
  }
  log.info(`attempting to delete all database info for ${profileID}`);

  await fsExtra.remove(
    path.join(appDataPath, 'databases', `${profileID}.sqlite3`),
    (err) => {
      if (err) {
        log.error(`unable to delete database for ${profileID}${err}`);
        return;
      }
      log.info(`database info deleted for ${profileID}`);
    },
  );
}

export {
  update,
  query,
  run,
  checkOrMakeTables,
  deleteAllData,
  upsert,
};
