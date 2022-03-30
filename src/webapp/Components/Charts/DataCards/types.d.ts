import type { supportedCurrencies } from '@/utils/granularity';
import type descriptions from '@/descriptions';

export type Keys =
  'active-deals' | 'max-risk'
  | 'active-deal-reserve' | 'average-daily-profit'
  | 'average-deal-hours' | 'drop-coverage' | 'enabled-bots'
  | 'max-dca' | 'total-bankroll' | 'total-bought-volume' | 'todays-profit'
  | 'total-deals' | 'total-in-deals' | 'total-profit' | 'total-roi' | 'total-unrealized-profit';

export type Metric = {
  metric: string | number;
  symbol: string;
};

export type MO = {
  [K in Keys]: {
    title: string;
    description: descriptions
  }
};

export interface TypeCard {
  metric: number;
  title?: string;
  additionalData?: undefined = undefined;
  currency?: undefined = undefined;
}
export interface CurrencyTypeCard extends TypeCard {
  currency: (keyof typeof supportedCurrencies)[];
}

interface MaxRiskType extends CurrencyTypeCard {
  additionalData: { maxDCA: number, totalBankroll: number, inactiveBotFunds: number }
  type: 'max-risk'
}

interface TotalBankroll extends CurrencyTypeCard {
  additionalData: { position: number, totalBoughtVolume: number, reservedFundsTotal: number }
  type: 'total-bankroll'
}

interface TotalRoi extends CurrencyTypeCard {
  additionalData: { totalProfit: number, totalBankroll: number }
  type: 'total-roi'
}

interface TotalInDeals extends CurrencyTypeCard {
  additionalData: { onOrders: number, totalBoughtVolume: number }
  type: 'total-in-deals'
}

interface AverageDealHours extends TypeCard {
  additionalData: { totalClosedDeals: number, totalDealHours: number };
  type: 'average-deal-hours'
  // currency: never
}

interface GenericCurrency extends CurrencyTypeCard {
  type: 'active-deal-reserve' | 'average-daily-profit' | 'max-dca'
  | 'todays-profit' | 'total-profit' | 'total-unrealized-profit'
  // additionalData: never
}

interface Generic extends TypeCard {
  type: 'active-deals' | 'drop-coverage' | 'enabled-bots' | 'total-bought-volume' | 'total-deals'
}

export type CardFunctions =
  MaxRiskType | GenericCurrency | Generic
  | AverageDealHours | TotalBankroll | TotalInDeals | TotalRoi | MaxRiskType;
