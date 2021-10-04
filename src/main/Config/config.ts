import { TconfigValues, Type_Profile } from "@/types/config";
const log = require('electron-log');

//@ts-ignore
import { version } from '#/package.json';
const Store = require('electron-store');
const { run } = require('@/main/Database/database')
import { v4 as uuidv4 } from 'uuid';
import { defaultConfig } from '@/utils/defaultConfig';


const migrateCurrencyToArray = (store: any) => {
    const currentCurrency = store.get('general.defaultCurrency');
    (currentCurrency?.length > 0) ? store.set('general.defaultCurrency', [currentCurrency]) : store.set('general.defaultCurrency', [])
}

const migrationToProfiles = (config:any) => {
    if(config.get('general.version') === 'v0.5.0') {
        log.debug('looks like this is already on the latest version.')
        return false
    }
    const id = uuidv4()
    config.delete('general.version')
    const { apis, general, syncStatus, statSettings } = config.store
    if (!apis || !general || !syncStatus || statSettings) return

    config.store = {
        profiles: {
            [id]: { 
                "name": "default", 
                id, 
                "apis": { 
                    "threeC": { 
                        ...apis.threeC, 
                        "mode": "real"
                    }
                }, 
                general, 
                syncStatus, 
                statSettings 
            }
        },
        general: {
            version: 'v1.0.0'
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
        log.error(e)
        log.error('error migrating to v1.0.0 ')
    }
    
}


// establishing a config store.
const config = new Store({
    migrations: {
        // '0.0.3': ( store: any )=>{
        //     log.info('migrating the config store to 0.0.2-RC1')
        //     store.set('statSettings.account_id', []);
        //     migrateCurrencyToArray(store)
        // },
        // '0.0.4': ( store: any )=>{
        //     log.info('migrating the config store to 0.0.4')
        //     log.log('adding a reserved funds array.')
        //     store.set('statSettings.reservedFunds', []);
        // },
        // '0.1.0': ( store: any )=>{
        //     log.info('migrating the config store to 0.1.0')
        //     run('drop table bots;')
        //     store.set('general.updated', true)
        // },
        // '0.1.1': ( store: any )=>{
        //     store.set('general.updated', true)
        // },
        '<=0.2.0': () => {
            log.log('running the v0.2 migration!!!!!!!!!!!!!!!!!!!!')
            // removing the bots that have been synced so they can be resynced and a new column added
            run('ALTER TABLE bots ADD COLUMN hide boolean;')
            run("delete from deals where status in ('failed', 'cancelled') ")
        },
        '<1.0.0': (store: any) => {
            log.info('migrating the config store to 1.0.0')
            console.log('migrating!!')
            // if(version === 'v1.0.0') {
            //     console.log('already on the latest version!')
            // }
            migrationToProfiles(store)


        }
    },
    defaults: <TconfigValues>defaultConfig
});

const getProfileConfig = (key: string) => {
    const current = config.get('current')
    return config.get('profiles.' + current + (key ? '.' + key : ''))
}



const getProfileConfigAll = (profileId?: string) => {

    if(!profileId)  profileId = <string>config.get('current')

    return <Type_Profile>config.get('profiles.' + profileId)
}


const setProfileConfig = (key: string, value: any, profileId:string) => {
    // if(!profileId) profileId = config.get('current')
    if(!profileId) {
        log.error('No profile ID to set the config' + key + ' - ' + value);
        return
    }
    return config.set('profiles.' + profileId + '.' + key, value)
}

const setDefaultConfig = () => {
    config.store = defaultConfig
}


export {
    config,
    getProfileConfig,
    setProfileConfig,
    setDefaultConfig,
    getProfileConfigAll
}