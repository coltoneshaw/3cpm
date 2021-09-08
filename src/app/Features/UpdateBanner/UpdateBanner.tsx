import React, {useEffect, useState} from 'react';

// @ts-ignore
import { version } from '#/package.json';

import './UpdateBanner.scss';

import Close from '@material-ui/icons/Close';
let latestLink = 'https://github.com/coltoneshaw/3c-portfolio-manager/releases'

const UpdateBanner = () => {

    const [show, changeShow] = useState(false)
    const [latestVersion, updateLatestVersion] = useState('')


    const hideBanner = () => {
        changeShow( false )
    }

    const openVersionLink = () => {
        // @ts-ignore
        electron.general.openLink(latestLink)
    }

    useEffect(() => {

        // @ts-ignore
        electron.pm.versions()
            .then((versionData:any) => {

                if(versionData == undefined || versionData[0] == undefined){
                    return
                }

                const currentVersion = versionData[0]
                updateLatestVersion(currentVersion.tag_name)
                latestLink = currentVersion.html_url
                console.log(latestLink)

                if(version != currentVersion.tag_name) changeShow(true)

            })
    }, []) 

    // 1. Query the api to see if the version matches

    

    const renderBanner = () => {
        if(show) {
            return (
                <div className="update-mainDiv">

                    {/* @ts-ignore */}
                <p> There is a new update available! Click <a  onClick={() => openVersionLink()} >here</a> to download {latestVersion}.</p>
                <Close className="closeIcon" onClick={ () => hideBanner()}/>
                </div>
            )
        }
    }

    return (
        <>
       {
           renderBanner()
        }
        </>
    )
}

export default UpdateBanner;