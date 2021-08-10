import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

import { Button, ButtonGroup } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { RiskMonitor, SummaryStatistics, PerformanceMonitor, ActiveDeals } from './Views/Index';

import { findAccounts } from '@/utils/defaultConfig'

// import './Stats.scss'
import { useGlobalState } from '@/app/Context/Config';
import { useGlobalData } from '@/app/Context/DataContext';

import dotProp from 'dot-prop';
import ToastNotifcation from '@/app/Components/ToastNotification'


import { Card_ActiveDeals, Card_totalInDeals, Card_MaxDca, Card_TotalBankRoll, Card_TotalProfit } from '@/app/Components/Charts/DataCards';



const buttonElements = [
    {
        name: 'Summary Statistics',
        id: 'summary-stats'
    },
    {
        name: 'Risk Monitor',
        id: 'risk-monitor'
    },
    {
        name: 'Performance Monitor',
        id: 'performance-monitor'
    }
]

const StatsPage = () => {
    const configState = useGlobalState()
    const { config, state: { reservedFunds } } = configState
    const state = useGlobalData()
    const { data: { metricsData, isSyncing }, actions: { updateAllData } } = state
    const { activeDealCount, totalInDeals, maxRisk, totalBankroll, position, on_orders, totalProfit, totalBoughtVolume, reservedFundsTotal } = metricsData

    const [currentView, changeView] = useState('summary-stats')
    const date: undefined | number = dotProp.get(config, 'statSettings.startDate')

    // const account_id = findAccounts(config, 'statSettings.account_id')


    const returnAccountNames = () => {
        if (reservedFunds.length > 0) {
            // @ts-ignore
            return reservedFunds.filter(account => account.is_enabled).map(account => account.account_name).join(', ')
        } else {
            return "n/a"
        }
    }

    const returnCurrencyValues = () => {
        const currencyValues: string[] | undefined = dotProp.get(config, 'general.defaultCurrency')
        if (currencyValues != undefined && currencyValues.length > 0) {
            // @ts-ignore
            return currencyValues.join(', ')
        } else {
            return "n/a"
        }
    }

    // this needs to stay on this page
    const viewChanger = (newView: string) => {
        changeView(newView)
    }
    // this needs to stay on this page
    const currentViewRender = () => {
        if (currentView === 'risk-monitor') {
            return <RiskMonitor
            />
        } else if (currentView === 'performance-monitor') {
            return <PerformanceMonitor

            />
        } else if (currentView === 'active-deals') {
            return <ActiveDeals />
        }

        return <SummaryStatistics

        />
    }

    const dateString = (date: undefined | number) => {
        return (date) ? format(date, "MM/dd/yyyy") : ""
    }

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    return (
        <>
            <div className="flex-row statHeaderRow">
                <div className="flex-row menuButtons">
                    {/* This needs to be it's own div to prevent the buttons from taking on the flex properties. */}
                    <div>
                        <ButtonGroup aria-label="outlined primary button group" disableElevation disableRipple>
                            {
                                buttonElements.map(button => {
                                    if (button.id === currentView) return <Button onClick={() => viewChanger(button.id)} className="primaryButton-outline">{button.name}</Button>
                                    return <Button className="secondaryButton-outline" key={button.id} onClick={() => viewChanger(button.id)} >{button.name}</Button>

                                })
                            }
                        </ButtonGroup>
                        <Button
                            // variant="contained"
                            // color="primary"
                            className="CtaButton"
                            onClick={async () => {
                                await updateAllData()
                                handleClick()
                            }}
                            disableElevation
                            endIcon={<SyncIcon className={isSyncing ? "iconSpinning" : ""} />}
                            style={{ margin: "auto", height: "36px", marginLeft: "15px", padding: "5px 15px" }}
                        >
                            Update Data
                        </Button>
                    </div>
                </div>

                <div className="flex-row filters" >
                    <p><strong>Account: </strong>{returnAccountNames()}</p>
                    <p><strong>Start Date: </strong>{dateString(date)} </p>
                    <p><strong>Default Currency: </strong>{returnCurrencyValues()}</p>
                </div>

            </div>




            <div className="flex-column" style={{ alignItems: 'center' }}>

                <div className="riskDiv">
                    <Card_ActiveDeals metric={activeDealCount} />
                    <Card_totalInDeals metric={totalInDeals} additionalData={{ on_orders, totalBoughtVolume }} />
                    <Card_MaxDca metric={maxRisk} />
                    <Card_TotalBankRoll metric={totalBankroll} additionalData={{ position, totalBoughtVolume, reservedFundsTotal }} />
                    <Card_TotalProfit metric={totalProfit} />
                </div>

            </div>


            {/* // Returning the current view rendered in the function above. */}
            {currentViewRender()}
            <ToastNotifcation open={open} handleClose={handleClose} message="Sync finished." />

        </>

    )
}



export default StatsPage;