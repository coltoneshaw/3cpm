import React, { useEffect, useState } from 'react';


import { openLink } from '@/utils/helperFunctions';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { updateBannerData, banner } from './redux/bannerSlice'
import './UpdateBanner.scss';

import Close from '@mui/icons-material/Close';
let latestLink = 'https://github.com/coltoneshaw/3c-portfolio-manager/releases'

const UpdateBanner = () => {

    const { show, message, type } = useAppSelector(state => state.banner)
    const dispatch = useAppDispatch()

    const returnBannerElement = (type: banner, message: string) => {
        if (type == 'updateVersion') {
            return (<p> There is a new update available! Click <a onClick={() => openLink(latestLink + '/tag/' + message)}>here</a> to download {message}.</p>)
        }

        return <p>{message}</p>
    }

    const renderBanner = () => {
        if (show) {
            return (
                <div 
                    className="update-mainDiv"
                    style={{
                        backgroundColor: (type === 'apiError') ? 'var(--color-red)' : '#93C5FD',
                        color: (type === 'apiError') ? 'white' : undefined
                    }}
                >
                    {returnBannerElement(type, message)}
                    <Close className="closeIcon" onClick={() => dispatch(updateBannerData({ show: false, message: '', type: '' }))} />
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