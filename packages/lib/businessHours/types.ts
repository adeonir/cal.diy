export type BusinessHours = {
  /** Minutes since midnight in the organizer timezone */
  startTime: number;
  /** Minutes since midnight in the organizer timezone, always greater than startTime */
  endTime: number;
  /** Active weekdays, 0 = Sunday, matching WorkingHours["days"] */
  days: number[];
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  startTime: 9 * 60,
  endTime: 17 * 60,
  days: [1, 2, 3, 4, 5],
};
