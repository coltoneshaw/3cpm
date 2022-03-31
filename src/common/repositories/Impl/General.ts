/* eslint-disable max-classes-per-file */
import BaseElectronRepository from 'common/repositories/Impl/electron/Base';
import { GeneralRepository, PmRepository } from 'common/repositories/interfaces';

export class BaseGeneralRepository extends BaseElectronRepository implements GeneralRepository {
  openLink = (link: string) => {
    this.mainPreload.general.openLink(link);
  };
}

export class BasePmRepository extends BaseElectronRepository implements PmRepository {
  versions = () => this.mainPreload.pm.versions();
}
