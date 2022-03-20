class DateRange {
  public from: Date | null = null;

  public to: Date | null = null;
}

type utcDateRange = {
  utcEndDate: number;
  utcStartDate: number;
};

export { DateRange, utcDateRange };
