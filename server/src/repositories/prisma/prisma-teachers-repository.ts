import type { Prisma, Teacher } from 'generated/prisma'
import { prisma } from '@/lib/prisma'
import type {
  CreateWithScheduleProps,
  FindManyNearbyProps,
  TeachersRepository,
  TeacherWithUserAndSubject,
} from '../teachers-repository'

export class PrismaTeachersRepository implements TeachersRepository {
  async create(data: Prisma.TeacherUncheckedCreateInput): Promise<Teacher> {
    const teacher = await prisma.teacher.create({
      data,
    })

    return teacher
  }
  async findManyNearby({ latitude, longitude }: FindManyNearbyProps) {
    const teachers = prisma.$queryRaw<TeacherWithUserAndSubject[]>`
      SELECT * FROM teachers
      LEFT JOIN users ON teachers.user_id = users.id
      -- LEFT JOIN subjects ON teachers.subject_id = subject.id
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return teachers
  }

  async findManyBySubject(subjectId: string, page: number) {
    const teachers = await prisma.teacher.findMany({
      where: { subjectId },
      include: {
        user: true,
        subject: true,
      },
      take: 10,
      skip: (page - 1) * 10,
    })
    return teachers
  }

  async findById(id: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    })
    return teacher
  }

  async findByUserId(teacherUserId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: teacherUserId },
    })

    return teacher
  }

  async createWithSchedule(data: CreateWithScheduleProps) {
    const teacher = await prisma.teacher.create({
      data: {
        ...data.teacher,
        schedule: { create: data.schedule },
      },
    })
    return teacher
  }
}
