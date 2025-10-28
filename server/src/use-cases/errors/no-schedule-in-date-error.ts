export class NoScheduleInDateError extends Error {
  constructor() {
    super('Teacher does not have a schedule in selected date')
  }
}
