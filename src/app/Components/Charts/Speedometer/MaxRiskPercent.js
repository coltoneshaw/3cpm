import React, { PureComponent } from 'React';
import ReactSpeedometer from "react-d3-speedometer"

class MaxRiskSpeedometer extends PureComponent {


    render(){
        const {metric, min, max, colorArray, labelArray, title} = this.props
        return (
            <div className="boxData" style={{
                height: '250px',
                margin: '25px',
                minWidth : '300px',
                maxWidth : '300px'
            }}>
                <div style={{
                    width: '300px',
                    height: '200px'
                }}>
                    <h3 className="chartTitle" style={{ 'paddingBottom': '25px' }}>{title}</h3>
                    <ReactSpeedometer
                        fluidWidth={true}
                        minValue={min}
                        maxValue={max}
                        value={metric}
                        currentValueText="${value}%"
                        needleColor="steelblue"
                        segments={5}
                        segmentColors={colorArray}
                        customSegmentLabels={labelArray}
                        currentValueText="${value}%"
                    />
                </div>
    
            </div>
        
        )

    }

    
}

export default MaxRiskSpeedometer;