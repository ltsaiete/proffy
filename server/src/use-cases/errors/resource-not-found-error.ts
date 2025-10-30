export class ResourceNotFoundError extends Error {
  constructor(resourceName?: string) {
    super(`${resourceName ? resourceName : 'Resource'} not found.`)
  }
}
