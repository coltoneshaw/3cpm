import React from 'react';

import { parseISO, format } from 'date-fns'
import { Type_Tooltip } from '@/types/Charts'

import { getLang } from '@/utils/helperFunctions';


const CustomTooltip = ({ active , payload , label }:Type_Tooltip) => {
    if (active) {
        label = new Date(label).toLocaleString(getLang(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

        return (
            <div className="tooltop">
                <h4>{label}</h4>
                <p>$ {payload[0].value.toLocaleString()}</p>
            </div>
        )
    } else {
        return null
    }
}

export {
    CustomTooltip
}