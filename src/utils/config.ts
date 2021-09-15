import { TconfigValues } from "@/types/config";

const Store = require('electron-store');
const { run } = require('@/app/Features/Database/database')
import { v4 as uuidv4 } from 'uuid';
import { defaultConfig } from '@/utils/defaultConfig';


const migrateCurrencyToArray = (store: any) => {
    const currentCurrency = store.get('general.defaultCurrency');
    (currentCurrency?.length > 0) ? store.set('general.defaultCurrency', [currentCurrency]) : store.set('general.defaultCurrency', [])
}

const migrationToProfiles = (config:any) => {
    if(config.get('general.version') === 'v0.5.0') {
        console.debug('looks like this is already on the latest version.')
        return false
    }
    const id = uuidv4()
    config.delete('general.version')
    const { apis, general, syncStatus, statSettings } = config.store
    config.store = {
        profiles: {
            [id]: { "name": "default", apis: {...apis, mode: "real"}, general, syncStatus, statSettings }
        },
        general: {
            version: 'v0.5.0'
        },
        current: id
    }

    try {
        Promise.all([
            run(`ALTER TABLE accountData ADD profile_id VARCHAR(36)`),
            run(`ALTER TABLE bots ADD profile_id VARCHAR(36)`),
            run(`ALTER TABLE deals ADD profile_id VARCHAR(36)`),
        ]).then(() => {
            run(`UPDATE accountData SET profile_id='${id}' WHERE profile_id IS NULL`)
            run(`UPDATE bots SET profile_id='${id}' WHERE profile_id IS NULL`)
            run(`UPDATE deals SET profile_id='${id}' WHERE profile_id IS NULL`)
        })
    } catch (e) {
        console.error(e)
        console.error('error migrating to v0.5 ')
    }
    
}


// establishing a config store.
const config = new Store({
    migrations: {
        // '0.0.3': ( store: any )=>{
        //     console.info('migrating the config store to 0.0.2-RC1')
        //     store.set('statSettings.account_id', []);
        //     migrateCurrencyToArray(store)
        // },
        // '0.0.4': ( store: any )=>{
        //     console.info('migrating the config store to 0.0.4')
        //     console.log('adding a reserved funds array.')
        //     store.set('statSettings.reservedFunds', []);
        // },
        // '0.1.0': ( store: any )=>{
        //     console.info('migrating the config store to 0.1.0')
        //     run('drop table bots;')
        //     store.set('general.updated', true)
        // },
        // '0.1.1': ( store: any )=>{
        //     store.set('general.updated', true)
        // },
        '<=0.2.0': () => {
            console.log('running the v0.2 migration!!!!!!!!!!!!!!!!!!!!')
            // removing the bots that have been synced so they can be resynced and a new column added
            run('ALTER TABLE bots ADD COLUMN hide boolean;')
            run("delete from deals where status in ('failed', 'cancelled') ")
        },
        'v0.5.0': (store: any) => {
            console.info('migrating the config store to 0.5.0')
            
            migrationToProfiles(store)


        }
    },
    defaults: <TconfigValues>defaultConfig,
    projectVersion: 'v0.5.0'

});

const getProfileConfig = (key: string) => {
    const current = config.get('current')
    return config.get('profiles.' + current + (key ? '.' + key : ''))
}


const setProfileConfig = (key: string, value: any) => {
    const current = config.get('current')
    return config.set('profiles.' + current + '.' + key, value)
}

const setDefaultConfig = () => {
    config.store = defaultConfig
}


export {
    config,
    getProfileConfig,
    setProfileConfig,
    setDefaultConfig
}