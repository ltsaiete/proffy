export class SubjectAlreadyExistsError extends Error {
  constructor() {
    super('Subject with the same name already exists')
  }
}
