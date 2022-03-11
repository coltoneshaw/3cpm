import React, { useEffect, useRef, useState } from 'react';

import {
  Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popover,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { ToastNotifcations } from '@/app/Features/Index';
import { Type_MetricData, ProfitArray } from '@/types/3Commas';
import { defaultCurrency } from '@/types/config';
import { formatCurrency } from '@/utils/granularity';

interface Type_ButtonProps {
  style?: object,
  className?: string
  metricsData: Type_MetricData
  todayProfit: number,
  activeDealReserve: number
}
const CopyTodayStatsButton = ({
  metricsData, todayProfit, style, className, activeDealReserve,
}: Type_ButtonProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isToastOpen, setToastOpen] = useState(false);
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);

  const copyStatsToClipboard = (yesterday?: boolean) => {
    const todaysProfit = formatCurrency(['USD'], todayProfit);
    const bankRoll = formatCurrency(['USD'], metricsData.totalBankroll);

    // IDENT NOTICE: code formatting bellow is importamt, do not re-indent the following lines
    const text = `**Today's Profit:** ${`${todaysProfit.metric} ${todaysProfit.extendedSymbol}`}
**Bankroll:** ${`${bankRoll.metric} ${bankRoll.extendedSymbol}`}
**Risk:** ${metricsData.maxRiskPercent}%
**Active deals:** ${metricsData.activeDealCount}
**Active deal Reserve:** ${activeDealReserve}`;
    navigator.clipboard.writeText(text).then(() => setToastOpen(true));
  };

  // toast
  const handleToastClose = (event: any, reason: string) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
  };

  // submenu
  const copyYesterdayStats = () => {
    setSubmenuOpen(false);
    copyStatsToClipboard(true);
  };

  const handleToggle = () => {
    setSubmenuOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current
      && anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setSubmenuOpen(false);
  };

  return (
    < >
      <ButtonGroup disableElevation ref={anchorRef}>
        <Button
          className={className}
          onClick={() => copyStatsToClipboard()}
          disableElevation
          style={style}
        >
          Copy Stats
        </Button>
        {/* <Button
                    className={className}
                    disableElevation
                    size="small"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
 */}

      </ButtonGroup>
      {/* <Popover
                id='popperID'
                open={isSubmenuOpen}
                anchorEl={anchorRef.current}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu">
                            <MenuItem onClick={copyYesterdayStats} disabled={profitData.length < 2}>
                                Yesterday's Stats
                            </MenuItem>
                        </MenuList>
                    </ClickAwayListener>
                </Paper>

            </Popover> */}

      <ToastNotifcations open={isToastOpen} handleClose={handleToastClose} message="Stats copied to your clipboard." />
    </>
  );
};

export default CopyTodayStatsButton;
