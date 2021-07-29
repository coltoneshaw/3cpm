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
        name: "USDT",
        value: "USDT",
        key: 2
    },
    {
        name: "BUSD",
        value: "BUSD",
        key: 3

    },
    {
        name: "USDC",
        value: "USDC",
        key: 4

    }
]

const CurrencySelector = () => {

    const state = useGlobalState()

    const { config, state: { currency, updateCurrency } } = state

     const onChange = (e) => {
        updateCurrency(e.target.value)
        console.log(`Changing the default currency from ${config.general.defaultCurrency} to ${e.target.value}`)
     }


    return (

        <FormControl >
            <InputLabel>Currency</InputLabel>
            <Select
                value={currency}
                // inputRef={currencySelector}
                // defaultValue={select}
                onChange={onChange}
            >
                {currencyArray.map(currency => <MenuItem value={currency.value} key={currency.key}>{currency.name}</MenuItem>)}

            </Select>
        </FormControl>
    )

}

export default CurrencySelector