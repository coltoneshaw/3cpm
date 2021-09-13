import React, { createContext, useState, useEffect, SetStateAction} from 'react';
import dotProp from 'dot-prop';
import { sub, getTime } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { removeDuplicatesInArray } from '@/utils/helperFunctions';


// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const ConfigContext = createContext<Type_ConfigContext>();


// pulling in the default config from the config store for use once it's been reset.
import {defaultConfig, defaultProfile} from '@/utils/defaultConfig'
import { TconfigValues, Type_Profile, Type_ReservedFunds } from '@/types/config'


interface Type_ConfigContext {
    config: TconfigValues
    currentProfile: Type_Profile
    updateConfig: any
    setConfigBulk: any
    reset: any
    state: {
        accountID: number[]
        updateAccountID: any
        date: number
        updateDate: any
        currency: string[]
        updateCurrency: any
        updateApiData: any
        apiData: {key: string, secret: string, mode: string}
        reservedFunds: Type_ReservedFunds[],
        updateReservedFunds: any
        currentProfileId: string
        updateCurrentProfileId: any
    },
    actions: {
        fetchAccountsForRequiredFunds: any
    }
}



const ConfigProvider = ({ children }: any) => {
    const [config, updateConfig] = useState<TconfigValues>(defaultConfig);

    // current profile config values.
    const [currentProfile, updateCurrentProfile] = useState<Type_Profile>(defaultProfile);
    const [initialConfigLoaded, updateInitialConfigLoaded] = useState<boolean>(false)

    // string ID that represents the uuid of the current profile.
    const [currentProfileId, updateCurrentProfileId ] = useState('')
    
    // setting the default state to be 90 days in the past.
    const [date, updateDate] = useState(() => getTime(sub(new Date(), { days: 90 })))
    const [apiData, updateApiData] = useState({ key: '', secret: '', mode: 'real' })
    const [currency, updateCurrency] = useState<string[]>([])
    const [accountID, updateAccountID] = useState<number[]>([]);
    const [reservedFunds, updateReservedFunds] = useState<Type_ReservedFunds[]>([]);

    const setNewCurrency = (profile: Type_Profile) => {
        updateCurrency(() => {
            const newCurrency: string[] | undefined = dotProp.get(profile, 'general.defaultCurrency')
            return (newCurrency) ? [...newCurrency] : ["USD"]
        })
    }

    const setNewReservedFunds = (profile: Type_Profile) => {
        updateReservedFunds( () => {
            const reservedFundsArray: Type_ReservedFunds[] | undefined = dotProp.get(profile, 'statSettings.reservedFunds')
            return (reservedFundsArray) ? reservedFundsArray : [];
        })
    }

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

    const setNewAccountIdArray = (profile: Type_Profile) => {
        updateAccountID(() => {
            const accountIdValue: number[] | undefined = dotProp.get(profile, 'statSettings.account_id')
            return (accountIdValue) ? accountIdValue : [];
        })
    }

    const setNewStatDate = (profile: Type_Profile) => {
        updateDate(() => {
            const startDate: number | undefined = dotProp.get(profile, 'statSettings.startDate')
            return (startDate) ? startDate : getTime(sub(new Date(), { days: 90 })) ;
        })
    }


    // responsible for getting the config from electron and updating it in the state
    const getConfig = async () => {

        // @ts-ignore
        electron.config.get()
            .then((config: TconfigValues) => {
                if (Object.keys(config.profiles).length == 0) {
                    const id = uuidv4()
                    config.current = id
                    config.profiles[id] = {...defaultProfile}
                }

                const profile = config.profiles[config.current]
                updateCurrentProfileId(config.current)

                updateConfig(config)
                updateInitialConfigLoaded(true)

                setNewCurrency(profile)
                setNewApiKeys(profile)
                setNewAccountIdArray(profile)
                setNewStatDate(profile)
                setNewReservedFunds(profile)
            })
    }

    const setProfileBulk = async () => {
        console.log('Setting the profile')

        const accountIDs = reservedFunds.filter(account => account.is_enabled).map(account => account.id)

        if(accountIDs.length === 0 || currency.length == 0){
            alert("Please make sure you have an account and a currency enabled")
            return false
        }

        try {
            await updateConfig((prevConfig: TconfigValues) => {
                if (Object.keys(prevConfig.profiles).length == 0) {
                    const id = uuidv4()
                    prevConfig.current = id
                    prevConfig.profiles[id] = {...defaultProfile}
                }


                let profile = prevConfig.profiles[prevConfig.current];

                profile.general.defaultCurrency = currency;
                profile.statSettings.account_id = (accountID) ? accountID : [];
                profile.statSettings.startDate = (date) ? date : 0;
                profile.statSettings.reservedFunds = (reservedFunds) ? reservedFunds : [];
                profile.apis.threeC = { key: apiData.key, secret: apiData.secret, mode: apiData.mode }
                updateAccountID(() => {
                    return accountIDs.length > 0 ? accountIDs : [];
                })

                prevConfig.profiles[prevConfig.current] = profile

                // @ts-ignore
                // sending the config over to Electron and returning the response
                electron.config.bulk(prevConfig)
                return prevConfig
    
            })
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    // reset button is confirmed working at the moment.
    const reset = () => {

        updateConfig((prevConfig: TconfigValues) => {
            const newConfig = {...prevConfig}
            newConfig.current = prevConfig.current
            newConfig.profiles[prevConfig.current] =  {...defaultProfile}
            console.log('reset the config!!', newConfig.profiles[prevConfig.current])

            setNewCurrency(newConfig.profiles[newConfig.current])
            setNewApiKeys(newConfig.profiles[newConfig.current])
            setNewAccountIdArray(newConfig.profiles[newConfig.current])
            setNewReservedFunds(newConfig.profiles[newConfig.current])

            // @ts-ignore
            electron.config.bulk(newConfig)
            return newConfig
        })
    }

    const fetchAccountsForRequiredFunds = async (key:string, secret:string, mode:string) => {
        // @ts-ignore
        const accountSummary = await electron.api.getAccountData(key, secret, mode)

        if (accountSummary !== undefined || accountSummary.length > 0) {
            updateReservedFunds( ( prevState: Type_ReservedFunds[]) => {

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
                        .map( account => {
                            let { id, name } = account
                            let reserved_funds = 0;
                            let is_enabled = false;
                            
                            let filteredAccount = prevState.find(account => account.id == id)
                            if(filteredAccount != undefined ){
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



    useEffect(() => {
        getConfig()
    }, [])


    useEffect(() => {
        if (initialConfigLoaded) {
            updateCurrentProfile(config.profiles[config.current])
        }
    }, [config, initialConfigLoaded])

    // responsible for updating the config.json if the current profile ID changes.
    useEffect(() => {

        // @ts-ignore
        updateConfig(prevState => ({...prevState, current: currentProfileId}))

    }, [currentProfileId])
    

    useEffect(() => {

        if (!initialConfigLoaded) return


        [
            {path: 'general.defaultCurrency', func: setNewCurrency},
            {path: 'apis.threeC', func: setNewApiKeys},
            {path: 'statSettings.account_id', func: setNewAccountIdArray},
            {path: 'statSettings.startDate', func: setNewStatDate},
            {path: 'statSettings.reservedFunds', func: setNewReservedFunds},
        ].map(function (line) {
            if (dotProp.has(config.profiles[config.current], line.path)) {
                console.log(line.func.name)
                line.func(config.profiles[config.current])
            }
        })
    }, [config, initialConfigLoaded])


    return (
        <ConfigContext.Provider

            // @ts-ignore
            // TODO - Come back to this one!!
            value={{
                config,
                currentProfile,
                updateConfig,
                setConfigBulk: setProfileBulk,
                reset,
                state: {
                    accountID,
                    updateAccountID,
                    date,
                    updateDate,
                    currency,
                    updateCurrency,
                    updateApiData,
                    apiData,
                    reservedFunds,
                    updateReservedFunds,
                    currentProfileId,
                    updateCurrentProfileId
                },
                actions: {
                    fetchAccountsForRequiredFunds
                }
            }}>
            {children}
        </ConfigContext.Provider>
    )
}

// // export const ConfigContext
// export const ConfigProvider

const useGlobalState = () => {
    const context = React.useContext(ConfigContext);
    if (context === undefined) {
        throw new Error(
            "useGlobalState must be used within a GlobalContextProvider"
        );
    }
    return context;
};


// const useGlobalDispatch = () => {
//     const context = React.useContext(GlobalDispatchContext);
//     if (context === undefined) {
//         throw new Error(
//             "useGlobalDispatch must be used within a GlobalContextProvider"
//         );
//     }
//     return context;
// };
export { ConfigContext, ConfigProvider, useGlobalState }