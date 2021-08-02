const Store = require('electron-store');

import { defaultConfig, configSchema } from '@/utils/defaultConfig';


const migrateCurrencyToArray = (store:any ) => {
    const currentCurrency = store.get('general.defaultCurrency');
    (currentCurrency.length > 0) ? store.set('general.defaultCurrency', [currentCurrency] ) : store.set('general.defaultCurrency', ["usd"] )
}

// establishing a config store.
const config = new Store({
    migrations: {
        '0.0.3': ( store: any )=>{
            console.info('migrating the config store to 0.0.2-RC1')
            store.set('statSettings.account_id', []);

            migrateCurrencyToArray(store)
            
        }
    },
    defaults: defaultConfig
});



export {
    config
}