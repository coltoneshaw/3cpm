import React from 'react';

import Card from '../Card';
import descriptions from '@/descriptions';
import { parseNumber } from '@/utils/numberFormatting';

interface Type_Card {
  metric: number
}

/**
 *
 * @param metric - accepts the boughtVolume metric from the global data store.
 */
const Card_TotalBoughtVolume = ({ metric }: Type_Card) => {
  const title = 'Total Bought Volume';
  const message = descriptions.metrics.totalBoughtVolume;
  const key = title.replace(/\s/g, '');
  return (<Card title={title} message={message} key={key} metric={{ metric, symbol: '' }} />);
};

export default Card_TotalBoughtVolume;
