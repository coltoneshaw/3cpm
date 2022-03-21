import React from 'react';
import moment from 'moment';
import { getLang } from '@/utils/helperFunctions';

import CardTooltip from '@/app/Components/Charts/DataCards/CustomToolTip';

import { ProfitArray } from '@/types/3CommasApi';
import { formatCurrency } from '@/utils/granularity';

const lang = getLang();

type StatsReturnType = {
  profitData: ProfitArray[] | [];
  metrics: {
    totalProfit: number;
    averageDailyProfit: number;
    averageDealHours: number;
    totalClosedDeals: number;
    totalDealHours: number;
  },
  priors: {
    month: number,
    week: number,
    day: number
  },
  current: {
    month: number,
    week: number,
    day: number
  }
};

type RoiMetricsType = {
  stats: StatsReturnType,
  bankroll: number,
  date: Date | undefined | null
};

const dateRanges = (date: Date | undefined | null) => {
  if (!date) return null;
  const currentDay = {
    start: moment.utc(date).startOf('day').valueOf(),
    end: moment.utc(date).endOf('day').valueOf(),
  };
  return {
    day: {
      current: { ...currentDay },
      compare: {
        start: moment.utc(currentDay.start).subtract(1, 'd').startOf('day').valueOf(),
        end: moment.utc(currentDay.end).subtract(1, 'd').endOf('day').valueOf(),
      },
    },
    week: {
      current: {
        start: moment.utc(currentDay.end).subtract(6, 'd').startOf('day').valueOf(),
        end: currentDay.end,
      },
      compare: {
        start: moment.utc(currentDay.end).subtract(13, 'd').startOf('day').valueOf(),
        end: moment.utc(currentDay.start).subtract(7, 'd').endOf('day').valueOf(),
      },
    },
    month: {
      current: {
        start: moment.utc(currentDay.end).subtract(30, 'd').startOf('day').valueOf(),
        end: currentDay.end,
      },
      compare: {
        start: moment.utc(currentDay.start).subtract(60, 'd').startOf('day').valueOf(),
        end: moment.utc(currentDay.end).subtract(31, 'd').endOf('day').valueOf(),
      },
    },
  };
};

const ReturnPercent = ({ percent }: { percent: number }) => {
  if (percent > 0) {
    return (
      <span className="green-text roi-percent">
        {`(↑ ${percent.toFixed(2)}%)`}
      </span>
    );
  }
  return (
    <span className="red-text roi-percent">
      {`(↓ ${percent.toFixed(2)}%)`}
    </span>
  );
};

type Ranges = ReturnType<typeof dateRanges>;
type NameType = 'Day' | 'Week' | 'Month';
const formatToTimeString = (time: number) => new Date(time).toLocaleString(lang);

const TooltipText = ({ name, ranges }: { name: NameType, ranges: Ranges }) => {
  let dates;

  switch (name) {
    case 'Day':
      dates = ranges?.day;
      break;
    case 'Week':
      dates = ranges?.week;
      break;
    case 'Month':
      dates = ranges?.month;
      break;
    default:
      break;
  }

  if (!dates) return null;

  return (
    <>
      <h3>{name}</h3>
      <p><strong>Current</strong></p>
      <p style={{ margin: 0, padding: 0 }}>
        <strong>Start: </strong>
        {formatToTimeString(dates.current.start)}
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        <strong>End: </strong>
        {formatToTimeString(dates.current.end)}
      </p>

      <p><strong>Compare</strong></p>
      <p style={{ margin: 0, padding: 0 }}>
        <strong>Start: </strong>
        {formatToTimeString(dates.compare.start)}
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        <strong>End: </strong>
        {formatToTimeString(dates.compare.end)}
      </p>
    </>
  );
};

const MetricDiv = ({
  current, percent, name, ranges,
}: { name: NameType, current: number, percent: number, ranges: Ranges }) => (
  <CardTooltip
    title={<TooltipText name={name} ranges={ranges} />}
  >
    <div className="roiSpan">
      <strong>
        {name}
        :
      </strong>
      <p>
        {`$${formatCurrency(['USD'], current).metric} `}
        <ReturnPercent percent={percent} />
      </p>
    </div>
  </CardTooltip>

);

const calcRoi = (bankroll: number, currentProfit: number, priorProfit: number) => {
  const current = (currentProfit / (bankroll - currentProfit)) * 100;
  const prior = (priorProfit / (bankroll - currentProfit - priorProfit)) * 100;
  const change = current - prior;
  return { prior, current, change };
};

const RoiMetrics: React.FC<RoiMetricsType> = ({ stats, bankroll, date }) => {
  // const [ranges, updateRanges] = useState(() => dateRanges(date))

  const ranges = dateRanges(date);
  const dayDiff = calcRoi(bankroll, stats.current.day, stats.priors.day);
  const weekDiff = calcRoi(bankroll, stats.current.week, stats.priors.week);
  const monthDiff = calcRoi(bankroll, stats.current.month, stats.priors.month);

  return (
    <>
      <MetricDiv name="Day" current={stats.current.day} percent={dayDiff.change} ranges={ranges} />
      <MetricDiv name="Week" current={stats.current.week} percent={weekDiff.change} ranges={ranges} />
      <MetricDiv name="Month" current={stats.current.month} percent={monthDiff.change} ranges={ranges} />
    </>
  );
};

export default RoiMetrics;
