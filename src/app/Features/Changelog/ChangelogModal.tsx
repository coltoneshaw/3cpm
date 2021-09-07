import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useThemeProvidor } from "@/app/Context/ThemeEngine";

import './changelogModal.scss'

import { mostRecent, versionInformation } from './changelogText'

const generateEnhancements = (enhancements: string[]) => {

    if(enhancements.length === 0) return null
    return (
        <>
            <h4>Enhancements:</h4>
            <ul>
                {enhancements.map((n, index) => (<li key={index}>{n}</li>))}
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
                {bugs.map((n, index) => (<li key={index}>{n}</li>))}
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
                {newFeatures.map((n, index) => (<li key={index}>{n}</li>))}
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
                                return <span className={`version ${primary}`} onClick={() => changeVersion(version)} key={version}>{version}</span>
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
