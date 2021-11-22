import React, { useState } from 'react';
import { Type_ReservedFunds } from '@/types/config';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ListItemText,
    Checkbox,
} from '@mui/material';

type AccountSelector = {
    reservedFunds: Type_ReservedFunds[],
    updateAccounts: CallableFunction
}
const AccountSelector = ({reservedFunds, updateAccounts}:AccountSelector) => {
    const [selectedAccounts, updateSelectedAccounts] = useState(reservedFunds);
    const [selectedAccountIds, updateSelectedAccountIds] = useState<number[]>(() => reservedFunds.filter(a => a.is_enabled).map(a => a.id));
    const updateTempAccounts = (newAccounts: number[]) => {
        const selected = reservedFunds.filter(a => newAccounts.includes(a.id))
        updateAccounts(selected)
        updateSelectedAccounts(selected)
        updateSelectedAccountIds(newAccounts)
    }

    const onChange = (e: any) => {
        updateTempAccounts([...e.target.value])
    }


    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    return (
        <FormControl style={{ width: '100%', marginBottom: '25px' }} fullWidth>
            <InputLabel id="currency-label">Accounts</InputLabel>
            <Select
                labelId="account-label"
                multiple
                id="accounts"
                name="accounts"
                label="Accounts"
                value={selectedAccountIds}
                onChange={onChange}
                renderValue={() => (selectedAccounts.length > 0) ? selectedAccounts.map(a => a.account_name).join(', ') : ""}
                style={{
                    marginRight: '15px',
                    width: '100%'
                }}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
            >
                {reservedFunds.map(c => {
                    return (
                        <MenuItem value={c.id} key={c.id}>
                            <Checkbox checked={selectedAccountIds.indexOf(c.id) > - 1} />
                            <ListItemText primary={c.account_name + ` (${c.account_name})`} />
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl >

    )
}

export default AccountSelector;