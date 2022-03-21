import BaseElectronRepository from '@/app/Repositories/Impl/electron/Base';
import { DBRepository } from '@/app/Repositories/interfaces';
import { TableNames } from '@/types/preload';
import { logToConsole } from '@/utils/logging';

export default class ElectronDBRepository extends BaseElectronRepository implements DBRepository {
  query = async (profileId: string, queryString: string) => this.mainPreload.database.query(profileId, queryString);

  update = (profileId: string, table: TableNames, data: object[]) => {
    if (!data || data.length === 0) {
      logToConsole('debug', 'no data to update');
      return;
    }
    this.mainPreload.database.update(profileId, table, data);
  };

  upsert = (profileId: string, table: TableNames, data: any[], id: string, updateColumn: string) => {
    if (!data || data.length === 0) {
      logToConsole('debug', 'no data to update');
      return;
    }
    this.mainPreload.database.upsert(profileId, table, data, id, updateColumn);
  };

  run = (profileId: string, query: string) => this.mainPreload.database.run(profileId, query);

  deleteAllData = async (profileID?: string) => this.mainPreload.database.deleteAllData(profileID);
}
