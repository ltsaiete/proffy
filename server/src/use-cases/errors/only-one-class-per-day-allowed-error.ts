export class OnlyOneClassPerDayAllowedError extends Error {
  constructor() {
    super('Only one class per day is allowed')
  }
}
