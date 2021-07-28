import React, { useState, useEffect} from 'react';

import DataTable from './DataTable';
import './BotManager.scss';

import Risk from "./Risk";

import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import { useGlobalData } from '../../../Context/DataContext';

import { calc_dropCoverage } from '../../../utils/formulas'


const BotManagerPage = (props) => {

    const state = useGlobalData();
    const { actions: { fetchBotData }, data: { botData }  } = state;
  
    const [ localBotData, updateLocalBotData ] = useState([{test:'test', id:'1'}])

    const addMetrics = () => {
        updateLocalBotData(prevBotData => {
            const enabledBots = prevBotData.filter(bot => bot.is_enabled)
            const fundsAvailable = 15000 / enabledBots.length
            return prevBotData.map(bot => {
                const dropMetrics = calc_dropCoverage(fundsAvailable, bot)
                return {
                    ...bot,
                    ...dropMetrics
                }
            })
        })
    }
  
    useEffect(() => {

        /**
         * Calculate the money available per bot - bankroll / enabledBots
         */


      updateLocalBotData(botData)
      if(localBotData.length > 0) addMetrics()
    }, [botData])

    const blankObject = {
        id: Math.random().toString(16).slice(2),
        origin: 'custom',
        name: 'edit me',
        is_enabled: false,
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
        price_deviation: 60,
        max_funds_per_deal: 1339,
        max_funds: 1339,
    }

    const addToTable = () => {
        updateLocalBotData(prevState => {
            console.log('adding blank object')
            console.log(prevState)
            return [
                blankObject,
                ...prevState
            ]
        })
    }

    const saveCustomDeals = () => {
        const customBots = localBotData.filter(bot => bot.origin === 'custom')
        electron.database.update('bots', customBots)

        electron.database.query("select * from bots where origin = 'custom'; ")
            .then(table => {
                const customBotIds = customBots.map(bot => bot.id);
                if(customBotIds.length === 0){
                    electron.database.run(`DELETE from bots where origin = 'custom'`)
                } else {
                    for(const row of table){
                        if( !customBotIds.includes(row.id) ){
                            electron.database.run(`DELETE from bots where id = '${row.id}'`)
                        }
                    }
                }

            })
    }
  
    /**
     * TODO
     * - make this function store in the database and read from the database.
     */

    return (
        <>
            <h1>Bot Manager</h1>
            <div className="flex-row padding">
                <Button
                    variant="outlined"
                    endIcon={<SyncIcon />}
                    onClick={fetchBotData}
                >
                    Fetch new data
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<SaveIcon />}
                    onClick={() => { saveCustomDeals() }}
                >
                   Save Data
                </Button>


            </div>

            <Risk localBotData={localBotData} />
            <Button
                    variant="contained"
                    color="primary"
                    endIcon={<AddIcon />}
                    onClick={() => { addToTable() }}
                    style={{
                        width: '150px',
                        margin: '5px 5px 10px 5px',
                        alignSelf: 'flex-end'

                    }}
                    disableElevation
                >
                   add row
                </Button>
            <DataTable
                classes={props.classes}
                localBotData={localBotData}
                updateLocalBotData={updateLocalBotData}
                />
        </>
    )
}



export default BotManagerPage;