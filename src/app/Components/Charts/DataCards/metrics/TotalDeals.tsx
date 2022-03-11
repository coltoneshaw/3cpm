import React from 'react';

import Card from '../Card';
import descriptions from '@/descriptions';

interface Type_Card {
  metric: number
}

/**
 *
 * @param metric - accepts the totalDeals metric from the global data store.
 */
const Card_TotalDeals = ({ metric }: Type_Card) => {
  const title = 'Total Deals';
  const message = descriptions.metrics.totalDeals;
  const key = title.replace(/\s/g, '');
  return (<Card title={title} message={message} key={key} metric={{ metric, symbol: '' }} />);
};

export default Card_TotalDeals;
