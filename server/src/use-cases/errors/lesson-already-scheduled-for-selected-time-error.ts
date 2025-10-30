export class LessonAlreadyScheduledForSelectedTimeError extends Error {
  constructor() {
    super('There is already a lesson scheduled for the selected time')
  }
}
