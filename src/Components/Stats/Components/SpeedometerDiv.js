import { MaxRiskSpeedometer } from '../../Charts/Speedometer'
import { BalancePie } from '../../Charts/Pie';
import React from 'react';

const SpeedometerDiv = (props) => {

    const { maxRiskPercent, bankrollAvailable } = props.metrics

    return (
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            {/* Need to calculate the max width of the element and pass it into each as a variable to make this dymanic.  */}
            <MaxRiskSpeedometer
                metric={maxRiskPercent}
                min={0}
                max={500}
                colorArray={["rgb(96, 213, 46)", "rgb(150, 222, 42)", "rgb(212, 231, 37)", "rgb(239, 197, 33)", "rgb(247, 138, 29)", "rgb(255, 71, 26)"]}
                labelArray={[
                    {
                        text: '100%',
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "200%",
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "300%",
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "400%",
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "500%",
                        position: "OUTSIDE",
                        color: "#555",
                    }]}
                title="Risk %" />

            <MaxRiskSpeedometer
                min={0}
                max={100}
                title="Bankroll Available"
                metric={bankrollAvailable}
                segments={6}
                labelArray={[
                    {
                        text: '20%',
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "40%",
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "60%",
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "80%",
                        position: "OUTSIDE",
                        color: "#555",
                    },
                    {
                        text: "90%",
                        position: "OUTSIDE",
                        color: "#555",
                    }]}
            />

            <BalancePie 
                metrics={ props.metrics }
                balance={ props.balance }
                title="Balances Available"
            />

        </div>
    )
}

export default SpeedometerDiv;