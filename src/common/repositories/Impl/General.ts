/* eslint-disable max-classes-per-file */
import BaseElectronRepository from 'common/repositories/Impl/electron/Base';
import { GeneralRepository } from 'common/repositories/interfaces';

// eslint-disable-next-line import/prefer-default-export
export class BaseGeneralRepository extends BaseElectronRepository implements GeneralRepository {
  openLink = (link: string) => {
    this.mainPreload.general.openLink(link);
  };
}
