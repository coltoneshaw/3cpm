import React, { useState, useEffect } from 'react';
import dotProp from 'dot-prop';

import './Stats.scss'
import { Button, ButtonGroup } from '@material-ui/core';

import { RiskMonitor, SummaryStatistics, PerformanceMonitor } from './Views/Index';
import { UpdateDataButton } from '@/app/Components/Buttons/Index'

import { useGlobalState } from '@/app/Context/Config';
import { useGlobalData } from '@/app/Context/DataContext';

import {
    Card_ActiveDeals, Card_totalInDeals, Card_MaxDca,
    Card_TotalBankRoll, Card_TotalProfit, Card_MaxRiskPercent,
    Card_TotalBoughtVolume, Card_TotalDeals, Card_TotalRoi,
    Card_AverageDailyProfit, Card_AverageDealHours
} from '@/app/Components/Charts/DataCards';

import { getLang } from '@/utils/helperFunctions';
const lang = getLang()

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';
const defaultNav = 'day';
const localStorageSortName = storageItem.navigation.statsPage


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
    const { data: { metricsData}} = state
    const { activeDealCount, totalInDeals, maxRisk, totalBankroll, position, on_orders, totalProfit, totalBoughtVolume, reservedFundsTotal, maxRiskPercent, totalDeals, boughtVolume, totalProfit_perf, averageDailyProfit, averageDealHours, totalClosedDeals, totalDealHours } = metricsData

    const [currentView, changeView] = useState('summary-stats')
    const date: undefined | number = dotProp.get(config, 'statSettings.startDate')

    // const account_id = findAccounts(config, 'statSettings.account_id')

    useEffect(() => {
        const getSortFromStorage = getStorageItem(localStorageSortName);
        changeView((getSortFromStorage != undefined) ? getSortFromStorage : defaultNav);
    }, [])



    const returnAccountNames = () => {
        return reservedFunds.length > 0 ?
            reservedFunds.filter(account => account.is_enabled).map(account => account.account_name).join(', ')
            :
            "n/a";
    }

    const returnCurrencyValues = () => {
        const currencyValues: string[] | undefined = dotProp.get(config, 'general.defaultCurrency')
        return currencyValues != undefined && currencyValues.length > 0 ?
            currencyValues.join(', ')
            :
            "n/a";
    }

    // this needs to stay on this page
    const viewChanger = (newView: string) => {

        const selectedNav = (newView != undefined) ? newView : defaultNav;
        changeView(selectedNav);
        setStorageItem(localStorageSortName, selectedNav)
    }
    // this needs to stay on this page
    const currentViewRender = () => {
        if (currentView === 'risk-monitor') {
            return <RiskMonitor key="risk-monitor" />
        } else if (currentView === 'performance-monitor') {
            return <PerformanceMonitor key="performance-monitor" />
        }

        return <SummaryStatistics key="summary-stats" />
    }

    const additionalMetrics = () => {

        if (currentView === 'performance-monitor') {
            return (
                <>
                    {/* <Card_TotalBoughtVolume metric={boughtVolume} /> */}
                    <Card_MaxDca metric={maxRisk} />
                    <Card_TotalDeals metric={totalDeals} />
                    <Card_TotalRoi additionalData={{ totalProfit, totalBankroll }} />
                    <Card_AverageDailyProfit metric={averageDailyProfit} />
                    <Card_AverageDealHours metric={averageDealHours} additionalData={{ totalClosedDeals, totalDealHours }} />
                    <Card_TotalProfit metric={totalProfit} />
                </>)
        } else if (currentView === 'risk-monitor') {
            return (
                <>
                    {/* <Card_TotalBoughtVolume metric={boughtVolume} /> */}
                    <Card_ActiveDeals metric={activeDealCount}/>
                    <Card_totalInDeals metric={totalInDeals} additionalData={{on_orders, totalBoughtVolume}}/>
                    <Card_MaxDca metric={maxRisk}/>
                    <Card_MaxRiskPercent metric={maxRiskPercent} additionalData={{totalBankroll, maxDCA: maxRisk}}/>
                    <Card_TotalBankRoll metric={totalBankroll}
                                        additionalData={{position, totalBoughtVolume, reservedFundsTotal}}/>
                </>)
        }

        return (
            <>
                <Card_ActiveDeals metric={activeDealCount}/>
                <Card_totalInDeals metric={totalInDeals} additionalData={{on_orders, totalBoughtVolume}}/>
                <Card_MaxDca metric={maxRisk}/>
                {/* <Card_MaxRiskPercent metric={maxRiskPercent} additionalData={{ totalBankroll, maxDCA: maxRisk }} /> */}
                <Card_TotalBankRoll metric={totalBankroll}
                                    additionalData={{position, totalBoughtVolume, reservedFundsTotal}}/>
                <Card_TotalProfit metric={totalProfit}/>
                <Card_TotalRoi additionalData={{totalProfit, totalBankroll}}/>
            </>)
    }

    const dateString = (date: undefined | number) => {

        if (date != undefined) {
            const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
            const dateString = new Date(adjustedTime).toUTCString()
            return new Date(dateString).toLocaleString(lang, { month: '2-digit', day: '2-digit', year: 'numeric' })
        }

        return ""

    }


    return (
        <>
            <div className="flex-row statHeaderRow">
                <div className="flex-row menuButtons">
                    {/* This needs to be it's own div to prevent the buttons from taking on the flex properties. */}
                    <div>
                        <ButtonGroup aria-label="outlined primary button group" disableElevation disableRipple>
                            {
                                buttonElements.map(button => {
                                    if (button.id === currentView) return <Button key={button.id} onClick={() => viewChanger(button.id)} className="primaryButton-outline">{button.name}</Button>
                                    return <Button className="secondaryButton-outline" key={button.id} onClick={() => viewChanger(button.id)} >{button.name}</Button>

                                })
                            }
                        </ButtonGroup>
                        <UpdateDataButton key="updateDataButton" className="CtaButton" style={{ margin: "auto", height: "36px", marginLeft: "15px", padding: "5px 15px" }} />

                    </div>
                </div>

                <div className="flex-row filters" >
                    <p><strong>Account: </strong><br />{returnAccountNames()}</p>
                    <p><strong>Start Date: </strong><br />{dateString(date)} </p>
                    <p><strong>Filtered Currency: </strong><br />{returnCurrencyValues()}</p>
                </div>

            </div>




            <div className="flex-column" style={{ alignItems: 'center' }}>

                <div className="riskDiv" style={{ paddingBottom: '32px' }}>

                    {additionalMetrics()}
                </div>

            </div>


            {/* // Returning the current view rendered in the function above. */}
            {currentViewRender()}


        </>

    )
}



export default StatsPage;