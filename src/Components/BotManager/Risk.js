import React from 'react';

import Card from '../Charts/DataCards/Card';

const metricData = [
    {
        title: "Bank Roll",
        metric: "$14,829",
        key: 1
    },
    {
        title: "Risk",
        metric: "180%",
        key: 2
    },
    {
        title: "Active Bots",
        metric: "21",
        key: 3
    },
    {
        title: "Max DCA",
        metric: "$26,692",
        key: 4
    },

]

const Risk = () => {

    return (
        <div className="riskDiv">

        {
            metricData.map(data => ( <Card title={data.title} metric={data.metric} key={data.key} />))
        }
        </div>
    )
}

export default Risk;