export class TeacherAlreadyHasScheduleError extends Error {
  constructor() {
    super('Teacher already has a schedule')
  }
}
