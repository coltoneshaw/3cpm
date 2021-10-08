import React, { useState, useEffect } from 'react';

import { formatCurrency, supportedCurrencies } from '@/utils/granularity'

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ListItemText,
    Checkbox,
    Input,
    ListSubheader
} from '@mui/material';

const returnCurrencyMenuItems = (currencyArray: typeof supportedCurrencies) => {
    const usd: (typeof supportedCurrencies.USD)[] = [];
    const crypto: (typeof supportedCurrencies.USD)[] = [];

    for (const currency in currencyArray) {
        let tempCurrency = currencyArray[currency as keyof typeof supportedCurrencies]
        if (tempCurrency.type === 'usd') {
            usd.push(tempCurrency)
        } else {
            crypto.push(tempCurrency)
        }
    }

    return {
        usd,
        crypto
    }

}

import type { defaultTempProfile } from '@/app/Pages/Settings/Settings'

const CurrencySelector = ({ tempProfile, updateTempProfile }: { tempProfile: typeof defaultTempProfile, updateTempProfile: CallableFunction }) => {


    const updateTempCurrency = (newCurrency: any[]) => {
        updateTempProfile((prevState: typeof defaultTempProfile) => {
            let newState = { ...prevState }
            newState.defaultCurrency = newCurrency
            return newState
        })
    }

    const { usd, crypto } = returnCurrencyMenuItems(supportedCurrencies)
    const usdNames = usd.map(c => c.value)
    const onChange = (e: any) => {
        if (e.target.value.some((cur: string) => !Object.keys(supportedCurrencies).includes(cur))) {
            console.error('No matching currency code found.')
            return false
        }

        const isUSD = e.target.value.some((r: string) => usdNames.includes(r))
        if (isUSD) {
            const isAllUsd = e.target.value.every((v: string) => usdNames.includes(v));
            if (!isAllUsd) {
                updateTempCurrency([])
                return alert('Warning. You cannot mix currencies that are not USD based.')
            }
            updateTempCurrency([...e.target.value])
            return
        }

        // selecting only the last value so there are not multiple crypto currencies selected at a time.
        const selected = (e.target.value.length > 1) ? [e.target.value.pop()] : [...e.target.value];
        updateTempCurrency(selected)
    }

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    return (
        <FormControl style={{ width: '100%', marginBottom: '25px' }} fullWidth>
            <InputLabel id="currency-label">Stat / Metric Currency</InputLabel>
            <Select
                labelId="currency-label"
                multiple
                id="currency"
                name="currency"
                label="Stat / Metric Currency"
                value={tempProfile.defaultCurrency}
                onChange={onChange}
                renderValue={() => (tempProfile.defaultCurrency.length > 0) ? tempProfile.defaultCurrency.join(', ') : ""}
                style={{
                    marginRight: '15px',
                    width: '100%'
                }}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
            >
                < ListSubheader > USD</ListSubheader>


                {usd.map(c => {
                    return (
                        <MenuItem value={c.value} key={c.value}>
                            <Checkbox checked={tempProfile.defaultCurrency.indexOf(c.value as keyof typeof supportedCurrencies) > - 1} />
                            <ListItemText primary={c.value + ` (${c.name})`} />
                        </MenuItem>
                    )
                })}

                <ListSubheader>Crypto</ListSubheader>
                {crypto.map(c => {
                    return (
                        <MenuItem value={c.value} key={c.value} style={{ height: '54px' }} onClick={() => handleClose()}>
                            <ListItemText primary={c.value + ` (${c.name})`} />
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl >
    )
}

export default CurrencySelector
