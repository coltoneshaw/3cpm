import React, { useState, useEffect } from 'react';
// import { QueryBotsType } from '@/types/3CommasApi';
// import { ReservedFundsType } from '@/types/config';
import type { BotTableTypes } from '@/app/Pages/BotPlanner/Components/tableTypes';
import type { SettingTableTypes } from '@/app/Pages/Settings/Components/types';

type BotTable = BotTableTypes['cell'] & {
  handleEditCellChangeCommitted: BotTableTypes['handleEditCellChangeCommitted']
};

type SettingsTable = SettingTableTypes['cell'] & {
  handleEditCellChangeCommitted: SettingTableTypes['handleEditCellChangeCommitted']
};

const BotsEditableCell: React.FC<BotTable> = ({
  value: initialValue,
  row: { original },
  column: { id: column },
  handleEditCellChangeCommitted, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(String(initialValue));
  const [size, setSize] = useState(() => String(initialValue).length * 1.5);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (column === 'take_profit') inputValue = e.target.value.slice(0, -1);
    // if (column == 'max_safety_orders') inputValue = e.target.value.slice(0, -4)
    setValue(inputValue);
    setSize(e.target.value.length);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    handleEditCellChangeCommitted(Number(original.id), column, value);
  };

  const ending = () => {
    if (column === 'take_profit') return '%';
    return '';
  };

  useEffect(() => {
    setSize(String(value).length * 1.5);
  }, [value, initialValue]);

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(String(initialValue));
  }, [initialValue]);

  return (
    <input
      className="dataTableInput"
      value={value + ending()}
      onChange={onChange}
      onBlur={onBlur}
      size={size}
      style={{ textAlign: 'center', width: '92%' }}
    />
  );
};

// Create an editable cell renderer
const SettingsEditableCell: React.FC<SettingsTable> = ({
  value: initialValue,
  row: { original },
  column: { id: column },
  handleEditCellChangeCommitted, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(String(initialValue));
  // const [size, setSize] = useState(() => String(initialValue).length * 1.5)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    handleEditCellChangeCommitted(original.id, column, value);
  };

  useEffect(() => {
    setValue(String(initialValue));
  }, [initialValue]);

  return (
    <input
      className="dataTableInput"
      type="number"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={{ textAlign: 'center', color: 'var(--color-text-lightbackground)' }}
    />
  );
};

export { SettingsEditableCell, BotsEditableCell };
