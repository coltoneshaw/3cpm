// import React from 'react';
import { withStyles} from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
// import Typography from '@material-ui/core/Typography';

const CardTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: '.9em',
      fontWeight: 300,
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

export default CardTooltip