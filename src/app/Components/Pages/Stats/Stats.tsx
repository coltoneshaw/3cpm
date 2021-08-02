import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

import { Button, ButtonGroup } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

// @ts-ignore
import { RiskMonitor, SummaryStatistics, PerformanceMonitor, ActiveDeals } from './Views/Index';
import { parseNumber } from '@/utils/number_formatting'

import Card from '@/app/Components/Charts/DataCards/Card';

import { findAccounts } from '@/utils/defaultConfig'

// import './Stats.scss'
import { useGlobalState } from '@/app/Context/Config';
import { useGlobalData } from '@/app/Context/DataContext';

import dotProp from 'dot-prop';

/**
 * TODO 
 * - Need to add a date filter that can filter the Risk / Performance dashboards.
 */

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
    },
    {
        name: 'Active Deals',
        id: 'active-deals'
    }
]

/**
 * TODO 
 * - Need to add a date filter that can filter the Risk / Performance dashboards.
 * 
 */

const StatsPage = () => {
    const configState = useGlobalState()
    const { config } = configState
    const state = useGlobalData()
    const { data: { metricsData, accountData, isSyncing }, actions: { updateAllData, refreshData } } = state

    const { activeDealCount, totalInDeals, maxRisk, totalBankroll, position, on_orders, totalProfit } = metricsData

    const [currentView, changeView] = useState('summary-stats')
    const date: undefined | number = dotProp.get(config, 'statSettings.startDate')

    const account_id = findAccounts(config, 'statSettings.account_id')


    const returnAccountNames = () => {
       if(accountData.length > 0 && account_id.length > 0){

        // @ts-ignore
           return Array.from( new Set(accountData.filter(e => account_id.includes(e.account_id)).map(e => e.account_name))).join(', ')
       } else {
           return "n/a"
       }
    }

    // this needs to stay on this page
    const viewChanger = ( newView:string ) => {
        changeView(newView)
    }
    // this needs to stay on this page
    const currentViewRender = () => {
        if (currentView === 'risk-monitor') {
            return <RiskMonitor
            // activeDeals={this.state.activeDeals} metrics={this.state.metrics} balance={this.state.balance} 
            />
        } else if (currentView === 'performance-monitor') {
            return <PerformanceMonitor
            // performanceData={this.state.performanceData} 

            />
        } else if (currentView === 'active-deals') {
            return <ActiveDeals />
        }

        return <SummaryStatistics
        //dealData={this.state.dealData} 

        />
    }

    const dateString = ( date:undefined| number  ) => {

       return (date) ? format(date, "MM/dd/yyyy") : ""
    }

    return (
        <>
            <h1>Stats</h1>
            <div className="flex-row padding">
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => updateAllData().then(refreshData())}
                    endIcon={<SyncIcon className={isSyncing ? "iconSpinning" : ""} />}
                >
                    Update Data
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => refreshData()}
                    endIcon={<SyncIcon />}
                >
                    Refresh Chart Data
                </Button>
            </div>

            <div className="flex-column" style={{ alignItems: 'center' }}>

                {/* This needs to be it's own div to prevent the buttons from taking on the flex properties. */}
                <div>
                    <ButtonGroup aria-label="outlined primary button group" disableElevation disableRipple>
                        {
                            buttonElements.map(button => {
                                if (button.id === currentView) return <Button onClick={() => viewChanger(button.id)} color="primary" >{button.name}</Button>
                                return <Button key={button.id} onClick={() => viewChanger(button.id)} >{button.name}</Button>

                            })
                        }
                    </ButtonGroup>
                </div>

                <div className="flex-row filters">
                    <p><strong>Account: </strong>{ returnAccountNames() }</p>

                    <p><strong>Start Date: </strong>{ dateString(date) } </p>
                    <p><strong>Default Currency: </strong>{dotProp.get(config, 'general.defaultCurrency')}</p>
                </div>

                <div className="riskDiv">
                    <Card title="Active Deals" metric={activeDealCount} />
                    <Card title="Total in Deals" metric={"$" + parseNumber(totalInDeals)} />
                    <Card title="DCA Max" metric={"$" + parseNumber(maxRisk)} />
                    <Card title="Total Bankroll" metric={"$" + parseNumber(totalBankroll)} />
                    <Card title="Total Profit" metric={"$" + parseNumber(totalProfit)} />
                </div>

            </div>


            {/* // Returning the current view rendered in the function above. */}
            {currentViewRender()}
        </>

    )
}



export default StatsPage;