import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { TextField, Autocomplete } from '@mui/material';

const removeCoinsWarning = (
  <p style={{ fontWeight: 300, margin: 'auto' }}>
    Remove a coin to add another.
  </p>
);
type AddCoinsType = {
  selectedCoins: string[],
  coinNames: string[],
  inputValue: string,
  changeInputValue: Function,
  addCoin: Function,
};

const AddCoinDiv: React.FC<AddCoinsType> = ({
  selectedCoins, coinNames, inputValue, changeInputValue, addCoin,
}) => (
  <div className="addCoinDiv flex-row">
    {
      (selectedCoins.length >= 5)
        ? removeCoinsWarning
        : (
          <>
            <Autocomplete
              options={['', ...coinNames]}
              style={{
                flexBasis: '90%',
                marginRight: '2em',
                color: 'var(--color-text-lightbackground)',
              }}
              value={inputValue}
              // @ts-ignore
              onChange={(e) => changeInputValue(e.target?.innerText)}
              renderInput={(params) => (
                <TextField
                  id={params.id}
                  inputProps={params.inputProps}
                  ref={params.InputProps.ref}
                  label="Add Coin"
                  variant="outlined"
                  autoFocus
                />
              )}
            />
            <AddIcon
              style={{
                flexBasis: '10%',
                cursor: 'pointer',

              }}
              onClick={() => {
                addCoin();
              }}
            />
          </>
        )
    }
  </div>
);

export default AddCoinDiv;
