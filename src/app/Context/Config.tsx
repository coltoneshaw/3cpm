import React, { createContext, useState, useEffect } from 'react';
import dotProp from 'dot-prop';
import { sub, getTime } from 'date-fns'

// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const ConfigContext = createContext<Type_ConfigContext>();

interface Type_currency {
    name: string
    value: string
}


// pulling in the default config from the config store for use once it's been reset.
import { defaultConfig } from '@/utils/defaultConfig'
import { TconfigValues } from '@/types/config'


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
    }
}



const ConfigProvider = ({ children }: any) => {
    const [config, updateConfig] = useState<TconfigValues>(() => defaultConfig)

    // setting the default state to be 90 days in the past.
    const [date, updateDate] = useState(() => getTime(sub(new Date(), { days: 90 })))
    const [apiData, updateApiData] = useState({ key: '', secret: '' })
    const [currency, updateCurrency] = useState<string[]>(["USD"])
    const [accountID, updateAccountID] = useState<number[]>([]);

    const setNewCurrency = (config: TconfigValues) => {
        updateCurrency(() => {
            const newCurrency: string[] | undefined = dotProp.get(config, 'general.defaultCurrency')
            return (newCurrency) ? newCurrency : ["USD"]
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
            return (startDate) ? startDate : 0;
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


            })
    }

    const setConfigBulk = async () => {
        console.log('Setting the config')

        await updateConfig((prevConfig: TconfigValues) => {


            prevConfig.general.defaultCurrency = currency;

            prevConfig.statSettings.account_id = (accountID) ? accountID : [];
            prevConfig.statSettings.startDate = (date) ? date : 0;

            prevConfig.apis.threeC = {
                key: apiData.key,
                secret: apiData.secret,
            }

            // @ts-ignore
            // sending the config over to Electron and returning the response
            electron.config.bulk(prevConfig)
            return prevConfig

        })

        alert('Config has been updated! If you adjusted filers make sure to reload the data and click "refresh chart data".')
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

            return newConfig
        })
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
                    apiData
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