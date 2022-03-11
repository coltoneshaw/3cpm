// eslint-disable-next-line import/no-cycle
import { chooseDatabase } from './database';

const query = async (
  profileId: string,
  queryString: string,
): Promise<any[]> => {
  const db = chooseDatabase(profileId);
  const row = db.prepare(queryString);
  return row.all();
};

const run = (profileId: string, queryString: string): void => {
  const db = chooseDatabase(profileId);
  const stmt = db.prepare(queryString);
  stmt.run();
};

function normalizeData(data: any) {
  if (typeof data === 'string') return data.replaceAll('?', '');
  if (typeof data === 'boolean') return (data) ? 1 : 0;

  return data;
}

export { query, run, normalizeData };
