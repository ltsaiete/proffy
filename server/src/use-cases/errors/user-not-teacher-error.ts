export class UserNotTeacherError extends Error {
  constructor() {
    super('User not registered as teacher')
  }
}
