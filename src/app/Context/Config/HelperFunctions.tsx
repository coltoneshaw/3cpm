import React, { useCallback, useEffect, useState } from "react";
import { sub, getTime } from 'date-fns'
import dotProp from 'dot-prop';


import { TconfigValues, Type_Profile, Type_ReservedFunds } from '@/types/config'


import { useGlobalState } from '@/app/Context/Config';
import { removeDuplicatesInArray } from '@/utils/helperFunctions';

/**
 * 
 * @returns current profile or undefined
 */
const returnCurrentProfile = () => {
    const configState = useGlobalState();
    const { currentProfile } = configState;
    return currentProfile;
}


/**
 * @description used to fetch current profiles and set current profile state.
 * @returns Object with profile state functions
 */
const useProfileState = () => {
    const configState = useGlobalState();
    const { config, state: { currentProfileId, updateCurrentProfileId, currentlyEditingProfileId }, state } = configState;

    const [profiles, setProfiles] = useState<TconfigValues["profiles"] | {}>(() => { })

    useEffect(() => {
        const configProfiles = config.profiles
        if (configProfiles && Object.keys(configProfiles).length > 0) {
            setProfiles(configProfiles)
        }
    }, [config])

    const setCurrentProfile = (closeCallback: CallableFunction, id?: string) => {
        if (id) {
            updateCurrentProfileId(id)
        }
        closeCallback()
    }


    // const updateId = (id:string) => {
    //     setNewEditingProfile(id)
    // }

    let profileId = undefined;
    useEffect(() => {
        console.log('updating the ID from the function', currentlyEditingProfileId)
        profileId = currentlyEditingProfileId
    }, [currentlyEditingProfileId])

    return {
        setCurrentProfile,
        profiles,
        setProfiles,
        state,
        getCurrentProfileId: () => currentProfileId,
        currentlyEditingProfileId,
        profileId
        // editing: {
        //     currentlyEditingProfileId, 
        //     updateId
        // }
        
    }

}

const useConfigDate = () => {
    // setting the default state to be 90 days in the past.
    const [date, updateDate] = useState(() => getTime(sub(new Date(), { days: 90 })))

    const setNewStatDate = (profile: Type_Profile) => {
        updateDate(() => {
            const startDate: number | undefined = dotProp.get(profile, 'statSettings.startDate')
            return (startDate) ? startDate : getTime(sub(new Date(), { days: 90 }));
        })
    }

    return {
        date, updateDate, setNewStatDate
    }
}

const useConfigApiData = () => {
    const [apiData, updateApiData] = useState({ key: '', secret: '', mode: 'real' });

    const setNewApiKeys = (profile: Type_Profile) => {
        updateApiData(() => {
            const keyValue: string | undefined = dotProp.get(profile, 'apis.threeC.key');
            const secretValue: string | undefined = dotProp.get(profile, 'apis.threeC.secret')
            const modeValue: string | undefined = dotProp.get(profile, 'apis.threeC.mode')
            return {
                key: (keyValue) ? keyValue : "",
                secret: (secretValue) ? secretValue : "",
                mode: (modeValue) ? modeValue : "real"
            }
        });
    }

    return {
        apiData,
        updateApiData,
        setNewApiKeys
    }

}

const useConfigCurrency = () => {
    const [currency, updateCurrency] = useState<string[]>([])

    const setNewCurrency = (profile: Type_Profile) => {
        updateCurrency(() => {
            const newCurrency: string[] | undefined = dotProp.get(profile, 'general.defaultCurrency')
            return (newCurrency) ? [...newCurrency] : ["USD"]
        })
    }

    return {
        currency,
        updateCurrency,
        setNewCurrency
    }

}

const useConfigCurrentlyEditing = () => {
    const [currentlyEditingProfileId, updateCurrentlyEditingProfileId] = useState('');
    const [editingProfileData, updateEditingProfileData ] = useState();

    const setNewEditingProfile = (profileId:string) => {
        console.log(profileId)
        updateCurrentlyEditingProfileId(() => {
            
            return profileId
        })

        const newProfile = returnProfileById(profileId)

        // @ts-ignore
        updateEditingProfileData(() => newProfile)


    }

    return {
        currentlyEditingProfileId,
        updateCurrentlyEditingProfileId,
        setNewEditingProfile,
        editingProfileData
    }

}

const useConfigAccountID = () => {
    const [accountID, updateAccountID] = useState<number[]>([]);
    const setNewAccountIdArray = (profile: Type_Profile) => {
        updateAccountID(() => {
            const accountIdValue: number[] | undefined = dotProp.get(profile, 'statSettings.account_id')
            return (accountIdValue) ? accountIdValue : [];
        })
    }

    return {
        accountID,
        updateAccountID,
        setNewAccountIdArray
    }

}

const fetchReservedFundsUpdate = async (key: string, secret: string, mode: string, updateReservedFunds: CallableFunction, reservedFunds: Type_ReservedFunds[]) => {
    // @ts-ignore
    const accountSummary = await electron.api.getAccountData(key, secret, mode)

    if (accountSummary !== undefined || accountSummary.length > 0) {
        updateReservedFunds((prevState: Type_ReservedFunds[]) => {

            // new data coming in, removing the dups from the array
            const filteredAccountData = removeDuplicatesInArray(accountSummary, 'id')
            // console.log(filteredAccountData)

            // checking to see if any reserved funds exist
            if (prevState.length === 0 || prevState === []) {
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

        })
    }

}

const useConfigReservedFunds = () => {
    const [reservedFunds, updateReservedFunds] = useState<Type_ReservedFunds[]>([]);
    const setNewReservedFunds = (profile: Type_Profile) => {
        updateReservedFunds(() => {
            const reservedFundsArray: Type_ReservedFunds[] | undefined = dotProp.get(profile, 'statSettings.reservedFunds')
            return (reservedFundsArray) ? reservedFundsArray : [];
        })
    }

    return {
        reservedFunds,
        updateReservedFunds,
        setNewReservedFunds,
        fetchReservedFundsUpdate
    }
}

const returnProfileById = (profileId: string) => {
    //    const [allProfiles, updateAppProfiles] = useState<Type_Profile>(defaultProfile)
    const configState = useGlobalState();
    const { config } = configState;
    return config.profiles[profileId];
}

// const useEditingProfile = () => {
//     const [currentlyEditingProfile, updateCurrentlyEditingProfile] = useState('');

//     return {
//         currentlyEditingProfile,
//         updateCurrentlyEditingProfile
//     }


//     return {
//         editingProfileData: returnProfileById(currentlyEditingProfile),
//         currentlyEditingProfile,
//         updateCurrentlyEditingProfile,
//     }
// }
const updateProfileConfig = (profileId: string, data: {}) => {

    console.log({ profileId, data })

    // accepts profile ID, filters the config based on this
    // updates the needed fields in the config state
    // pushes a force config update.

    // const configState = useGlobalState();
    // const { updateConfig } = configState;

    // updateConfig( (prevState:TconfigValues) => {

    //     const newState = {...prevState};

    //     newState.profiles[profileId] = {
    //         ...prevState.profiles[profileId],
    //         ...data
    //     };


    //     return {...newState}
    // })
}




export {
    returnCurrentProfile,
    updateProfileConfig,
    returnProfileById,
    useConfigDate,
    useProfileState,
    useConfigApiData,
    useConfigCurrency,
    useConfigAccountID,
    useConfigReservedFunds,
    // useEditingProfile
    useConfigCurrentlyEditing

}