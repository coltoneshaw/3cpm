import { Button } from '@mui/material';
import React from 'react';

import { openLink } from 'common/utils/helperFunctions';

const FeedbackOrBugButton = () => (
  <Button
    onClick={() => openLink('https://github.com/coltoneshaw/3c-portfolio-manager#feedback-or-bug-submission')}
    style={{ margin: '1em', borderRight: 'none' }}
  >
    Leave Feedback / Report a bug
  </Button>
);

export default FeedbackOrBugButton;