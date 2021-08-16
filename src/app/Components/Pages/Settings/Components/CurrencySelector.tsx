import React, { useContext, useState, useEffect } from 'react';

import { ConfigContext, useGlobalState } from '@/app/Context/Config';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ListItemText,
    Checkbox,
    Input
} from '@material-ui/core';

// initializing a state for each of the two props that we are using.
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Type_currency {
    name: string
    value: string
}

const currencyArray: Type_currency[] = [
    {
        name: "USD",
        value: "USD",
    },
    {
        name: "USDT",
        value: "USDT",
    },
    {
        name: "BUSD",
        value: "BUSD",
    },
    {
        name: "USDC",
        value: "USDC",
    },
    {
        name: "GBP",
        value: "GBP"
    }
]

const CurrencySelector = () => {

    const state = useGlobalState()

    const { config, state: { currency, updateCurrency } } = state

    const onChange = (e: any) => {
        updateCurrency([...e.target.value])
        // console.log(`Changing the default currency from ${config.general.defaultCurrency} to ${e.target.value}`)
    }

    const returnCurrencyValues = (currencyData: Type_currency[], currencyArray: string[]) => {
        return currencyData.filter(e => currencyArray.includes(e.value)).map(e => e.name).join(', ')
    }


    return (

        <FormControl style={{width: "100%"}}>
            <InputLabel>Currency</InputLabel>


            <Select
                multiple
                value={currency}
                onChange={onChange}
                input={<Input />}
                // style={{width: "100%"}}
                // @ts-ignore
                renderValue={() => (currency.length > 0) ? returnCurrencyValues(currencyArray, currency) : ""}
                MenuProps={MenuProps}
                style={{padding: "10px 0 10px 0", marginLeft: "10px"}}
            >
                {/* Need to think through All because it's now a selector. */}
                {/* <MenuItem value=""></MenuItem> */}

                {currencyArray.map((c) => (
                    <MenuItem value={c.value} key={c.value}>
                        <Checkbox checked={currency.indexOf(c.name) > - 1} />
                        <ListItemText primary={c.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )

}

export default CurrencySelector