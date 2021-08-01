const Store = require('electron-store');

import { defaultConfig, configSchema } from '@/utils/defaultConfig';

// establishing a config store.
const config = new Store({
    migrations: {
        '0.0.3': ( store: any )=>{
            console.info('migrating the config store to 0.0.2-RC1')
            store.set('statSettings.account_id', []);
        }
    },
    defaults: defaultConfig
});

export {
    config
}