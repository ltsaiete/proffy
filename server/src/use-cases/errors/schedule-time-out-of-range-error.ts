export class ScheduleTimeOutOfRangeError extends Error {
  constructor() {
    super(
      'Schedule time out o allowed range. Classes must be between 7AM and 6PM',
    )
  }
}
