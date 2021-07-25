import React, { createContext, useState, useEffect } from 'react';
import dotProp from 'dot-prop';
import { sub, getTime } from 'date-fns'
// const GlobalStateContext = React.createContext();
// const GlobalDispatchContext = React.createContext();
const ConfigContext = createContext();

import { defaultConfig } from '../utils/defaultConfig';

// finding the data that exists based on the dotprop.
const findData = (config, path) => {
    console.log('running find data')
    console.log({ config, path })
    if (dotProp.has(config, path)) return dotProp.get(config, path)
    return ""
}


const ConfigProvider = ({ children }) => {
    const [ config, updateConfig ] = useState(() => defaultConfig)
    const [ date , updateDate ] = useState('')
    const [ apiData, updateApiData ] = useState({key: '', secret: ''})
    const [ currency, updateCurrency ] = useState()
    const [ accountID, updateAccountID ] = useState();



    // responsible for getting the config from electron and updating it in the state
    const getConfig = async () => {
        electron.config.get()
            .then(config => {
                updateConfig(config)

                const api = {
                    key: dotProp.get(config, 'apis.threeC.key'),
                    secret: dotProp.get(config, 'apis.threeC.secret') 
                }
        
                updateCurrency( dotProp.get(config, 'general.defaultCurrency') )
                updateApiData( api )
                updateAccountID(dotProp.get(config, 'statSettings.account_id') )

            })
    }

    const setConfigBulk = async () => {
        console.log('Setting the config')

        updateConfig((prevConfig) => {

            const keys = {
                key: apiData.key,
                secret: apiData.secret,
            }

            const statSettings = {
                account_id: accountID,
                startDate: date
            }

            // prevConfig.general.defaultCurrency = currency;
            prevConfig.statSettings = statSettings;
            prevConfig.apis.threeC = keys


            // sending the config over to Electron and returning the response
            electron.config.bulk(prevConfig)
            return prevConfig

        })
    }

    // reset button is confirmed working at the moment.
    const reset = () => {

        updateConfig(prevConfig => {
            const newConfig = {...defaultConfig}
            console.log('reset the config!!')
            electron.config.reset(newConfig)
    
            const api = {
                key: newConfig.apis.threeC.key,
                secret: newConfig.apis.threeC.key
            }
    
            updateCurrency( newConfig.general.defaultCurrency )
            updateApiData( api )
            updateAccountID( newConfig.statSettings.account_id  )

            return newConfig
        })


        
    }

    useState( () => {
        getConfig()
    }, [])

    useEffect(() => {
        // console.log({config}, 'yolo')
        // console.log()
        if(config && dotProp.has(config,'general.defaultCurrency')) {
            console.log('ran this')
            updateCurrency(dotProp.get(config,'general.defaultCurrency'))
        }

        if(config && dotProp.has(config,'apis.threeC')) {
            console.log('Updated threeC')
            updateApiData(dotProp.get(config,'apis.threeC'))
        }

        if(config && dotProp.has(config,'statSettings.account_id')) {
            console.log('Updated threeC')
            updateAccountID(dotProp.get(config,'statSettings.account_id'))
        }
    }, [config])


    return (
        <ConfigContext.Provider
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