import React, { useState } from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListItemText,
  Checkbox,
  ListSubheader,
} from '@mui/material';
import { supportedCurrencies } from '@/utils/granularity';
import { logToConsole } from '@/utils/logging';

import { DefaultCurrency } from '@/types/config';

const returnCurrencyMenuItems = (currencyArray: typeof supportedCurrencies) => {
  const usd: (typeof supportedCurrencies.USD)[] = [];
  const crypto: (typeof supportedCurrencies.USD)[] = [];

  Object.keys(currencyArray).forEach((currency) => {
    if (Object.prototype.hasOwnProperty.call(currencyArray, currency)) {
      const tempCurrency = currencyArray[currency as keyof typeof supportedCurrencies];
      if (tempCurrency.type === 'usd') {
        usd.push(tempCurrency);
      } else {
        crypto.push(tempCurrency);
      }
    }
  });

  return {
    usd,
    crypto,
  };
};

type TypeAllCurrencySelector = {
  defaultCurrency: DefaultCurrency,
  updateCurrency: CallableFunction
};

const AllCurrencySelector: React.FC<TypeAllCurrencySelector> = ({ defaultCurrency, updateCurrency }) => {
  const [selectedCurrency, updateSelectedCurrency] = useState(defaultCurrency);
  const updateTempCurrency = (newCurrency: DefaultCurrency) => {
    updateCurrency(newCurrency);
    updateSelectedCurrency(newCurrency);
  };

  const { usd, crypto } = returnCurrencyMenuItems(supportedCurrencies);
  const onChange = (e: any) => {
    if (e.target.value.some((cur: string) => !Object.keys(supportedCurrencies).includes(cur))) {
      logToConsole('error', 'No matching currency code found.');
      return;
    }

    updateTempCurrency([...e.target.value]);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <FormControl style={{ width: '100%', marginBottom: '25px' }} fullWidth>
      <InputLabel id="currency-label">Currency</InputLabel>
      <Select
        labelId="currency-label"
        multiple
        id="currency"
        name="currency"
        label="Currency"
        value={selectedCurrency}
        onChange={onChange}
        renderValue={() => ((selectedCurrency.length > 0) ? selectedCurrency.join(', ') : '')}
        style={{
          marginRight: '15px',
          width: '100%',
        }}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <ListSubheader> USD</ListSubheader>

        {usd.map((c) => (
          <MenuItem value={c.value} key={c.value}>
            {/* @ts-ignore */}
            <Checkbox checked={selectedCurrency.indexOf(c.value) > -1} />
            <ListItemText primary={`${c.value} (${c.name})`} />
          </MenuItem>
        ))}

        <ListSubheader>Crypto</ListSubheader>
        {crypto.map((c) => (
          <MenuItem value={c.value} key={c.value} style={{ height: '54px' }}>
            {/* @ts-ignore */}
            <Checkbox checked={selectedCurrency.indexOf(c.value) > -1} />
            <ListItemText primary={`${c.value} (${c.name})`} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AllCurrencySelector;
