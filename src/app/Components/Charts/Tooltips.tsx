import React from 'react';

import { parseISO, format } from 'date-fns'
import { Type_Tooltip } from '@/types/Charts'



const CustomTooltip = ({ active , payload , label }:Type_Tooltip) => {
    if (active) {
        return (
            <div className="tooltop">
                <h4>{format(parseISO(new Date(label).toISOString()), "eeee, d MMM, yyyy")}</h4>
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