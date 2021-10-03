import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/redux/hooks';

import DataTable from './DataTable';
import { UpdateDataButton } from '@/app/Components/Buttons/Index'
import SaveButton from './Components/SaveButton'

import './BotPlanner.scss';

import Risk from "./Risk";

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { calc_dropMetrics } from '@/utils/formulas'

import { Type_Query_bots } from '@/types/3Commas';

const BotPlannerPage = () => {

    const { metricsData: {totalBankroll}, botData} = useAppSelector(state => state.threeCommas);
    const {config, currentProfile} = useAppSelector(state => state.config);
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

    }, [botData, currentProfile, totalBankroll])


    const blankObject = {
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
        safety_order_volume_type: '',
        profit_currency: '',
        account_name: 'Fake Bot',
        account_id: 111111111,
        active_deals_count: 0,
        enabled_inactive_funds: 0
    }

    const addToTable = () => {
        updateLocalBotData((prevState: Type_Query_bots[]) => {
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
        if (customBots.length > 0) await electron.database.update('bots', customBots)


        // Deciding what bots to delete if they're included in the local bot data or not.
        // Needs to have the logic thought through again. There seems to be reduncant calls here.
        const customBotIds = customBots.map(bot => bot.id);
        if (customBotIds.length === 0) {
            // @ts-ignore - electron
            electron.database.run(`DELETE from bots where origin = 'custom' AND profile_id = '${config.current}'`)
        } else {
            // @ts-ignore - electron
            electron.database.query(`select * from bots where origin = 'custom' AND profile_id = '${config.current}';`)
                .then((table: Type_Query_bots[]) => {
                    for (let row of table) {
                        if (!customBotIds.includes(row.id)) {
                            // @ts-ignore - electron
                            electron.database.run(`DELETE from bots where id = '${row.id}' AND profile_id = '${config.current}'`)
                        }
                    }
                });
        }

        // const existingBots = localBotData.filter(bot => bot.origin === 'sync').map(bot => ({id: bot.id, metrics: bot.metrics}))

        // @ts-ignore
        await electron.database.upsert('bots', localBotData, 'id', 'hide')


    }




    return (
        <>
            {/* <h1 style={{margin: "auto"}}>Bot Planner</h1> */}

            <div className="flex-row headerButtonsAndKPIs">
                <Risk localBotData={localBotData}/>

                <div className="flex-row headerButtons" style={{ justifyContent: "flex-end" }}>
                <UpdateDataButton className="button-botPlanner updatebutton CtaButton" style={{ margin: '5px', height: '38px' }} disabled={true} />

                    <SaveButton
                        className="button-botPlanner secondaryButton-outline"
                        saveFunction={saveCustomDeals} />


                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => { addToTable() }}
                        className="button-botPlanner CtaButton"
                        disableElevation
                    >
                        add row
                    </Button>

                </div>


            </div>




            <DataTable
                localBotData={localBotData}
                updateLocalBotData={updateLocalBotData}
            />


        </>
    )
}



export default BotPlannerPage;