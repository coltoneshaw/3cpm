class DateRange {
  public from: Date | null = null;

  public to: Date | null = null;
}

type UtcDateRange = {
  utcEndDate: number;
  utcStartDate: number;
};

export { DateRange, UtcDateRange };
