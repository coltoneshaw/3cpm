import React, { ReactElement, ReactFragment } from 'react';

import CardTooltip from './CustomToolTip';

import './Card.scss';
import { AnyStyledComponent } from 'styled-components';
// " is calculated by taking your total DCA Max Risk of 35,746 and dividing it by your current bankroll of 14,644." 

const Card = ({ title = "", metric, message = "", SubMetric }: { title: string, metric: {metric: string | number, symbol: string}, message?: string, SubMetric?: AnyStyledComponent,}) => {

    return (
    <CardTooltip title={ <> <strong>{title} </strong>{message} </> } >
        <div className="dataCard boxData">
            <h4>{title}</h4>
            <h2>{metric.metric}</h2>
        </div>
    </CardTooltip>)

}

export default Card;