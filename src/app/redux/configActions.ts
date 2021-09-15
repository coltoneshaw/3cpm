import { setConfig, setCurrentProfile, setEditingProfile, setEditingProfileId, setReservedFunds, updateOnEditingProfile, storeEditingProfileData, deleteProfileById } from '@/app/redux/configSlice'

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
        // store.dispatch(storeEditingProfileData());

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
    // store.dispatch(storeEditingProfileData());

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

const checkProfileIsValid = (editingProfile: Type_Profile) => {
    try {
        const { apis: { threeC }, name, statSettings: { reservedFunds, startDate } } = editingProfile
        if (!threeC.key || !threeC.mode || !threeC.secret) return { status: false, message: 'Missing 3Commas API information' }
        if (!name) return { status: false, message: 'Missing a valid profile name' }
        if (!reservedFunds) return { status: false, message: 'Missing accounts. Make sure to click "Test API Keys" and enable an account.' }
        if (reservedFunds.filter(account => account.is_enabled).length == 0) return { status: false, message: 'Missing an enabled account under reserved funds.' }
        if (!startDate) return { status: false, message: 'Missing a start date' }

        return { status: true, }
    } catch (e) {
        console.error(e)
        return { status: false, message: 'an error occured when saving. Check the Javascript Console for more details.' }
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

        //@ts-ignore
        electron.database.deleteAllData(profileId)

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
    updateNestedEditingProfile,
    storeConfigInFile,
    checkProfileIsValid,
    deleteProfileByIdGlobal
}