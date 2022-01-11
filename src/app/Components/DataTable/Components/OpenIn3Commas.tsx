import React from "react";

import LaunchIcon from '@mui/icons-material/Launch';

import {openLink} from '@/utils/helperFunctions'
import { textAlign } from "@mui/system";

const OpenIn3Commas = ({ cell, bot_id, className }: { cell: any, bot_id: string, className?: string }) => {


    const url = (bot_id) ? `https://3commas.io/bots/${bot_id}/edit` : `https://3commas.io/bots`


    return (
        <>


            <span
                data-text={cell.row.original.bot_settings}
                className={className}
                style={{
                    paddingLeft: '3px',
                    width: '100%',
                    textAlign: 'left'
                }}

            >
                {cell.value}
                <LaunchIcon style={{
                    height: '.4em',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    opacity: .6
                }}

                    onClick={() => openLink(url)}
                />
            </span>
        </>
    )
}

export default OpenIn3Commas;