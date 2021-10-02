import React, {useEffect, useState} from 'react';

// @ts-ignore
import { version } from '#/package.json';

import './UpdateBanner.scss';

import Close from '@mui/icons-material/Close';
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

                // check to see if this is a beta version or a full release before displaying
                const currentVersion = versionData.filter((release:any) => !release.prerelease)[0]
                updateLatestVersion(currentVersion.tag_name)
                latestLink = currentVersion.html_url
                console.log(latestLink)

                if("v" + version != currentVersion.tag_name) changeShow(true)

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