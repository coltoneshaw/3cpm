import {Button} from "@mui/material";
import React from "react";


const FeedbackOrBugButton = () => {


    const openLink = () => {
        const link = 'https://github.com/coltoneshaw/3c-portfolio-manager#feedback-or-bug-submission'

        let electron = window.mainPreload
        if (electron) {
            return window.mainPreload.general.openLink(link);
        }
        return window.open(link)
    }


    return (
        <Button onClick={openLink} style={{ margin: '1em', borderRight: 'none' }} >Leave Feedback / Report a bug</Button>
    )


}

export default FeedbackOrBugButton;
