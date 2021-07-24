import React, { useContext, useState, useEffect }from 'react';
import dotProp from 'dot-prop';

import { ConfigContext, useGlobalState } from '../../../../Context/Config';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@material-ui/core';



const currencyArray = [
    {
        name: "USD",
        value: "USD",
        key: 1
    },
    {
        name: "BTC",
        value: "BTC",
        key: 2
    },
    {
        name: "ETH",
        value: "ETH",
        key: 3

    }
]

const CurrencySelector = () => {

    const state = useGlobalState()

    const { refs: { currencySelector }, config , currencySelectorState, updateCurrency} = state

    const test = (t) => {
        if(dotProp.has(t, 'general.defaultCurrency')) return t.general.defaultCurrency
        return ""
    }

    // const [ config, updateConfig ] = useState()
    const [ select, changeSelect ] = useState(() => test(config))


    
    // useEffect(() =>{
    //     changeSelect(test(config));
    // }, [config])


    //  useEffect(()=>{
    //     changeSelect(test(configSet));
    //     console.log('the state config has changed!!!!!!!!!!!!!!!')        
    //  },[configSet]);


     const onChange = (e) => {
        updateCurrency(e.target.value)
        changeSelect(e.target.value)
        console.log(config.general.defaultCurrency)
        // console.log(configSet.general.defaultCurrency)
     }


    return (

        <FormControl >
            <InputLabel>Currency</InputLabel>
            {/* <h2>{context.config} </h2> */}
            <Select
                value={select}
                inputRef={currencySelector}
                defaultValue={currencySelectorState}
                onChange={onChange}
            >
                {currencyArray.map(currency => <MenuItem value={currency.value} key={currency.key}>{currency.name}</MenuItem>)}

            </Select>
        </FormControl>
    )

}

export default CurrencySelector