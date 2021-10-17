import {Button} from "@mui/material";
import React from "react";


const FeedbackOrBugButton = () => {


    const openLink = () => {
        const link = 'https://github.com/coltoneshaw/3c-portfolio-manager#feedback-or-bug-submission'
        // @ts-ignore
        let elctron = window.electron
        if (elctron) {
            return elctron.general.openLink(link);
        }
        return window.open(link)
    }


    return (
        <Button onClick={openLink} style={{ margin: '1em', borderRight: 'none' }} >Leave Feedback / Report a bug</Button>
    )


}

export default FeedbackOrBugButton;
