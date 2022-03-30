import { Deals } from '@/types/3cAPI';

export interface PreStorageDeals3cAPI extends Deals.Responses.Deal {
  max_safety_orders: number;
  realized_actual_profit_usd: null | number;
  deal_hours: number;
  pair: string;
  currency: string;
  completed_manual_safety_orders_count: number;
  max_deal_funds: number | null;
  impactFactor: number | null;
  profitPercent: string | null;
  closed_at_iso_string: number | null
}
