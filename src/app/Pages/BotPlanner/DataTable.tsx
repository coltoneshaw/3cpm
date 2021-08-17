import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';

import { useGlobalData } from '@/app/Context/DataContext';

import { parseNumber } from '@/utils/number_formatting';
import { calc_deviation, calc_DealMaxFunds_bot, calc_maxInactiveFunds, calc_maxBotFunds, calc_dropCoverage, calc_dropMetrics } from '@/utils/formulas';

import { Type_Query_bots } from '@/types/3Commas'

import { MuiClassObject } from '@/app/Context/MuiClassObject'


/**
 * TODO
 * - Wire up bot save. This will need to detect the differences between the states and submit that as an API call.
 */

interface Type_DataTable {
  localBotData: Type_Query_bots[]
  updateLocalBotData: any
}
const DataTable = ({  localBotData, updateLocalBotData }:Type_DataTable) => {

  const state = useGlobalData()
  const classes = MuiClassObject()


  // TODO - This needs to be fixed when the other data from this is fixed.
  const { data: { metricsData: { totalBankroll } } } = state;

  // sum combines position + on_orders + available.
  const bankRoll = totalBankroll


  // handling this locally becauase it does not need to be saved yet.
  const handleOnOff = (e: any) => {
    updateLocalBotData((prevState: Type_Query_bots[]) => {
      const newRows = prevState.map((row: Type_Query_bots) => {
        if (e !== undefined && e.target !== null) {
          if (e.target.name == row.id) {
            row.is_enabled = !row.is_enabled
          }
        }
        return row
      })
      return calc_dropMetrics(bankRoll, newRows)
    })

  }

  const handleDeleteRow = (e: any) => {
    updateLocalBotData((prevState: Type_Query_bots[]) => {
      const newRows = prevState.filter(row => {
        if (e.id !== row.id) {
          return row
        }
      })
      return calc_dropMetrics(bankRoll, newRows)
    })

  }


  const handleEditCellChangeCommitted = (e: any) => {

    /**
     * 1. Identify the row that was updated (e) and the value, then update it.
     * 2. calculate the new metrics for the row.
     * 3. calculate the drop coverage for the entire thing.
     */

    updateLocalBotData((prevState: Type_Query_bots[]) => {
      const newRows = prevState.map(row => {
        if (e.id == row.id) {

          // @ts-ignore - validate props
          row[e.field] = e.value

          /**
           * TODO
           * - If it's worth it, find out what row was updated and then calculate the below metrics. There may be a few rows that we don't have to recalc metrics for.
           */

          const { max_safety_orders, base_order_volume, safety_order_volume, 
            martingale_volume_coefficient, martingale_step_coefficient, max_active_deals, 
            active_deals_count, safety_order_step_percentage } = row

          let maxDealFunds = calc_DealMaxFunds_bot(+max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient)
          let max_inactive_funds = calc_maxInactiveFunds(+maxDealFunds, +max_active_deals, +active_deals_count)
          row.max_funds = calc_maxBotFunds(+maxDealFunds, +max_active_deals)
          row.max_funds_per_deal = maxDealFunds;
          row.max_inactive_funds = max_inactive_funds;
          row.price_deviation = calc_deviation(+max_safety_orders, +safety_order_step_percentage, +martingale_step_coefficient)

        }
        return row
      })

      return calc_dropMetrics(bankRoll, newRows)


    })
  }




  const columns = [
    {
      field: 'is_enabled', headerName: 'Enabled?', flex: .75, headerAlign: 'center', align: 'center', sortable: true, renderCell: (params:any ) => (

        <Switch
          checked={params.row.is_enabled}
          color="primary"
          onClick={handleOnOff}
          name={params.row.id.toString()}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      )
    },
    { field: 'name', headerName: 'Name', editable: true, flex: 1.5, headerAlign: 'center', align: 'center' },
    { field: 'pairs', headerName: 'Pairs', editable: true, flex: 1, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'from_currency', headerName: 'Currency', editable: true, flex: .75, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'take_profit', headerName: 'TP', description: "Take Profit", editable: true, flex: .75, headerAlign: 'center', align: 'center', valueFormatter: (params:any) => { return `${params.value} %` } },
    { field: 'base_order_volume', headerName: 'BO', description: "Buy Order", editable: true, flex: .75, headerAlign: 'center', align: 'center' },
    { field: 'safety_order_volume', headerName: 'SO', description: "Safety Order", editable: true, flex: .75, headerAlign: 'center', align: 'center' },
    { field: 'max_safety_orders', headerName: 'Max SO', description: "Max Safety Orders", editable: true, flex: .75, headerAlign: 'center', align: 'center', valueFormatter: (params:any) => { return `${params.value} SOs` } },
    { field: 'safety_order_step_percentage', headerName: 'SOS', editable: true, description: "Price deviation to open safety orders (% from initial order)", flex: .75, headerAlign: 'center', align: 'center' },
    { field: 'martingale_volume_coefficient', headerName: 'OS', editable: true, description: "Safety order volume scale", flex: .75, headerAlign: 'center', align: 'center' },
    { field: 'martingale_step_coefficient', headerName: 'SS', editable: true, description: "Safety order step scale", flex: .75, headerAlign: 'center', align: 'center' },
    { field: 'max_active_deals', headerName: 'Max active deals', editable: true, description: "Max amount of deals the bot can open at a time.", flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'price_deviation', headerName: 'Deviation', editable: false, description: "This is calculated the same as 3Commas. It's the max amount of drop in the market your bot can take before it's out of SOs.", flex: .75, headerAlign: 'center', align: 'center', valueFormatter: (params:any) => { return `${params.value} %` } },
    { field: 'maxCoveragePercent', headerName: 'Coverage %', editable: false, description: "Coverage % tells you how much you can cover with a drop. This is calculated by dividing the amount of bank roll by bots and allocating an even amount for each bot.", flex: .75, headerAlign: 'center', align: 'center', valueFormatter: (params:any) => { return `${params.value} %` } },
    { field: 'maxSoReached', headerName: 'Max SO Covered', editable: false, description: "This is another way of seeing your coverage %. It's the max SO that you'll reach if you hit the max covered % listed.", flex: .75, headerAlign: 'center', align: 'center' },
    { field: 'max_funds_per_deal', headerName: 'Max funds per deal', editable: false, description: "Max funds that each deal can take.", flex: 1, headerAlign: 'center', align: 'center', valueFormatter: (params:any) => { return parseNumber(params.value) } },
    { field: 'max_funds', headerName: 'Max funds', editable: false, description: "Total Max funds that the bot can take.", flex: 1, headerAlign: 'center', align: 'center', valueFormatter: (params:any) => { return parseNumber(params.value) } },
    {
      field: 'origin', headerName: 'delete', flex: .25, headerAlign: 'center', align: 'center', sortable: true,

      renderHeader: () => <DeleteIcon />,
      renderCell: (params:any) => {
        if (params.value == "custom") {
          return (
            <DeleteIcon
              onClick={() => handleDeleteRow(params)}
            />
          )
        } else {
          return (<></>)
        }
      }
    },];


  return (

    <div style={{ display: 'flex' }} className="boxData">
      <div className="dataTable"  >
        <DataGrid
          className={classes.root}
          hideFooter={true}
          rows={localBotData}
          style={{minWidth: "1500px"}}

          // @ts-ignore
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          onCellEditCommit={handleEditCellChangeCommitted}
        />
      </div>
    </div>

  );
}




export default DataTable;
