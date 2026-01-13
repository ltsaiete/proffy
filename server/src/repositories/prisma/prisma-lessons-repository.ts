import type { Prisma } from 'generated/prisma'
import { prisma } from '@/lib/prisma'
import type {
  FindByStudentIdOnTimeProps,
  FindByTeacherIdOnTimeProps,
  LessonsRepository,
} from '../lessons-repository'

export class PrismaLessonsRepository implements LessonsRepository {
  async findById(id: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        student: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    return lesson
  }
  async create(data: Prisma.LessonUncheckedCreateInput) {
    const lesson = await prisma.lesson.create({
      data,
    })

    return lesson
  }

  async countByTeacherId(teacherId: string) {
    const lessonsCount = await prisma.lesson.count({
      where: {
        teacherId,
      },
    })

    return lessonsCount
  }

  async findManyByTeacherId(teacherId: string, page: number) {
    const lessons = await prisma.lesson.findMany({
      where: {
        teacherId,
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return lessons
  }

  async findManyByTeacherIdOnTime({
    teacherId,
    from,
    to,
  }: FindByTeacherIdOnTimeProps) {
    const lessons = await prisma.lesson.findMany({
      where: {
        teacherId,
        startTime: {
          gte: from,
          lt: to,
        },
      },
    })

    return lessons
  }

  async findManyByStudentIdOnTime({
    studentId,
    from,
    to,
  }: FindByStudentIdOnTimeProps) {
    const lessons = await prisma.lesson.findMany({
      where: {
        studentId,
        startTime: {
          gte: from,
          lt: to,
        },
      },
    })
    return lessons
  }

  async findByTeacherIdOnTime({
    teacherId,
    from,
    to,
  }: FindByTeacherIdOnTimeProps) {
    const lesson = await prisma.lesson.findFirst({
      where: {
        teacherId,
        OR: [
          {
            startTime: {
              gte: from,
              lt: to,
            },
            endTime: {
              gt: from,
              lte: to,
            },
            AND: [
              {
                startTime: {
                  lte: from,
                },
                endTime: {
                  gte: to,
                },
              },
            ],
          },
        ],
      },
    })
    return lesson
  }

  async findByStudentIdOnTime({
    studentId,
    from,
    to,
  }: FindByStudentIdOnTimeProps) {
    const lesson = await prisma.lesson.findFirst({
      where: {
        studentId,
        OR: [
          {
            startTime: {
              gte: from,
              lt: to,
            },
            endTime: {
              gt: from,
              lte: to,
            },
            AND: [
              {
                startTime: {
                  lte: from,
                },
                endTime: {
                  gte: to,
                },
              },
            ],
          },
        ],
      },
    })
    return lesson
  }
}
