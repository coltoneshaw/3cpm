import React from 'react';
import MaxRiskSpeedometer from '@/app/Components/Charts/Speedometer';
import BalancePie from '@/app/Components/Charts/Pie';
import type { MetricDataType } from '@/types/DatabaseQueries';
import type { DefaultCurrency } from '@/types/config';

interface SpeedometerType {
  metrics: MetricDataType
  defaultCurrency: DefaultCurrency
}

const SpeedometerDiv: React.FC<SpeedometerType> = ({ metrics, defaultCurrency }) => {
  const { maxRiskPercent, bankrollAvailable } = metrics;

  return (
    <div className="speedometerDiv">
      {/* Need to calculate the max width of the element and pass it into each as a variable to make this dymanic.  */}
      <MaxRiskSpeedometer
        metric={maxRiskPercent}
        min={0}
        max={400}
        colorArray={[
          'rgb(96, 213, 46)', 'rgb(150, 222, 42)',
          'rgb(212, 231, 37)', 'rgb(239, 197, 33)',
          'rgb(247, 138, 29)', 'rgb(255, 71, 26)',
        ]}
        labelArray={[
          {
            text: '50%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '150%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '250%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '350%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '',
            position: 'OUTSIDE',
            color: '',
          }]}
        title="Risk %"
      />

      <MaxRiskSpeedometer
        min={0}
        max={100}
        title="Bankroll Available"
        metric={bankrollAvailable}
        labelArray={[
          {
            text: '20%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '40%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '60%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '80%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          },
          {
            text: '90%',
            position: 'OUTSIDE',
            color: 'var(--color-text-lightbackground)',
          }]}
      />

      <BalancePie
        metrics={metrics}
        title="Balances Available"
        defaultCurrency={defaultCurrency}
      />

    </div>
  );
};

export default SpeedometerDiv;
