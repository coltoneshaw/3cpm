import React from "react";

import LaunchIcon from '@mui/icons-material/Launch';

import {openLink} from '@/utils/helperFunctions'

const OpenIn3Commas = ({ cell, bot_id, className }: { cell: any, bot_id: string, className?: string }) => {


    const url = (bot_id) ? `https://3commas.io/bots/${bot_id}/edit` : `https://3commas.io/bots`


    return (
        <>


            <span
                data-text={cell.row.original.bot_settings}
                className={className}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}

            >
                {cell.value}
                <LaunchIcon style={{
                    height: '.4em',
                    cursor: 'pointer'
                }}

                    onClick={() => openLink(url)}
                />
            </span>
        </>
    )
}

export default OpenIn3Commas;