class DateRange {
    public from: Date | null = null;
    public to: Date | null = null;
}

class utcDateRange {
    public utcEndDate: number | null = null;
    public utcStartDate: number | null = null;
}

export {DateRange, utcDateRange}