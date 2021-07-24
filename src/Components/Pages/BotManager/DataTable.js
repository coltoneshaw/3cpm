import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Switch from '@material-ui/core/Switch';

import { useGlobalData } from '../../../Context/DataContext';

// handleEditCellChangeCommitted = (e) => {

//   let newRows = this.state.rows.map(row => {
//       if (e.id == row.id) {
//           row[e.field] = e.props.value
//           console.log(`changed ${e.field} to ${e.props.value}`)

//       }
//       return row
//   })
//   this.setState({ rows: newRows })
// }



/**
 * TODO
 * - Wire up bot save. This will need to detect the differences between the states and submit that as an API call.
 */
const DataTable = ({classes}) => {

  const state = useGlobalData();
  const { data: { botData}  } = state;

  const [ localBotData, updateLocalBotData ] = useState([{test:'test', id:'1'}])

  useEffect(() => {
    updateLocalBotData(botData)
  }, [botData])



  // handling this locally becauase it does not need to be saved yet.
  const handleOnOff = (e) => {
    let newRows = localBotData.map(row => {
        if (e.target.name == row.id) {
            row.is_enabled = !row.is_enabled
        }
        return row
    })
    updateLocalBotData(newRows)
  }

  const columns = [
    {
      field: 'is_enabled', headerName: 'Enabled?', flex: .75, headerAlign: 'center', align: 'center', sortable: true, renderCell: (params) => (

        <Switch
          checked={params.row.is_enabled}
          color="primary"
          onClick={handleOnOff}
          name={params.row.id.toString()}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      )
    },
    { field: 'name', headerName: 'Name', editable: true, flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'pairs', headerName: 'Pairs', flex: 1, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'take_profit', headerName: 'TP', description: "Take Profit", editable: true, flex: .5, headerAlign: 'center', align: 'center', valueFormatter: (params) => { return `${params.value} %` } },
    { field: 'base_order_volume', headerName: 'BO', description: "Buy Order", editable: true, flex: .5, headerAlign: 'center', align: 'center' },
    { field: 'safety_order_volume', headerName: 'SO', description: "Safety Order", editable: true, flex: .5, headerAlign: 'center', align: 'center' },
    { field: 'max_safety_orders', headerName: 'Max SO', description: "Max Safety Orders", editable: true, flex: .75, headerAlign: 'center', align: 'center', valueFormatter: (params) => { return `${params.value} SOs` } },
    { field: 'safety_order_step_percentage', headerName: 'SOS', editable: true, description: "Price deviation to open safety orders (% from initial order)", flex: .5, headerAlign: 'center', align: 'center' },
    { field: 'martingale_volume_coefficient', headerName: 'OS', editable: true, description: "Safety order volume scale", flex: .5, headerAlign: 'center', align: 'center' },
    { field: 'martingale_step_coefficient', headerName: 'SS', editable: true, description: "Safety order step scale", flex: .5, headerAlign: 'center', align: 'center' }
  ];


  return (

    <div style={{ display: 'flex' }} className="boxData">
      <div className="dataTable"  >
        <DataGrid
          className={classes.root}
          hideFooter={true}
          rows={localBotData}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          // onEditCellChangeCommitted={handleEditCellChangeCommitted}
        />
      </div>
    </div>

  );
}




export default DataTable;
