import { randomUUID } from 'node:crypto'
import type { Prisma, Subject } from 'generated/prisma'
import type { SubjectsRepository } from '../subjects-repository'

export class InMemorySubjectsRepository implements SubjectsRepository {
  public items: Subject[] = []

  async findById(id: string) {
    const subject = this.items.find((subject) => subject.id === id)
    if (!subject) return null

    return subject
  }

  async findByName(name: string) {
    const subject = this.items.find((subject) => subject.name === name)
    if (!subject) return null

    return subject
  }
  async create(data: Prisma.SubjectCreateInput) {
    const subject = {
      id: randomUUID(),
      name: data.name,
      description: data.description ? data.description : null,
    }

    this.items.push(subject)

    return subject
  }
}
