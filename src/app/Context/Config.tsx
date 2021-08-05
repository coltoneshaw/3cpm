import React, { createContext, useState, useEffect, SetStateAction } from 'react';
import dotProp from 'dot-prop';
import { sub, getTime } from 'date-fns'
import { removeDuplicatesInArray } from '@/utils/helperFunctions';


// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const ConfigContext = createContext<Type_ConfigContext>();

interface Type_currency {
    name: string
    value: string
}


// pulling in the default config from the config store for use once it's been reset.
import { defaultConfig } from '@/utils/defaultConfig'
import { TconfigValues, Type_ReservedFunds } from '@/types/config'


interface Type_ConfigContext {
    config: TconfigValues
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
        apiData: {key: string, secret: string}
        reservedFunds: Type_ReservedFunds[],
        updateReservedFunds: any
    },
    actions: {
        fetchAccountsForRequiredFunds: any
    }
}

const defaultReserved = [{ id: 0, account_name: '', reserved_funds: 0, is_enabled: false }]


const ConfigProvider = ({ children }: any) => {
    const [config, updateConfig] = useState<TconfigValues>(() => defaultConfig)

    // setting the default state to be 90 days in the past.
    const [date, updateDate] = useState(() => getTime(sub(new Date(), { days: 90 })))
    const [apiData, updateApiData] = useState({ key: '', secret: '' })
    const [currency, updateCurrency] = useState<string[]>([])
    const [accountID, updateAccountID] = useState<number[]>([]);
    const [reservedFunds, updateReservedFunds] = useState<Type_ReservedFunds[]>([])

    const setNewCurrency = (config: TconfigValues) => {
        updateCurrency(() => {
            const newCurrency: string[] | undefined = dotProp.get(config, 'general.defaultCurrency')
            return (newCurrency) ? newCurrency : ["USD"]
        })
    }

    const setNewReservedFunds = (config: TconfigValues) => {
        updateReservedFunds( () => {
            const reservedFundsArray: Type_ReservedFunds[] | undefined = dotProp.get(config, 'statSettings.reservedFunds')
            return (reservedFundsArray) ? reservedFundsArray : [];
        })
    }

    const setNewApiKeys = (config: TconfigValues) => {
        updateApiData(() => {
            const keyValue: string | undefined = dotProp.get(config, 'apis.threeC.key');
            const secretValue: string | undefined = dotProp.get(config, 'apis.threeC.secret')
            return {
                key: (keyValue) ? keyValue : "",
                secret: (secretValue) ? secretValue : ""
            }
        });
    }

    const setNewAccountIdArray = (config: TconfigValues) => {
        updateAccountID(() => {
            const accountIdValue: number[] | undefined = dotProp.get(config, 'statSettings.account_id')
            return (accountIdValue) ? accountIdValue : [];
        })
    }

    const setNewStatDate = (config: TconfigValues) => {
        updateDate(() => {
            const startDate: number | undefined = dotProp.get(config, 'statSettings.account_id')
            return (startDate) ? startDate : getTime(sub(new Date(), { days: 90 })) ;
        })
    }


    // responsible for getting the config from electron and updating it in the state
    const getConfig = async () => {

        // @ts-ignore
        electron.config.get()
            .then((config: TconfigValues) => {
                updateConfig(config)
                setNewCurrency(config)
                setNewApiKeys(config)
                setNewAccountIdArray(config)
                setNewStatDate(config)
                setNewReservedFunds(config)


            })
    }

    const setConfigBulk = async () => {
        console.log('Setting the config')

        await updateConfig((prevConfig: TconfigValues) => {


            prevConfig.general.defaultCurrency = currency;

            prevConfig.statSettings.account_id = (accountID) ? accountID : [];
            prevConfig.statSettings.startDate = (date) ? date : 0;
            prevConfig.statSettings.reservedFunds = (reservedFunds) ? reservedFunds : [];

            // console.log(reservedFunds.filter(account => account.is_enabled).map(account => account.id))

            updateAccountID(() => {
                const accountIDs = reservedFunds.filter(account => account.is_enabled).map(account => account.id)
                if(accountIDs.length > 0){

                    return accountIDs
                } else {
                    return []
                }
            })

            prevConfig.apis.threeC = {
                key: apiData.key,
                secret: apiData.secret,
            }

            // @ts-ignore
            // sending the config over to Electron and returning the response
            electron.config.bulk(prevConfig)
            return prevConfig

        })

        // alert('Config has been updated! If you adjusted filers make sure to reload the data and click "refresh chart data".')
    }

    // reset button is confirmed working at the moment.
    const reset = () => {

        updateConfig(() => {
            const newConfig = { ...defaultConfig }
            console.log('reset the config!!')

            // @ts-ignore
            electron.config.reset()

            setNewCurrency(newConfig)
            setNewApiKeys(newConfig)
            setNewAccountIdArray(newConfig)
            setNewReservedFunds(newConfig)

            return newConfig
        })
    }

    const fetchAccountsForRequiredFunds = async () => {
        // @ts-ignore
        const accountSummary = await electron.api.getAccountData()
        console.log({accountSummary})

        if (accountSummary !== undefined || accountSummary.length > 0) {
            updateReservedFunds( prevState => {

                // @ts-ignore
                    const filteredAccountData = removeDuplicatesInArray(accountSummary, 'id')
                    console.log({filteredAccountData})
    
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
    
                    const configuredAccountIds = removeDuplicatesInArray(reservedFunds.map(account => account.id), 'id') 
    
                    // finding any accounts that did not exist since the last sync.
                    const newAcounts = filteredAccountData
                        .filter( account => !configuredAccountIds.includes(account.id) )
                        .map( account => {
                            const { id, name } = account
                            return {
                                id,
                                account_name : name,
                                reserved_funds: 0,
                                is_enabled: false
                            }
                        })
                    console.log({ newAcounts, configuredAccountIds })
    
                    return [
                        ...prevState,
                        ...newAcounts
                    ]
                
            })
        }
        
    }



    useEffect(() => {
        getConfig()
    }, [])

    useEffect(() => {

        if (config && dotProp.has(config, 'general.defaultCurrency')) {
            // console.log('ran this')
            setNewCurrency(config)
        }

        if (config && dotProp.has(config, 'apis.threeC')) {
            console.log('Updated threeC')
            setNewApiKeys(config)
        }

        if (config && dotProp.has(config, 'statSettings.account_id')) {
            console.log('Updated threeC')
            setNewAccountIdArray(config)
        }

        if (config && dotProp.has(config, 'statSettings.startDate')) {
            console.log('Updated start Date')
            setNewStatDate(config)
        }

        if (config && dotProp.has(config, 'statSettings.reservedFunds')) {
            console.log('Updated reserved funds.')
            setNewReservedFunds(config)
        }
    }, [config])


    return (
        <ConfigContext.Provider

            // @ts-ignore
            // TODO - Come back to this one!!
            value={{
                config,
                updateConfig,
                setConfigBulk,
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
                    updateReservedFunds
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