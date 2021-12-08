import React, {useEffect, useState} from 'react';


import { openLink } from '@/utils/helperFunctions';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {updateBannerData} from './redux/bannerSlice'
import './UpdateBanner.scss';

import Close from '@mui/icons-material/Close';
let latestLink = 'https://github.com/coltoneshaw/3c-portfolio-manager/releases'

const UpdateBanner = () => {

    const {show, message, type} = useAppSelector(state => state.banner)
    const dispatch = useAppDispatch()

    const returnBannerElement = (type: 'updateVersion' | '', message: string) => {
        console.error({type, message})
        if(type == 'updateVersion') {
            return (<p> There is a new update available! Click <a  onClick={() => openLink(latestLink + '/tag/' + message)}>here</a> to download {message}.</p>)
        }
    }
    
    const renderBanner = () => {
        if(show) {
            return (
                <div className="update-mainDiv">
                    {returnBannerElement(type, message)}
                    <Close className="closeIcon" onClick={ () => dispatch( updateBannerData({show: false, message: '', type: ''}))}/>
                </div>
            )
        }
    }

    return (
        <>
            {renderBanner()}
        </>
    )
}

export default UpdateBanner;