import React, { PureComponent } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { RiskMonitor, SummaryStatistics, PerformanceMonitor, ActiveDeals } from './Views/Index';

import { parseNumber } from '../../../utils/number_formatting'
import { fetchDealDataFunction, fetchPerformanceDataFunction, getActiveDealsFunction, updateThreeCData, getAccountDataFunction } from '../../../utils/3Commas'

import Card from '../../Charts/DataCards/Card';


import './Stats.scss'

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

class StatsPage extends PureComponent {

    state = {
        dealData: [],
        activeDeals: [],
        accountData: [],
        performanceData: [],
        balance: {
            on_orders: 0,
            position: 0,
            sum: 0
        },
        metrics: {
            activeSum: 0,
            maxRisk: 0,
            totalProfit: 0,
            maxRiskPercent: 0,
            bankrollAvailable: 0
        },
        currentView: 'summary-stats',
        account_id: '',
        accountName: '',
        startDate: '',
        defaultCurrency: '',
        loaded: false
    }

    fetchDealData = async () => {
        let data = await fetchDealDataFunction();
        console.log(data)
        this.setState(data)

    }

    fetchPerformanceData = async () => {
        const performanceData = await fetchPerformanceDataFunction()
        this.setState({ performanceData: performanceData })

    }

    getActiveDeals = async () => {
        const data = await getActiveDealsFunction()
        this.setState(prevState => {
            return ({
                activeDeals: data.activeDeals,
                metrics: {
                    ...prevState.metrics,
                    activeSum: data.activeSum,
                    maxRisk: data.maxRisk
                }
            })
        })


    }

    getAccountData = async () => {
        let data = await getAccountDataFunction(this.props.config.general.defaultCurrency)
        const { accountData, balance } = data

        this.setState({
            accountData,
            balance: {
                on_orders: balance.on_orders,
                position: balance.position,
                sum: balance.sum
            },
            accountName: accountData.find(account => account.account_id === this.props.config.statSettings.account_id).account_name,
            account_id: this.props.config.statSettings.account_id
        })
    }

    calculateMetrics = async () => {
        this.setState(prevState => {
            return ({
                metrics: {
                    ...prevState.metrics,
                    maxRiskPercent: ((parseInt(prevState.metrics.maxRisk) / (parseInt(prevState.balance.sum) + parseInt(prevState.metrics.activeSum))) * 100).toFixed(0),
                    bankrollAvailable: ((parseInt(prevState.balance.sum) / (parseInt(prevState.balance.sum) + parseInt(prevState.metrics.activeSum))) * 100).toFixed(0)
                }
            })
        })
    }

    viewChanger = (currentView) => {
        console.log(currentView)
        this.setState({ currentView })
    }

    currentView() {
        const currentView = this.state.currentView
        if (currentView === 'risk-monitor') {
            return <RiskMonitor activeDeals={this.state.activeDeals} metrics={this.state.metrics} balance={this.state.balance} />
        } else if (currentView === 'performance-monitor') {
            return <PerformanceMonitor performanceData={this.state.performanceData} />
        } else if (currentView === 'active-deals') {
            return <ActiveDeals />
        }

        return <SummaryStatistics dealData={this.state.dealData} />
    }

    updatePage = async () => {
        await updateThreeCData()
        await this.queryAndUpdate()
    }

    queryAndUpdate = async () => {
        await this.fetchDealData()
        await this.fetchPerformanceData()
        await this.getActiveDeals()
        await this.updateSettings()
        await this.getAccountData()
        await this.calculateMetrics()
        console.log({ state: this.state })
    }

    updateSettings = () => {
        const config = this.state.config
       

        if (config) {
            const { startDate, account_id } = config.statSettings
            const { defaultCurrency } = config.general

            this.setState({
                startDate,
                account_id,
                defaultCurrency
            })
        }
    }


    componentDidMount = async () => {
        await this.queryAndUpdate()
        

        this.setState({
            loaded: true
        })

    }


    render() {
        return (
            <>
                <h1>Stats</h1>
                <div className="flex-row padding">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => updateThreeCData()}
                        endIcon={<SyncIcon />}
                    >
                        Update Data
                    </Button>
                </div>

                <div className="flex-column" style={{ alignItems: 'center' }}>

                    {/* This needs to be it's own div to prevent the buttons from taking on the flex properties. */}
                    <div>
                        <ButtonGroup aria-label="outlined primary button group" disableElevation disableRipple>
                            {
                                buttonElements.map(button => {
                                    if (button.id === this.state.currentView) return <Button onClick={() => this.viewChanger(button.id)} color="primary" >{button.name}</Button>
                                    return <Button onClick={() => this.viewChanger(button.id)} >{button.name}</Button>

                                })
                            }
                        </ButtonGroup>
                    </div>

                    <div>
                        <h3>{this.state.accountName}</h3>
                        <h3>{this.state.startDate}</h3>
                        <h3>{this.state.defaultCurrency}</h3>
                    </div>


                </div>


                <div className="riskDiv">
                    <Card title="Active Deals" metric={this.state.activeDeals.length} />
                    <Card title="$ In Deals" metric={"$" + parseNumber(this.state.metrics.activeSum)} />
                    <Card title="DCA Max" metric={"$" + parseNumber(this.state.metrics.maxRisk)} />
                    <Card title="Remaining Bankroll" metric={"$" + parseNumber((this.state.balance.position - this.state.balance.on_orders))} />
                    <Card title="Total Profit" metric={"$" + parseNumber(this.state.metrics.totalProfit)} />
                </div>

                {
                    this.currentView()
                }



            </>


        )

    }

}

export default StatsPage;