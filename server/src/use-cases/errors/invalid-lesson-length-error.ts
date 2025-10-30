export class InvalidLessonLengthError extends Error {
  constructor() {
    super('Lesson cannot be scheduled for less than 30 min')
  }
}
