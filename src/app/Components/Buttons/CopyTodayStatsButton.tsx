import React, {useEffect, useRef, useState} from "react";

import {Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { ToastNotifcations } from '@/app/Features/Index'
import {Type_MetricData, Type_Profit} from "@/types/3Commas";
import {defaultCurrency} from "@/types/config";
import {formatCurrency} from "@/utils/granularity";

interface Type_ButtonProps {
    style?: object,
    className?: string
    metricsData: Type_MetricData
    profitData: Type_Profit[],
    currency: defaultCurrency,
}
const CopyTodayStatsButton = ({metricsData, profitData, currency, style, className}: Type_ButtonProps) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [isToastOpen, setToastOpen] = useState(false);
    const [isSubmenuOpen, setSubmenuOpen] = useState(false);

    const copyStatsToClipboard = (yesterday?: boolean) => {
        let dayIdx = yesterday ? 2 : 1
        const todaysProfit = formatCurrency(currency,(profitData.length > 0) ? profitData[profitData.length - dayIdx].profit : 0)
        const bankRoll = formatCurrency(currency, metricsData.totalBankroll)
        // IDENT NOTICE: code formatting bellow is importamt, do not re-indent the following lines
        let text = `**Today's Profit:** ${todaysProfit.metric + " " + todaysProfit.extendedSymbol}
**Bankroll:** ${bankRoll.metric + " " + bankRoll.extendedSymbol}
**Risk:** ${metricsData.maxRiskPercent}%
**Active deals:** ${metricsData.activeDealCount}`

        navigator.clipboard.writeText(text).then(() => setToastOpen(true));
    };

    // toast
    const handleToastClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };


    // submenu
    const copyYesterdayStats = () => {
        setSubmenuOpen(false)
        copyStatsToClipboard(true)
    };

    const handleToggle = () => {
        setSubmenuOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setSubmenuOpen(false);
    };


    return (
        <>
            <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                <Button
                    className={className}
                    onClick={() => copyStatsToClipboard()}
                    disableElevation
                    style={style}
                >
                    Copy Today's stats
                </Button>
                <Button
                    className={className}
                    disableElevation
                    size="small"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
                <Popper
                    open={isSubmenuOpen}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    placement="bottom-end"
                >
                    {({ TransitionProps }) => (
                        <Grow
                            {...TransitionProps}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                            <MenuItem onClick={copyYesterdayStats} disabled={profitData.length < 2}>
                                                Use yesterday's total
                                            </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </ButtonGroup>
            <ToastNotifcations open={isToastOpen} handleClose={handleToastClose} message="Stats copied to your clipboard." />
        </>
    )
}

export default CopyTodayStatsButton;