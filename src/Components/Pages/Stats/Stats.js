import React, {  useState, useEffect } from 'react';
import { useGlobalData } from '../../../Context/DataContext';
import { format } from 'date-fns';

import { Button, ButtonGroup } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { RiskMonitor, SummaryStatistics, PerformanceMonitor, ActiveDeals } from './Views/Index';
import { parseNumber } from '../../../utils/number_formatting'

import Card from '../../Charts/DataCards/Card';


import './Stats.scss'
import { useGlobalState } from '../../../Context/Config';
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
    const { data :{metricsData, accountData, isSyncing }, actions: {updateAllData, refreshData} } = state

    const { activeDealCount, activeSum, maxRisk, position, on_orders, totalProfit  } = metricsData

    const [currentView, changeView] = useState('summary-stats')
    const date = dotProp.get(config, 'statSettings.startDate')
    const account_id = dotProp.get(config, 'statSettings.account_id')


//         updatePage = async () => {
//                 await updateThreeCData()
//         await this.queryAndUpdate()
// //     }



    // this needs to stay on this page
    const viewChanger = (newView) => {
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

    return (
        <>
            <h1>Stats</h1>
            <div className="flex-row padding">
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => updateAllData()}
                    endIcon={<SyncIcon className={ isSyncing ? "iconSpinning" : ""}/>}
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
                                return <Button onClick={() => viewChanger(button.id)} >{button.name}</Button>

                            })
                        }
                    </ButtonGroup>
                </div>

                <div className="flex-row filters">
                    <p><strong>Account: </strong>{ (account_id && accountData.length > 0) ? accountData.find(a => a.account_id === account_id).account_name : "All" }</p>
                    <p><strong>Start Date: </strong>{ (date) ? format(date , "MM/dd/yyyy")  : date } </p>
                    <p><strong>Default Currency: </strong>{dotProp.get(config, 'general.defaultCurrency' )}</p>
                </div>

                <div className="riskDiv">
                    <Card title="Active Deals" metric={activeDealCount} />
                    <Card title="$ In Deals" metric={"$" + parseNumber(activeSum)} />
                    <Card title="DCA Max" metric={"$" + parseNumber(maxRisk)} />
                    <Card title="Remaining Bankroll" metric={"$" + parseNumber((position - on_orders))} />
                    <Card title="Total Profit" metric={"$" + parseNumber(totalProfit)} />
                </div>

            </div>


            {/* // Returning the current view rendered in the function above. */}
            {currentViewRender()}
        </>

    )
}



export default StatsPage;