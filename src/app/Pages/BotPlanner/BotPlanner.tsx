import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/redux/hooks';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { DataTable, SaveButton, Risk } from './Components';
import { UpdateDataButton } from '@/app/Components/Buttons/Index'
import { ColumnSelector, useColumnSelector } from '@/app/Components/DataTable/Components';

import './BotPlanner.scss';


import { calcDropMetrics } from '@/utils/formulas'
import { Type_Query_bots } from '@/types/3Commas';

const blankObject: Type_Query_bots = {
  id: Math.random().toString(16).slice(2),
  origin: 'custom',
  name: 'edit me',
  is_enabled: false,
  hide: false,
  pairs: '',
  from_currency: 'USD',
  take_profit: 1,
  base_order_volume: 10,
  safety_order_volume: 20,
  max_safety_orders: 30,
  safety_order_step_percentage: 2,
  martingale_volume_coefficient: 1.05,
  martingale_step_coefficient: 1.0,
  max_active_deals: 1,
  max_inactive_funds: 0,
  price_deviation: 0,
  max_funds_per_deal: 0,
  max_funds: 0,
  maxCoveragePercent: 0,
  maxSoReached: 0,
  drawdown: 0,
  type: '',
  trailing_deviation: 0,
  take_profit_type: '',
  strategy: 'long',
  stop_loss_percentage: 0,
  safety_order_volume_type: 'quote_currency',
  base_order_volume_type: 'quote_currency',
  profit_currency: '',
  account_name: 'Fake Bot',
  account_id: 111111111,
  active_deals_count: 0,
  enabled_inactive_funds: 0
}

const baseColumns = ['is_enabled']

const columnList = [
  {
    id: 'hide',
    name: 'Hide?'
  },
  {
    id: 'name',
    name: 'Bot Name'
  },
  {
    id: 'pairs',
    name: 'Pairs'
  },
  {
    id: 'from_currency',
    name: 'Currency'
  },
  {
    id: 'base_order_volume',
    name: 'Buy Order (BO)'
  },
  {
    id: 'safety_order_volume',
    name: 'Safety Order (SO)'
  },
  {
    id: 'take_profit',
    name: 'Take Profit (TP)'
  },
  {
    id: 'max_safety_orders',
    name: 'Max Safety Orders (MSTC)'
  },
  {
    id: 'safety_order_step_percentage',
    name: 'SOS'
  },
  {
    id: 'martingale_volume_coefficient',
    name: 'OS'
  },
  {
    id: 'martingale_step_coefficient',
    name: 'SS'
  },
  {
    id: 'max_active_deals',
    name: 'Deals'
  },
  {
    id: 'price_deviation',
    name: 'Deviation'
  },
  {
    id: 'max_funds_per_deal',
    name: 'Max Deal Funds'
  },
  {
    id: 'max_funds',
    name: 'Bot Funds'
  },
  {
    id: 'maxCoveragePercent',
    name: 'Coverage'
  },
  {
    id: 'riskPercent',
    name: 'Risk %'
  },
  {
    id: 'maxSoReached',
    name: 'Max SO Covered'
  },
  {
    id: 'origin',
    name: 'Origin'
  }
]
const BotPlannerPage = () => {

  const { metricsData: { totalBankroll }, botData } = useAppSelector(state => state.threeCommas);
  const currentProfile = useAppSelector(state => state.config.currentProfile);
  const [localBotData, updateLocalBotData] = useState<Type_Query_bots[]>([]);

  const { columns, selectedColumns, handleChange } = useColumnSelector(columnList, 'BotPlanner')

  useEffect(() => {
    if (botData != undefined && botData.length > 0) {
      updateLocalBotData(calcDropMetrics(totalBankroll, botData))
    } else { updateLocalBotData([]) }

  }, [botData, currentProfile, totalBankroll])


  const addToTable = () => {
    updateLocalBotData(prevState => {
      return [blankObject, ...prevState]
    })
  }

  // TODO - come back and refactor this function.
  const saveCustomDeals = async () => {
    const customBots = localBotData.filter(bot => bot.origin === 'custom')

    if (customBots.length > 0) window.ThreeCPM.Repository.Database.update(currentProfile.id, 'bots', customBots)


    // Deciding what bots to delete if they're included in the local bot data or not.
    // Needs to have the logic thought through again. There seems to be reduncant calls here.
    const customBotIds = customBots.map(bot => bot.id);
    if (customBotIds.length === 0) {
      window.ThreeCPM.Repository.Database.run(currentProfile.id, `DELETE from bots where origin = 'custom'`)
    } else {
      window.ThreeCPM.Repository.Database.query(currentProfile.id, `select * from bots where origin = 'custom';`)
        .then((table: Type_Query_bots[]) => {
          for (let row of table) {
            if (!customBotIds.includes(row.id)) {
              window.ThreeCPM.Repository.Database.run(currentProfile.id, `DELETE from bots where id = '${row.id}'`)
            }
          }
        });
    }
    window.ThreeCPM.Repository.Database.upsert(currentProfile.id, 'bots', localBotData, 'id', 'hide')
  }

  return (
    <>
      <div className="flex-row headerButtonsAndKPIs">
        <Risk localBotData={localBotData} />
      </div>
      <div className="boxData flex-column" style={{ padding: '.5em 1em 1em 1em', overflow: 'hidden' }}>
        <div className="flex-row" style={{ alignItems: 'center' }}>
          <ColumnSelector columns={columns} selectedColumns={selectedColumns} handleChange={handleChange} />
          <div className="flex-row headerButtons" style={{ justifyContent: "flex-end", alignItems: 'center', flex: 1 }}>

            <Button
              startIcon={<AddIcon />}
              onClick={() => addToTable()}
              className="button-botPlanner CtaButton"
              disableElevation
            >
              add row
            </Button>
            <SaveButton
              className="button-botPlanner secondaryButton-outline"
              saveFunction={saveCustomDeals}
            />


            <UpdateDataButton
              className="button-botPlanner updatebutton CtaButton"
              style={{ height: '38px' }}
              disabled={true} />
          </div>

        </div>


        <DataTable
          localBotData={localBotData}
          updateLocalBotData={updateLocalBotData}
          selectedColumns={[...selectedColumns, ...baseColumns]}
        />
      </div>



    </>
  )
}



export default BotPlannerPage;