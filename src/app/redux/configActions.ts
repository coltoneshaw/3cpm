import { setConfig, setCurrentProfile, setEditingProfile, setEditingProfileId, setReservedFunds, updateOnEditingProfile, storeEditingProfileData } from '@/app/redux/configSlice'

import { TconfigValues, Type_Profile, Type_ReservedFunds } from '@/types/config';

import { removeDuplicatesInArray } from '@/utils/helperFunctions';

import store from './store'

const updateConfig = async () => {

    //@ts-ignore
    await electron.config.get()
        .then((config: any) => {
            store.dispatch(setConfig(config));
            updateCurrentProfile(config.profiles[config.current])
            updateEditingProfile(config.profiles[config.current], config.current)
        })
}

const storeConfigInFile = async () => {

    try {
        //@ts-ignore
        await electron.config.set(null, store.getState().config.config)
        updateConfig()
        return true
    } catch (e) {
        console.error(e)
        return false
    }

}

const updateCurrentProfile = (profileData: Type_Profile) => {
    store.dispatch(setCurrentProfile(profileData));
}

const updateEditingProfile = (profileData: Type_Profile, profileId: string) => {
    store.dispatch(setEditingProfile(profileData));
    store.dispatch(setEditingProfileId(profileId));
}

/**
 * 
 * @param data data to be stored on the editing profile
 * @param path string path to represent where to store the data.
 */
const updateNestedEditingProfile = (data: string | {} | [], path: string) => {

    store.dispatch(updateOnEditingProfile({ data, path }))
    store.dispatch(storeEditingProfileData())

}

const updateReservedFundsArray = async (key: string, secret: string, mode: string, updateReservedFunds: CallableFunction, reservedFunds: Type_ReservedFunds[]) => {

    console.log({ key, secret, mode })
    // @ts-ignore
    const accountSummary = await electron.api.getAccountData(key, secret, mode)

    if (accountSummary !== undefined || accountSummary.length > 0) {

        const prevState = <any[]>[];

        // new data coming in, removing the dups from the array
        const filteredAccountData = removeDuplicatesInArray(accountSummary, 'id')
        // console.log(filteredAccountData)

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
        const configuredAccountIds = removeDuplicatesInArray(reservedFunds.map(account => account.id), 'id')
        console.log(configuredAccountIds)

        // finding any accounts that did not exist since the last sync.
        const reservedFundsArray = filteredAccountData
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

        updateReservedFunds(reservedFundsArray)

    }

}


export {
    updateConfig,
    updateReservedFundsArray,
    updateNestedEditingProfile,
    storeConfigInFile
}