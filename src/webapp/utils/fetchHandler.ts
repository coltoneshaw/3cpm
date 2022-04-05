import { logToConsole } from 'common/utils/logging';

async function fetchHandler<T>(url: string): Promise<T | Error> {
  try {
    const response = await fetch(url, { method: 'GET' });
    return await response.json() as T;
  } catch (e) {
    logToConsole('error', `Error fetching for ${url} ${e}`);
    throw new Error(`Error fetching for ${url} ${e} `);
  }
}
export default fetchHandler;
