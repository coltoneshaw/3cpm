import React, { useState, useEffect } from 'react';

import DataTable from './DataTable';
import './BotPlanner.scss';

import Risk from "./Risk";

import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import { useGlobalData } from '../../../Context/DataContext';

import { calc_dropMetrics } from '../../../utils/formulas'


const BotPlannerPage = (props) => {

    const state = useGlobalData();
    const { actions: { fetchBotData, updateAllData }, data: { botData, isSyncing, metricsData: { sum } } } = state;

    const bankRoll = sum;

    const [localBotData, updateLocalBotData] = useState([{ test: 'test', id: '1' }])



    useEffect(() => {

        /**
         * Calculate the money available per bot - bankroll / enabledBots
         */

         updateLocalBotData(calc_dropMetrics(bankRoll, botData))

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
        price_deviation: 0,
        max_funds_per_deal: 0,
        max_funds: 0,
        maxCoveragePercent: 0,
        maxSoReached: 0
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

    const saveCustomDeals = async () => {
        const customBots = localBotData.filter(bot => bot.origin === 'custom')
        await electron.database.update('bots', customBots)

        await electron.database.query("select * from bots where origin = 'custom'; ")
            .then(table => {
                const customBotIds = customBots.map(bot => bot.id);
                if (customBotIds.length === 0) {
                    electron.database.run(`DELETE from bots where origin = 'custom'`)
                } else {
                    for (const row of table) {
                        if (!customBotIds.includes(row.id)) {
                            electron.database.run(`DELETE from bots where id = '${row.id}'`)
                        }
                    }
                }

            })
        alert('Saved to the bots table!')
    }

    /**
     * TODO
     * - make this function store in the database and read from the database.
     */

    return (
        <>
            <h1>Bot Planner</h1>
            <div className="flex-row padding">
                <Button
                    variant="outlined"
                    endIcon={<SyncIcon className={ isSyncing ? "iconSpinning" : ""}/>}
                    onClick={updateAllData}
                >
                    Update data
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<SaveIcon />}
                    onClick={() => { saveCustomDeals() }}
                >
                    Save table data
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



export default BotPlannerPage;