import { randomUUID } from 'node:crypto'
import type { Prisma, User } from 'generated/prisma'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id)

    if (!user) return null

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    if (!user) return null

    return user
  }
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    }

    this.items.push(user)

    return user
  }
}
