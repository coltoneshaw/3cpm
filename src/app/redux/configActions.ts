import { setConfig, setCurrentProfile, updateCurrentProfileByPath, deleteProfileById } from '@/app/redux/configSlice'
import {setSyncData} from '@/app/redux/threeCommas/threeCommasSlice'

import { TconfigValues, Type_Profile, Type_ReservedFunds } from '@/types/config';

import { removeDuplicatesInArray } from '@/utils/helperFunctions';

import store from './store'

const updateConfig = async () => {

    await window.ThreeCPM.Repository.Config.get('all')
        .then(config => {
            store.dispatch(setConfig(config));
            updateCurrentProfile(config.profiles[config.current])
        })
}

const storeConfigInFile = async () => {
    try {
        await window.ThreeCPM.Repository.Config.bulk(store.getState().config.config)
        updateConfig()
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

const updateCurrentProfile = (profileData: Type_Profile) => {
    store.dispatch(setCurrentProfile(profileData));
    // setting this to zero here to prevent a spam of notifications with auto sync enabled. 
    store.dispatch(setSyncData({syncCount: 0, time: 0}))
}

/**
 * 
 * @param data data to be stored on the current profile
 * @param path string path to represent where to store the data.
 */
const updateNestedCurrentProfile = (data: string | {} | [], path: string) => {
    store.dispatch(updateCurrentProfileByPath({ data, path }))
}

const updateReservedFundsArray = async (key: string, secret: string, mode: string,  reservedFunds: Type_ReservedFunds[]) => {

    const accountSummary = await window.ThreeCPM.Repository.API.getAccountData(undefined, key, secret, mode)

    if (accountSummary != undefined) {

        const prevState = <any[]>[];

        // new data coming in, removing the dups from the array
        const filteredAccountData = removeDuplicatesInArray(accountSummary, 'id')

        // checking to see if any reserved funds exist
        if (reservedFunds.length === 0 || reservedFunds === []) {
            console.log('setting since there are no account IDs!')
           return filteredAccountData.map(account => {
                const { id, name } = account
                return {
                    id,
                    account_name: name,
                    reserved_funds: 0,
                    is_enabled: false
                }
            })

        }

        // getting account IDs from the reserved funds
        // const configuredAccountIds = removeDuplicatesInArray(reservedFunds.map(account => account.id), 'id')

        // finding any accounts that did not exist since the last sync.
       return filteredAccountData
            // .filter( account => !configuredAccountIds.includes(account.id) )
            .map(account => {
                let { id, name } = account
                let reserved_funds = 0;
                let is_enabled = false;

                let filteredAccount = prevState.find(account => account.id == id)
                if (filteredAccount != undefined) {
                    reserved_funds = filteredAccount.reserved_funds;
                    is_enabled = filteredAccount.is_enabled;
                }
                return {
                    id,
                    account_name: name,
                    reserved_funds,
                    is_enabled
                }
            })

        // updateReservedFunds(reservedFundsArray)


    }

}

const deleteProfileByIdGlobal = (config: TconfigValues, profileId:string, setOpen?:CallableFunction | undefined) => {
    const profileKeys = Object.keys(config.profiles)
    if (profileKeys.length <= 1) {
        alert('Hold on cowboy. You seem to be trying to delete your last profile. If you want to reset your data use Menu > Help > Reset all data.')
        return
    }
    const accept = confirm("Deleting this profile will delete all information attached to it including API keys, and the database. This action will not impact your 3Commas account in any way. Confirm you would like to locally delete this profile.");
    if (accept) {

        console.log('deleted the profile!')

        store.dispatch(deleteProfileById({ profileId }))
        storeConfigInFile();

        window.ThreeCPM.Repository.Database.deleteAllData(profileId)

        // delete the profile command
        // route the user back to a their default profile OR route the user to a new blank profile..?
        // What happens if it's the last profile? Show a warning maybe saying:
        // "This is your only profile. Unable to delete. If you want to reset your 3C Portfolio Manager use Menu > Help > Reset all data."
        if(setOpen) setOpen(true)
    }
}



export {
    updateConfig,
    updateReservedFundsArray,
    updateNestedCurrentProfile,
    storeConfigInFile,
    deleteProfileByIdGlobal
}