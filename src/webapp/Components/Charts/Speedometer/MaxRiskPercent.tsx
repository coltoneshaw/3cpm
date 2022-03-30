import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';

type SpeedometerType = {
  metric: number;
  min: number;
  max: number;
  colorArray?: string[] | undefined;
  labelArray: object[];
  title: string;
};

const defaultProps = {
  colorArray: undefined,
};

const MaxRiskSpeedometer: React.FC<SpeedometerType> = ({
  metric, min, max, colorArray, labelArray, title,
}) => (
  <div
    className="boxData"
    style={{
      height: '250px',
      minWidth: '300px',
      maxWidth: '300px',
    }}
  >
    <div style={{
      width: '300px',
      height: '200px',
    }}
    >
      <h3 className="chartTitle" style={{ paddingBottom: '25px' }}>{title}</h3>
      <ReactSpeedometer
        fluidWidth
        minValue={min}
        maxValue={max}
        value={(metric > max) ? max : metric}
        currentValueText={`${metric}%`}
        needleColor="steelblue"
        segments={5}
        segmentColors={colorArray}
        customSegmentLabels={labelArray}
      />
    </div>

  </div>

);

MaxRiskSpeedometer.defaultProps = defaultProps;

export default MaxRiskSpeedometer;
