import React, { createContext, useState, useEffect, SetStateAction} from 'react';
import dotProp from 'dot-prop';
import { v4 as uuidv4 } from 'uuid'
import { 
    configDate, 
    configApiData,
    configCurrency,
    configAccountID,
    configReservedFunds } from "@/app/Context/Config/HelperFunctions";

import { TconfigValues, Type_Profile, Type_ConfigContext } from '@/types/config'



// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const ConfigContext = createContext<Type_ConfigContext>();


// pulling in the default config from the config store for use once it's been reset.
import {defaultConfig, defaultProfile} from '@/utils/defaultConfig'



const ConfigProvider = ({ children }: any) => {

    const [config, updateConfig] = useState<TconfigValues>(defaultConfig);


    const {date, updateDate, setNewStatDate} = configDate();
    const {apiData, setNewApiKeys, updateApiData} = configApiData();
    const {currency, updateCurrency, setNewCurrency} = configCurrency();
    const {accountID, updateAccountID, setNewAccountIdArray} = configAccountID();
    const {reservedFunds, updateReservedFunds, setNewReservedFunds, fetchReservedFundsUpdate} = configReservedFunds();
    const fetchAccountsForRequiredFunds = async (key:string, secret:string, mode:string) =>  await fetchReservedFundsUpdate(key, secret, mode, updateReservedFunds, reservedFunds)

    // current profile config values.
    const [currentProfile, updateCurrentProfile] = useState<Type_Profile>(defaultProfile);
    const [initialConfigLoaded, updateInitialConfigLoaded] = useState<boolean>(false)

    // string ID that represents the uuid of the current profile.
    const [currentProfileId, updateCurrentProfileId ] = useState('')
    

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