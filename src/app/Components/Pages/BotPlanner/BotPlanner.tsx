import React, { useState, useEffect } from 'react';

import DataTable from './DataTable';
import './BotPlanner.scss';

import Risk from "./Risk";

import Button from '@material-ui/core/Button';
import SyncIcon from '@material-ui/icons/Sync';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import { useGlobalData } from '@/app/Context/DataContext';
import { calc_dropMetrics } from '@/utils/formulas'

import { Type_bots } from '@/types/3Commas';

const BotPlannerPage = ({ classes }: { classes: object }) => {

    const state = useGlobalData();
    const { actions: { fetchBotData, updateAllData }, data: { botData, isSyncing, metricsData: { totalBankroll } } } = state;

    const [localBotData, updateLocalBotData] = useState<Type_bots[]>([])



    useEffect(() => {

        /**
         * Calculate the money available per bot - bankroll / enabledBots
         */

        updateLocalBotData(calc_dropMetrics(totalBankroll, botData))

    }, [botData])


    const blankObject = {
        id: parseInt( Math.random().toString(16).slice(2)) ,
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
        maxSoReached: 0,
        drawdown: 0,
        type: '',
        trailing_deviation: 0,
        take_profit_type: '',
        strategy: 'long',
        stop_loss_percentage: 0,
        safety_order_volume_type: '',
        profit_currency: '',
        account_name: 'Fake Bot',
        account_id: 111111111,
        active_deals_count: 0
    }

    const addToTable = () => {
        updateLocalBotData((prevState: Type_bots[]) => {
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

        // @ts-ignore
        await electron.database.update('bots', customBots)

        // @ts-ignore
        await electron.database.query("select * from bots where origin = 'custom'; ")
            .then( (table: Type_bots[]) => {
                const customBotIds = customBots.map(bot => bot.id);
                if (customBotIds.length === 0) {

                    // @ts-ignore
                    electron.database.run(`DELETE from bots where origin = 'custom'`)
                } else {
                    for (let row of table) {
                        if (!customBotIds.includes(row.id)) {

                            // @ts-ignore
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
                    endIcon={<SyncIcon className={isSyncing ? "iconSpinning" : ""} />}
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
                classes={classes}
                localBotData={localBotData}
                updateLocalBotData={updateLocalBotData}
            />
        </>
    )
}



export default BotPlannerPage;