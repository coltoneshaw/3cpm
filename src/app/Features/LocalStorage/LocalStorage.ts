import { tryParseJSON } from '@/utils/helperFunctions';

const storageItem = {
  navigation: {
    homePage: 'homePage', // the home page the application navigates to
    statsPage: 'nav-statsPage',
  },
  settings: {
    displayMode: 'displayMode', // the dark mode switcher. Values are 'lightMode' and 'darkMode',
    coinPriceArray: 'coinPriceArray',
  },
  charts: {
    pairByDateFilter: 'pairByDateFilter',
    BotPerformanceBubble: {
      filter: 'filter-botPerformanceBubble', // filter for the bot bubble - values are 'all' , top20, top50, bottom50, bottom20
    },
    DealPerformanceBubble: {
      sort: 'sort-dealPerformanceBubble', // percentTotalProfit , number_of_deals , percentTotalVolume
      filter: 'filter-dealPerformanceBubble', // filter for the bot bubble - values are 'all' , top20, top50, bottom50, bottom20
    },
    PairPerformanceBar: {
      sort: 'sort-pairPerformanceBar', // -total_profit, -bought_volume, -avg_deal_hours
      filter: 'filter-pairPerformanceBar', // all, top20, top50, bottom50, bottom20
    },
    BotPerformanceBar: {
      sort: 'sort-BotPerformanceBar', // -total_profit, -bought_volume, -avg_deal_hours
      filter: 'filter-BotPerformanceBar', // all, top20, top50, bottom50, bottom20
    },
    ProfitByDay: {
      sort: 'sort-ProfitByDay', // day , month, year
    },
  },
  tables: {
    DealsTable: {
      sort: 'sort-DealsTable', // [ {id: 'value', desc: boolean}],
      columns: 'columns-DealsTable', // array of accessor ids from react-table
    },
    BotPlanner: {
      sort: 'sort-BotPlanner', // [ {id: 'value', desc: boolean}],
      columns: 'columns-DealsTable', // array of accessor ids from react-table
    },
  },
};

const setStorageItem = (id: string, value: string | [] | object) => {
  let storageValue = value;
  if (typeof storageValue === 'object') storageValue = JSON.stringify(value);

  localStorage.setItem(id, storageValue);
};

const getStorageItem = (id: string) => {
  const savedStorageItem = localStorage.getItem(id);

  const parsed = (savedStorageItem) ? tryParseJSON(savedStorageItem) : undefined;
  if (parsed) return parsed;

  return storageItem;
};

export {
  storageItem,
  setStorageItem,
  getStorageItem,
};
