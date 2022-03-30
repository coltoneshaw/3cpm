import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';

import AddCoinDiv from './Components/AddCoinDiv';
import { setStorageItem, storageItem } from '@/webapp/Features/LocalStorage/LocalStorage';

import { useThemeProvidor } from '@/webapp/Context/ThemeEngine';

type CoinModalProps = {
  open: boolean,
  setOpen: any,
  coinNames: string[],
  currentCoins: {
    selectedCoins: string[],
    updateSelectedcoins: any
  }
};

const AddCoinModal: React.FC<CoinModalProps> = ({
  open, setOpen, coinNames, currentCoins,
}) => {
  // make this version handler use the version that the user is using.

  const [inputValue, changeInputValue] = useState('');

  const { selectedCoins, updateSelectedcoins } = currentCoins;

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useThemeProvidor();
  const { styles } = theme;

  // 1. Show existing coins in the header
  // 2. give ability to delete these coins

  // 3. add a search for new coins that uses the coins returned from binance and possibly a dynamic filter
  // 4. Save the coin to the header and to the localData

  const deleteCoin = (coin: string) => {
    updateSelectedcoins((prevState: string[]) => {
      const updatedCoins = prevState.filter((c) => c !== coin);

      setStorageItem(storageItem.settings.coinPriceArray, updatedCoins);
      return updatedCoins;
    });
  };

  const addCoin = () => {
    changeInputValue((selectedValue) => {
      updateSelectedcoins((prevState: string[]) => {
        const updatedCoins = [...prevState, selectedValue];
        setStorageItem(storageItem.settings.coinPriceArray, updatedCoins);
        return updatedCoins;
      });
      return '';
    });
  };

  return (
    <Dialog
      fullWidth={false}
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      style={{
        color: 'var(--color-text-lightbackground)',
        padding: 0,
        ...styles,

      }}
    >
      <DialogContent style={{ padding: 0 }}>
        <div className="flex-row addCoinModal">
          <CloseIcon className="closeIcon" onClick={handleClose} />
          <div
            className="flex-column"
            style={{ width: '100%' }}
          >
            <h2 style={{ textAlign: 'center' }}>Coins</h2>
            {selectedCoins.map((coin) => (
              <div
                className="flex-row selectedCoinDiv"
                key={coin}
              >
                <p style={{ flexBasis: '90%' }}>{coin}</p>
                <Delete
                  style={{
                    flexBasis: '10%',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    deleteCoin(coin);
                  }}
                />
              </div>
            ))}
            <AddCoinDiv
              selectedCoins={selectedCoins}
              coinNames={coinNames}
              inputValue={inputValue}
              changeInputValue={changeInputValue}
              addCoin={addCoin}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoinModal;
