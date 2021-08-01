import React from 'react';

// import './Card.scss';

const Card = ({title, metric}: {title: string, metric: number | string}) => {

    return (
        <div className="dataCard boxData">
            <h2>{metric}</h2>
            <h4>{title}</h4>
        </div>
    )
}

export default Card;