import React from 'react';
import CardTooltip from './CustomToolTip';
import './CardComponent.scss';

type CardType = {
  title: string;
  metric: { metric: string | number, symbol: string };
  message?: string;
};

const defaults: CardType = {
  title: '',
  metric: {
    metric: '',
    symbol: 'USD',
  },
  message: '',
};
const Card: React.FC<typeof defaults> = ({ title = '', metric, message = '' }) => (
  <CardTooltip title={(
    <>
      <strong>
        {title}
        {' '}
      </strong>
      {message}
    </>
  )}
  >
    <div className="dataCard boxData">
      <h4>{title}</h4>
      <h2>{metric.metric}</h2>
    </div>
  </CardTooltip>
);

export default Card;
