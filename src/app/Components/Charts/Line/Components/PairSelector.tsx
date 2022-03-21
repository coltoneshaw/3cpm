import React, { useEffect } from 'react';
import {
  Select, InputLabel, FormControl, MenuItem, Checkbox, ListItemText, Input,
} from '@mui/material';
import { useAppSelector } from '@/app/redux/hooks';

import { setStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

type PairSelectorType = {
  pairs: { pair: string, opacity: number }[]
  pairFilters: string[]
  updatePairFilters: any
};

const PairSelector = ({ pairFilters, updatePairFilters, pairs }: PairSelectorType) => {
  const { currentProfile } = useAppSelector((state) => state.config);

  // if any part of the current profile reserved funds changes then we clear the pairs
  useEffect(() => {
    updatePairFilters([]);
    setStorageItem(storageItem.charts.pairByDateFilter, []);
  }, [currentProfile.statSettings.reservedFunds]);

  const handleChange = (event: any) => {
    let filter = event.target.value;
    // preventing more than 8 items from showing at any given time.
    if (filter.length > 8) filter = filter.filter((pair: string, index: number) => index > 0);

    updatePairFilters([...filter]);
    setStorageItem(storageItem.charts.pairByDateFilter, [...filter]);
  };

  const grid = (pairs.length <= 5) ? '1fr' : '1fr 1fr 1fr 1fr 1fr';

  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, height: '50px', zIndex: 5,
    }}
    >
      <FormControl>
        <InputLabel>Show</InputLabel>
        <Select
          variant="standard"
          multiple
          value={pairFilters}
          onChange={handleChange}
          input={<Input />}
          renderValue={() => ((pairFilters.length > 0) ? pairFilters.join() : '')}
          style={{ width: '150px' }}
          MenuProps={{
            MenuListProps: {
              style: {
                display: 'grid',
                gridTemplateColumns: grid,
              },
            },
          }}
        >
          {pairs.map((pair) => (
            <MenuItem value={pair.pair} key={pair.pair}>
              <Checkbox checked={pairFilters.indexOf(pair.pair) > -1} />
              <ListItemText primary={pair.pair} />
            </MenuItem>
          ))}

        </Select>
      </FormControl>

    </div>
  );
};

export default PairSelector;
