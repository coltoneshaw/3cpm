import React, { useContext } from 'react';

import Card from '../../Charts/DataCards/Card';


import { parseNumber } from '../../../utils/number_formatting';

import { useGlobalData } from '../../../Context/DataContext';


// Need to import metric contexts here
const Risk = ({ localBotData }) => {

    const state = useGlobalData();
    const { data: { metricsData: { totalBankroll } } } = state;

    /**
     * Bankroll - sum, on_orders, position all added together. Needs to come from global state most likely.
     * risk - bank roll / total DCA risk
     * active bots - count of bots with enabled flagged.
     * DCA Max risk - sum of the max_bot_usage.
     */

    const enabledDeals = localBotData.filter(deal => deal.is_enabled)
    console.log({enabledDeals})

    let maxDCA = (enabledDeals.length > 0) ? enabledDeals.map(deal => deal.max_funds).reduce((sum, max) => sum + max) : 0;


    let bankroll = totalBankroll
    let risk = (maxDCA / bankroll) * 100
    let botCount = localBotData.filter(deal => deal.is_enabled).length

    const sumDropCoverage = (enabledDeals.length > 0) ?  parseInt ( enabledDeals.map(deal => parseInt( deal.maxCoveragePercent ) ).reduce((sum, max) => sum + max) ) : 0;
    let dropCoverage = sumDropCoverage / enabledDeals.length

    const metricData = [
        {
            title: "Total Bank Roll",
            metric: "$" + parseNumber(totalBankroll),
            key: 1
        },
        {
            title: "Risk",
            metric: risk.toFixed(2) + "%",
            key: 2
        },
        {
            title: "Active Bots",
            metric: botCount,
            key: 3
        },
        {
            title: "Max DCA",
            metric: parseNumber(maxDCA),
            key: 4
        },
        {
            title: "Drop Coverage",
            metric: dropCoverage.toFixed(2) + "%",
            key: 5
        },

    ]


    return (
        <div className="riskDiv">
            {metricData.map(data => (<Card title={data.title} metric={data.metric} key={data.key} />))}
        </div>
    )
}

export default Risk;