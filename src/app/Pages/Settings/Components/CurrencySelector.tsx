import React, { useState, useEffect } from 'react';

import { useAppSelector } from '@/app/redux/hooks';
import { configPaths } from '@/app/redux/configSlice'
import { updateNestedEditingProfile } from '@/app/redux/configActions';
import { formatCurrency, supportedCurrencies } from '@/utils/granularity'

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

const CurrencySelector = () => {

    const profile = useAppSelector(state => state.config.editingProfile);
    const [currency, updateCurrency] = useState<(keyof typeof supportedCurrencies)[]>([])

    useEffect(() => {

        //@ts-ignore
        if (profile.general.defaultCurrency) updateCurrency(profile.general.defaultCurrency)

    }, [profile])


    const onChange = (e: any) => {
        if( e.target.value.some( (cur:string) => !Object.keys(supportedCurrencies).includes(cur) )){
            console.error('No matching currency code found.')
            return false
        }
        updateCurrency([...e.target.value])
        updateNestedEditingProfile([...e.target.value], configPaths.general.defaultCurrency)
    }

    return (
        <FormControl style={{ width: '100%', marginBottom: '25px' }} fullWidth>
            <InputLabel id="currency-label">Stat / Metric Currency</InputLabel>
            <Select
                labelId="currency-label"
                multiple
                id="currency"
                name="currency"
                label="Stat / Metric Currency"
                value={currency}
                onChange={onChange}
                renderValue={() => (currency.length > 0) ? currency.join(', ') : ""}
                style={{
                    marginRight: '15px',
                    width: '100%'
                }}
            >
                {Object.keys(supportedCurrencies).sort().map((c: string) => {
                    const currencyOption = supportedCurrencies[c as keyof typeof supportedCurrencies]
                    return (
                        <MenuItem value={currencyOption.value} key={currencyOption.value}>

                            {/* 
                                TODO - need to fix the type below
                            */}
                            {/*  @ts-ignore */}
                            <Checkbox checked={currency.indexOf(currencyOption.value) > - 1} />
                            <ListItemText primary={currencyOption.value + ` (${currencyOption.name} - ${currencyOption.type})`} />
                        </MenuItem>
                    )

                }

                )}
            </Select>
        </FormControl>
    )

}

export default CurrencySelector