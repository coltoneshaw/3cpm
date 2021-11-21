import React from 'react';
import { useAppSelector } from '@/app/redux/hooks';

import './Stats.scss'
import { Button, ButtonGroup } from '@mui/material';

import { UpdateDataButton } from '@/app/Components/Buttons/Index'
import { RoiCards, ViewRenderer, useViewRenderer, StatFiltersDiv } from './Components/Index'



const buttonElements:buttonElements = [
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
    const { metricsData } = useAppSelector(state => state.threeCommas);

    const {currentView, viewChanger } = useViewRenderer()

    // // this feels redundant
    // const [reservedFunds, updateReservedFunds] = useState(() => currentProfile.statSettings.reservedFunds)
    // useEffect(() => {
    //     if (currentProfile.statSettings.reservedFunds.length > 0) updateReservedFunds(currentProfile.statSettings.reservedFunds)
    // }, [currentProfile.statSettings.reservedFunds])

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
                <StatFiltersDiv currentProfile={currentProfile}/>
            </div>
            <RoiCards metricsData={metricsData} currentView={currentView} />
            <ViewRenderer currentView={currentView}/>
        </>

    )
}



export default StatsPage;