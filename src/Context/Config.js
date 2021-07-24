import React, { createContext, useState, useEffect } from 'react';
import dotProp from 'dot-prop';
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
    const [ date , updateDate ] = useState('')


    let apiKey = React.createRef();
    let apiSecret = React.createRef();
    let currencySelector = React.createRef();
    let startDatePicker = React.createRef();
    let accountIDPicker = React.createRef()


    // responsible for getting the config from electron and updating it in the state
    const getConfig = async () => {
        const config = await electron.config.get()
        updateConfig(config)
    }

    const setConfigBulk = async () => {
        console.log('Setting the config')

        updateConfig((prevConfig) => {

            console.log({startDatePicker, accountIDPicker})

            let newConfig = prevConfig

            const keys = {
                key: apiKey.current.value,
                secret: apiSecret.current.value,
            }

            const statSettings = {
                account_id: accountIDPicker.current.value,
                startDate: date
            }


            dotProp.set(newConfig, 'general.defaultCurrency', currencySelector.current.value)
            dotProp.set(newConfig, 'statSettings', statSettings)
            dotProp.set(newConfig, 'apis.threeC', keys)

            // sending the config over to Electron and returning the response
            electron.config.bulk(newConfig)
            return newConfig

        })
    }


    // reset button is confirmed working at the moment.
    const reset = () => {
        console.log('reset the config!!')
        electron.config.reset(defaultConfig)
        updateConfig(defaultConfig)

        // currencySelector.current.value = "USD"
        apiKey.current.value = dotProp.get(defaultConfig, 'apis.threeC.key')
        apiSecret.current.value = dotProp.get(defaultConfig, 'apis.threeC.secret')
    }

    const [config, updateConfig] = useState(() => getConfig())


    return (
        <ConfigContext.Provider
            value={{
                config,
                updateConfig,
                setConfigBulk,
                reset,
                date,
                updateDate,
                refs: {
                    apiKey,
                    apiSecret,
                    currencySelector,
                    startDatePicker,
                    accountIDPicker
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