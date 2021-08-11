import React, { useState, useEffect } from 'react';

import DataTable from './DataTable';
import {UpdateDataButton } from '@/app/Components/Buttons/Index'
import SaveButton from './Components/SaveButton'

// import './BotPlanner.scss';

import Risk from "./Risk";

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useGlobalData } from '@/app/Context/DataContext';
import { calc_dropMetrics } from '@/utils/formulas'

import { Type_Query_bots } from '@/types/3Commas';

const BotPlannerPage = () => {

    const state = useGlobalData();
    const { data: { botData, metricsData: { totalBankroll } } } = state;

    const [localBotData, updateLocalBotData] = useState<Type_Query_bots[]>([])



    useEffect(() => {

        /**
         * Calculate the money available per bot - bankroll / enabledBots
         */
        if (botData != undefined && botData.length > 0) {
            updateLocalBotData(calc_dropMetrics(totalBankroll, botData))
        } else {
            updateLocalBotData([])
        }

    }, [botData])


    const blankObject = {
        id: parseInt(Math.random().toString(16).slice(2)),
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
        updateLocalBotData((prevState: Type_Query_bots[]) => {
            console.log('adding blank object')
            console.log(prevState)
            return [
                blankObject,
                ...prevState
            ]
        })
    }

    // TODO - come back and refactor this function.
    const saveCustomDeals = async () => {
        const customBots = localBotData.filter(bot => bot.origin === 'custom')

        // @ts-ignore - electron
        await electron.database.update('bots', customBots)

        // @ts-ignore - electron
        await electron.database.query("select * from bots where origin = 'custom'; ")
            .then((table: Type_Query_bots[]) => {
                const customBotIds = customBots.map(bot => bot.id);
                if (customBotIds.length === 0) {

                    // @ts-ignore - electron
                    electron.database.run(`DELETE from bots where origin = 'custom'`)
                } else {
                    for (let row of table) {
                        if (!customBotIds.includes(row.id)) {

                            // @ts-ignore - electron
                            electron.database.run(`DELETE from bots where id = '${row.id}'`)
                        }
                    }
                }

            })
        // alert('Saved to the bots table!')
    }




    return (
        <>
            {/* <h1 style={{margin: "auto"}}>Bot Planner</h1> */}
    

            <Risk localBotData={localBotData} />
            <div className="flex-row" style={{justifyContent: "flex-end"}}>
                <UpdateDataButton 
                    style={{
                        width: '200px',
                        margin: '5px 5px 10px 5px',
                        alignSelf: 'flex-end'

                    }}
                    className="button-botPlanner secondaryButton-outline"
                />
                <SaveButton 
                className="button-botPlanner secondaryButton-outline"
                saveFunction={saveCustomDeals} />

                
                <Button
                    endIcon={<AddIcon />}
                    onClick={() => { addToTable() }}
                    className="button-botPlanner CtaButton"
                    disableElevation
                >
                    add row
                </Button>

            </div>

            <DataTable
                localBotData={localBotData}
                updateLocalBotData={updateLocalBotData}
            />


        </>
    )
}



export default BotPlannerPage;