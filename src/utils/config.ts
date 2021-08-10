const Store = require('electron-store');

import { defaultConfig, configSchema } from '@/utils/defaultConfig';


const migrateCurrencyToArray = (store:any ) => {
    const currentCurrency = store.get('general.defaultCurrency');
    (currentCurrency.length > 0) ? store.set('general.defaultCurrency', [currentCurrency] ) : store.set('general.defaultCurrency', [] )
}


// establishing a config store.
const config = new Store({
    migrations: {
        '0.0.3': ( store: any )=>{
            console.info('migrating the config store to 0.0.2-RC1')
            store.set('statSettings.account_id', []);

            migrateCurrencyToArray(store)
            
        },
        '0.0.4': ( store: any )=>{
            console.info('migrating the config store to 0.0.4')
            console.log('adding a reserved funds array.')
            store.set('statSettings.reservedFunds', []);
        }
    },
    defaults: defaultConfig
});



export {
    config
}