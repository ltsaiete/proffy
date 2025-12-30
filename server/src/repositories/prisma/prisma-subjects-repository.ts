import type { Prisma } from 'generated/prisma'
import { prisma } from '@/lib/prisma'
import type { SubjectsRepository } from '../subjects-repository'

export class PrismaSubjectsRepository implements SubjectsRepository {
  async findById(id: string) {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    })
    return subject
  }

  async findByName(name: string) {
    const subject = await prisma.subject.findUnique({
      where: { name },
    })

    return subject
  }

  async create(data: Prisma.SubjectCreateInput) {
    const subject = await prisma.subject.create({
      data,
    })

    return subject
  }
}
