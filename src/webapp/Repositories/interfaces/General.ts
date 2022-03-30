import type { General, PM } from '@/types/preload';

export interface GeneralRepository {
  openLink: General['openLink']
}

export interface PmRepository {
  versions: PM['versions']
}
