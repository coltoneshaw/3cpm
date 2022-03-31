import React, { useState, useLayoutEffect } from 'react';

import {
  FormControl,
  MenuItem,
  Select,
  ListItemText,
  Checkbox,
} from '@mui/material';

import { setStorageItem, getStorageItem, storageItem } from 'webapp/Features/LocalStorage/LocalStorage';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 8 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type TypeColumnSelector = {
  columns: { id: string, name: string }[],
  selectedColumns: string[],
  handleChange: CallableFunction
};

const useColumnSelector = (incomingColumns: { id: string, name: string }[], name: 'BotPlanner' | 'DealsTable') => {
  const [columns] = useState(() => incomingColumns);
  const [selectedColumns, updateSelectedColumns] = useState(() => incomingColumns.map((c) => c.id));
  const localStorageSortName = storageItem.tables[name].columns;

  useLayoutEffect(() => {
    const storageColumns = getStorageItem(localStorageSortName);
    updateSelectedColumns(storageColumns ?? incomingColumns.map((c) => c.id));
  }, []);

  const handleChange = (updatedColumns: string[]) => {
    updateSelectedColumns(updatedColumns);
    setStorageItem(localStorageSortName, updatedColumns);
  };

  return {
    columns,
    selectedColumns,
    handleChange,
  };
};

const ColumnSelector: React.FC<TypeColumnSelector> = ({ columns, selectedColumns, handleChange }) => {
  const onChange = (e: any) => handleChange(e?.target?.value);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <FormControl style={{ width: '250px', padding: 0 }} fullWidth>
      <Select
        multiple
        id="select_columns"
        value={selectedColumns}
        renderValue={() => 'Select Columns'}
        onChange={onChange}
        style={{
          marginRight: '15px',
          width: '100%',
          height: '36px',
        }}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        MenuProps={MenuProps}
      >
        {columns.map((c) => (
          <MenuItem value={c.id} key={c.id}>
            <Checkbox checked={selectedColumns.indexOf(c.id) > -1} />
            <ListItemText primary={c.name} />
          </MenuItem>
        ))}

      </Select>
    </FormControl>
  );
};

export {
  ColumnSelector,
  useColumnSelector,
};
