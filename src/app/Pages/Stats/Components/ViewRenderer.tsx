import React, { useState, useEffect } from 'react';
import { RiskMonitor, SummaryStatistics, PerformanceMonitor } from '../Views/Index';
import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

import type { PageIds } from '../types.d';

const defaultNav = 'summary-stats';
const localStorageSortName = storageItem.navigation.statsPage;

const useViewRenderer = () => {
  const [currentView, changeView] = useState<PageIds>(defaultNav);

  const viewChanger = (newView: PageIds) => {
    const selectedNav = (newView !== undefined) ? newView : defaultNav;
    changeView(selectedNav);
    setStorageItem(localStorageSortName, selectedNav);
  };

  useEffect(() => {
    const getSortFromStorage = getStorageItem(localStorageSortName);
    changeView(getSortFromStorage ?? defaultNav);
  }, []);

  return {
    currentView,
    viewChanger,
  };
};

const ViewRenderer = ({ currentView }: { currentView: PageIds }) => {
  const currentViewRender = () => {
    let view = <SummaryStatistics key="summary-stats" />;
    switch (currentView) {
      case 'risk-monitor':
        view = <RiskMonitor key="risk-monitor" />;
        break;
      case 'performance-monitor':
        view = <PerformanceMonitor key="performance-monitor" />;
        break;
      default:
        break;
    }

    return view;
  };
  return currentViewRender();
};

export {
  ViewRenderer,
  useViewRenderer,
};
