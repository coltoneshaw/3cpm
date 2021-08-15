import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import { useThemeProvidor } from "@/app/Context/ThemeEngine";

const versionInformation = [
    {
        version: '0.0.1',
        enhancements: [
            'Spinner to show the app is updating',
            'Description of what permissions are required for API keys',
            'Chart now shows commas',
        ],
        bugs: [
            'Application height / width issues fixed',
        ],
        new: [
            'Distribution for all OSs',
            'Implementation of the bot planner, stats, and settings.'
        ]
    },
    {
        version: '0.0.2',
        enhancements: [
            'Alerts to tell the user to refresh the Stats page for updated info',
            'Alternating colors on the bot planner table',
            'Error handling around the sync spinner',
            'Larger pie chart in Stats to fill the div'
        ],
        bugs: [
            'Data table hid the overflow and prevented scrolling.',
            'Additional height issues fixed'
        ],
        new: []
    },
    {
        version: '0.0.3',
        enhancements: [
            'Change "Bot Manager" to "Bot Planner"',
            'Improved the overall structure of the code.'
        ],
        bugs: [
            'Fixed issue where bankroll was counting on-orders twice'
        ],
        new: [
            'Multi-currency selector',
            'Feedback / bug reports directly in settings',
            'Project has been migrated fully to Typescript!',
            'Added a multi-account selector'
        ]
    },
    {
        version: '0.0.4',
        enhancements: [
            'Auto updating data when you save the settings. This fixes the issue where you have to refresh the stats data for the filters to take effect',
            'Added GBP as a currency option.',
            'All KPIs now have calculated tooltips to help understand where the metrics are coming from',
            'Removed unnecessary alerts across the app',
            'Improved the responsiveness across the application.'
        ],
        bugs: [
            'Fixed issue with calculations when using multiple acounts. This should be resolved',
            'Fixed issued with the bot planner not properly updating calculations when changing the data fields.'
        ],
        new: [
            'Rebuilt the entire settings page, including the initial user onboarding flow',
            'API Key test when adding keys, this also populates the reserved funds table',
            'Reserved funds - Allows you to add / remove funds from the bankroll calculations.',
            'Ability to reset the config and clear the database.',
            'Toast notifications when syncing / saving',
            'Added a donate button... 💰💰💰💰'
        ]
    },
    {
        version: '0.0.5',
        enhancements: [
            'Improved the styling of the deal allocation chart',
            'Added a UI alert if no currency / account is enabled',
            'Improved the initial first user flow',
            'Redesigned the headers to take less white space on the page',
            'Fixed typos across the application',
            'Added a POST to the acount update to ensure the most updated information comes directly from the exchange.'
        ],
        bugs: [
            'Fixed incorrect date on settings page when you first set up the application.',
            'Fixed issue where account information from 3C was stale. Fixed this by dropping the accounts table on each sync',
            'Default currency was getting duplicated in multiple places. Removed a default all-together.'
        ],
        new: [
            'Added pair and bot performance charts to see volume, profit, and deal length',
            'Added chart filters to the new charts and conditional coloring to bubbles'
        ]
    },
    {
        version: '0.1.0',
        enhancements: [

        ],
        bugs: [

        ],
        new: [
            'Added active deals.'
        ]
    },
]

const generateEnhancements = (enhancements: string[]) => {

    if(enhancements.length === 0) return null
    return (
        <>
            <h4>Enhancements:</h4>
            <ul>
                {enhancements.map(n => (<li>{n}</li>))}
            </ul>
        </>
    )
}

const generateBugs = (bugs: string[]) => {

    if(bugs.length === 0) return null
    return (
        <>
            <h4>Bug Fixes:</h4>
            <ul>
                {bugs.map(n => (<li>{n}</li>))}
            </ul>
        </>
    )
}

const generateNewFeatures = (newFeatures: string[]) => {

    if(newFeatures.length === 0) return null
    return (
        <>
            <h4>New Features:</h4>
            <ul>
                {newFeatures.map(n => (<li>{n}</li>))}
            </ul>
        </>
    )
}

const changes = (version: string) => {

    const findData = versionInformation.find(v => v.version == version);
    if (findData == undefined) return '';

    return (
        <>
            {
                generateNewFeatures(findData.new)
            }
            {
                generateEnhancements(findData.enhancements)
            }
            {
                generateBugs(findData.bugs)
            }
        </>
    )
}





import './changelogModal.scss'

const mostRecent = '0.1.0'

const versions = versionInformation.reverse().map(v => v.version)

const ChangelogModal = ({ open, setOpen }: { open: boolean, setOpen: any }) => {

    // make this version handler use the version that the user is using.
    const [versionView, changeVersion] = useState(() => mostRecent)
    const handleClose = () => {
        setOpen(false);
    };

    const theme = useThemeProvidor()
    const { styles } = theme


    return (
        <Dialog
            fullWidth={false}
            maxWidth="md"
            open={open}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
            style={{

                color: 'var(--color-text-lightbackground)',
                padding: 0,
                ...styles,

            }}
        >
            <DialogContent style={{ padding: 0 }}>
                <div className="flex-row changelogModal">
                    <CloseIcon className="closeIcon" onClick={handleClose} />
                    <div className="flex-column versionDiv">
                        <h3>Versions</h3>
                        {
                            versions.map(version => {
                                const primary = (version == versionView) ? 'active' : '';
                                return <span className={`version ${primary}`} onClick={() => changeVersion(version)}>v{version}</span>
                            })
                        }

                    </div>
                    <div className="flex-column changesDiv">
                        <h3>Changes:</h3>
                        {changes(versionView)}

                    </div>

                </div>

            </DialogContent>
            {/* <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions> */}
        </Dialog>
    )
}

export default ChangelogModal;
