import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

const CardTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: '.9em',
    fontWeight: 300,
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default CardTooltip;
