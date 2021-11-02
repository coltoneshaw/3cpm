import {Button} from "@mui/material";
import React from "react";

import { openLink } from "@/utils/helperFunctions";

const FeedbackOrBugButton = () => {    

    return (
        <Button onClick={() => openLink('https://github.com/coltoneshaw/3c-portfolio-manager#feedback-or-bug-submission')} style={{ margin: '1em', borderRight: 'none' }} >Leave Feedback / Report a bug</Button>
    )


}

export default FeedbackOrBugButton;
