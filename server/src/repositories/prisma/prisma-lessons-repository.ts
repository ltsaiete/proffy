import type { Prisma } from 'generated/prisma'
import { prisma } from '@/lib/prisma'
import type {
  FindByStudentIdOnTimeOptionsProps,
  FindByTeacherIdOnTimeOptions,
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

  async findManyByTeacherIdOnTime(
    teacherId: string,
    { from, to }: FindByTeacherIdOnTimeOptions,
  ) {
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

  async findManyByStudentIdOnTime(
    studentId: string,
    { from, to }: FindByStudentIdOnTimeOptionsProps,
  ) {
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
  }: FindByTeacherIdOnTimeOptions) {
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
