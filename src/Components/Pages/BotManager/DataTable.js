import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Switch from '@material-ui/core/Switch';



class DataTable extends Component {

  

  

  


  render() {

    const { classes, data, handleOnOff, handleEditCellChangeCommitted } = this.props

    const columns = [
      {
        field: 'enabled', headerName: 'Enabled?', flex: .75, headerAlign: 'center', align: 'center', sortable: true, renderCell: (params) => (
          
          <Switch
            checked={params.row.enabled}
            color="primary"
            onClick={handleOnOff}
            name={params.row.id.toString()}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        )
      },
      { field: 'name', headerName: 'Name', editable: true, flex: 1, headerAlign: 'center', align: 'center' },
      { field: 'pairs', headerName: 'Pairs', flex: 1, headerAlign: 'center', align: 'center', sortable: true },

      { field: 'tp', headerName: 'TP', description: "Take Profit", editable: true, flex: .5, headerAlign: 'center', align: 'center', valueFormatter: (params) => { return `${params.value} %` } },
      { field: 'bo', headerName: 'BO', description: "Buy Order", editable: true, flex: .5, headerAlign: 'center', align: 'center' },
      { field: 'so', headerName: 'SO', description: "Safety Order", editable: true, flex: .5, headerAlign: 'center', align: 'center' },
      { field: 'maxSO', headerName: 'Max SO', description: "Max Safety Orders", editable: true, flex: .75, headerAlign: 'center', align: 'center', valueFormatter: (params) => { return `${params.value} SOs` } },
      { field: 'sos', headerName: 'SOS', editable: true, description: "Price deviation to open safety orders (% from initial order)", flex: .5, headerAlign: 'center', align: 'center' },
      { field: 'os', headerName: 'OS', editable: true, description: "Safety order volume scale", flex: .5, headerAlign: 'center', align: 'center' },
      { field: 'ss', headerName: 'SS', editable: true, description: "Safety order step scale", flex: .5, headerAlign: 'center', align: 'center' }
    ];

    



    return (
      <div style={{ display: 'flex' }} className="boxData">
        <div className="dataTable"  >
          <DataGrid 
            className={classes.root} 
            hideFooter={true} 
            rows={data} 
            columns={columns} 
            disableColumnFilter 
            disableColumnSelector 
            disableColumnMenu
            onEditCellChangeCommitted={handleEditCellChangeCommitted}
             />
        </div>
      </div>

    );
  }


}

export default DataTable;
