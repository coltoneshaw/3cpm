import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/redux/hooks';

import './Stats.scss'
import { Button, ButtonGroup } from '@mui/material';

import { RiskMonitor, SummaryStatistics, PerformanceMonitor } from './Views/Index';
import { UpdateDataButton, CopyTodayStatsButton } from '@/app/Components/Buttons/Index'
import { RoiCards } from './Components/Index'

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
    const { currentProfile } = useAppSelector(state => state.config);
    const { metricsData, profitData } = useAppSelector(state => state.threeCommas);

    const [reservedFunds, updateReservedFunds] = useState(() => currentProfile.statSettings.reservedFunds)

    useEffect(() => {
        if (currentProfile.statSettings.reservedFunds.length > 0) updateReservedFunds(currentProfile.statSettings.reservedFunds)
    }, [currentProfile.statSettings.reservedFunds])


    const [currentView, changeView] = useState('summary-stats')
    const date: undefined | number = currentProfile.statSettings.startDate

    useEffect(() => {
        const getSortFromStorage = getStorageItem(localStorageSortName);
        changeView((getSortFromStorage != undefined) ? getSortFromStorage : defaultNav);
    }, [])



    const returnAccountNames = () => {
        return reservedFunds.length > 0 ?
            currentProfile.statSettings.reservedFunds.filter(account => account.is_enabled).map(account => account.account_name).join(', ')
            :
            "n/a";
    }

    const returnCurrencyValues = () => {
        const currencyValues: string[] | undefined = currentProfile.general.defaultCurrency
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
                        <CopyTodayStatsButton key="copyTodayStatsButton" currency={currentProfile.general.defaultCurrency} profitData={profitData} metricsData={metricsData} className="CtaButton" style={{ margin: "auto", height: "36px", marginLeft: "15px", padding: "5px 15px" }} />
                        <UpdateDataButton key="updateDataButton" className="CtaButton" style={{ margin: "auto", height: "36px", marginLeft: "15px", padding: "5px 15px" }} />

                    </div>
                </div>

                <div className="flex-row filters" >
                    <p><strong>Account: </strong><br />{returnAccountNames()}</p>
                    <p><strong>Start Date: </strong><br />{dateString(date)} </p>
                    <p><strong>Filtered Currency: </strong><br />{returnCurrencyValues()}</p>
                </div>
            </div>


            <RoiCards metricsData={metricsData} currentView={currentView} />



            {/* // Returning the current view rendered in the function above. */}
            {currentViewRender()}


        </>

    )
}



export default StatsPage;