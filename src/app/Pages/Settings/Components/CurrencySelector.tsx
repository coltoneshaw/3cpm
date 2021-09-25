import React, { useState, useEffect } from 'react';

import { useAppSelector } from '@/app/redux/hooks';
import { configPaths } from '@/app/redux/configSlice'
import { updateNestedEditingProfile } from '@/app/redux/configActions';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ListItemText,
    Checkbox,
    Input
} from '@mui/material';

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
    },
    {
        name: "ETH",
        value: "ETH"
    },
    {
        name: "BTC",
        value: "BTC"
    },
    {
        name: "EUR",
        value: "EUR"
    }
]

const CurrencySelector = () => {

    const profile = useAppSelector(state => state.config.editingProfile);
    const [currency, updateCurrency] = useState(() => [''])

    useEffect(() => {
        if (profile.general.defaultCurrency) updateCurrency(profile.general.defaultCurrency)

    }, [profile])


    const onChange = (e: any) => {
        updateCurrency([...e.target.value])
        updateNestedEditingProfile([...e.target.value], configPaths.general.defaultCurrency)
    }

    return (
        <FormControl style={{ width: '100%', marginBottom: '25px' }} fullWidth>
            <InputLabel id="currency-label">Currency</InputLabel>
            <Select
                labelId="currency-label"
                multiple
                id="currency"
                name="currency"
                label="Currency"
                value={currency}
                onChange={onChange}
                renderValue={() => (currency.length > 0) ? currency.join(', ') : ""}
                style={{
                    marginRight: '15px',
                    width: '100%'
                }}
            >
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