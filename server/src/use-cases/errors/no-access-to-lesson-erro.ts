export class NoAccessToLessonError extends Error {
  constructor() {
    super('User does have access to selected lesson')
  }
}
