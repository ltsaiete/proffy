export class TeacherAlreadyHasSubjectAssignedError extends Error {
  constructor() {
    super('Teacher already has subject assigned')
  }
}
