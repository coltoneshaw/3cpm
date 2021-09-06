import React, {} from 'react';

import CardTooltip from './CustomToolTip';

import './Card.scss';
import { AnyStyledComponent } from 'styled-components';
// " is calculated by taking your total DCA Max Risk of 35,746 and dividing it by your current bankroll of 14,644." 

const Card = ({ title, metric, message, SubMetric }: { title: string, metric: number | string, message?: string, SubMetric?: AnyStyledComponent }) => {

    const content = () => (
        <div className="dataCard boxData">
            <h4>{title}</h4>
            <h2>{metric}</h2>
            {(SubMetric != undefined) ? <SubMetric/> : null}
        </div>
    )

    if (message) {
        return (<CardTooltip
            title={
                <>
                    <strong>{title} </strong>{message}
                </>
            }
        >
            {content()}
        </CardTooltip>)
    } else {
        return content()
    }

}

export default Card;