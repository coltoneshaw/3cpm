import React from "react";
import { RiskMonitor, SummaryStatistics, PerformanceMonitor } from '../Views/Index';


const ViewRenderer = ({ currentView }: { currentView: 'summary-stats' | 'risk-monitor' | 'performance-monitor' | 'twentyfour-hour-stats' }) => {
    const currentViewRender = () => {
        let view = <SummaryStatistics key="twentyfour-hour-stats" />
        switch (currentView) {
            case 'risk-monitor':
                view = <RiskMonitor key="risk-monitor" />
                break;
            case 'performance-monitor':
                view = <PerformanceMonitor key="performance-monitor" />
                break;
            default:
                break;
        }

        return view;
    }
    return currentViewRender()
}

export default ViewRenderer;