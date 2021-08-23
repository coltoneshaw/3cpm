import React from 'react';

import CardTooltip from './CustomToolTip';

import './Card.scss';
// " is calculated by taking your total DCA Max Risk of 35,746 and dividing it by your current bankroll of 14,644." 

const Card = ({ title, metric, message }: { title: string, metric: number | string, message?: string }) => {

    const content = () => (
        <div className="dataCard boxData">
            <h4>{title}</h4>
            <h2>{metric}</h2>
        </div>
    )

    if (message) {
        return (<CardTooltip
            title={
                <React.Fragment>
                    <strong>{title} </strong>{message}
                </React.Fragment>
            }
        >
            {content()}
        </CardTooltip>)
    } else {
        return content()
    }

}

export default Card;