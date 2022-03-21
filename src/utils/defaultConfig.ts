import { sub, getTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ConfigValuesType, ProfileType } from '@/types/config';

// @ts-ignore
import { version } from '#/package.json';

const configSchema = {
  apis: {
    type: 'object',
    properties: {
      threeC: {
        type: 'object',
        properties: {
          key: {
            type: ['string', 'null'],
            default: '',
          },
          secret: {
            type: ['string', 'null'],
            default: '',
          },
          mode: {
            type: ['string'],
            default: 'real',
          },
        },
      },
    },
  },
  general: {
    type: 'object',
    properties: {
      defaultCurrency: {
        type: 'array',
      },
      globalLimit: {
        type: 'number',
        default: 250000,
      },
    },
  },
  syncStatus: {
    type: 'object',
    properties: {
      deals: {
        type: 'object',
        properties: {
          lastSyncTime: {
            type: ['number', 'null'],
            minimum: 0,
          },
        },
      },
    },
  },
  statSettings: {
    type: 'object',
    properties: {
      startDate: {
        type: 'number',
        default: '',
      },
      account_id: {
        type: ['array'],

      },
    },
  },
  writeEnabled: { type: 'boolean', default: false },
};

const currentId = uuidv4();

const defaultProfile: ProfileType = {
  name: 'New profile',
  id: currentId,
  apis: {
    threeC: {
      key: '',
      secret: '',
      mode: 'real',
    },
  },
  general: {
    defaultCurrency: [],
    globalLimit: 250000,
    updated: false,
  },
  syncStatus: {
    deals: {
      lastSyncTime: 0,
    },
  },
  statSettings: {
    startDate: getTime(sub(new Date(), { days: 90 })),
    account_id: [],
    reservedFunds: [],
  },
  writeEnabled: false,
};

const defaultConfig: ConfigValuesType = {

  profiles: { [currentId]: defaultProfile },
  current: 'default',
  globalSettings: {
    notifications: {
      enabled: true,
      summary: false,
    },
  },
  general: {
    version,
  },
};

export {
  defaultProfile,
  defaultConfig,
  configSchema,
};
