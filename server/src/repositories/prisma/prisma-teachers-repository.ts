import type { Prisma, Teacher } from 'generated/prisma'
import { Decimal } from 'generated/prisma/runtime/library'
import { prisma } from '@/lib/prisma'
import type {
  CreateWithScheduleProps,
  FindManyNearbyProps,
  TeachersRepository,
  TeacherWithUserAndSubject,
} from '../teachers-repository'

interface TeacherWithUserAndSubjectRawProps {
  id: string
  price: number
  description: string
  latitude: number
  longitude: number
  user_id: string
  subject_id: string
  user_name: string
  subject_name: string
  email: string
  created_at: Date
  subject_description: string
}

export class PrismaTeachersRepository implements TeachersRepository {
  async create(data: Prisma.TeacherUncheckedCreateInput): Promise<Teacher> {
    const teacher = await prisma.teacher.create({
      data,
    })

    return teacher
  }
  async findManyNearby({ latitude, longitude }: FindManyNearbyProps) {
    const teachers = await prisma.$queryRaw<
      TeacherWithUserAndSubjectRawProps[]
    >`
      SELECT
        t.id,
        t.price,
        t.description,
        t.latitude,
        t.longitude,
        t.user_id,
        t.subject_id,
        u.id as user_id,
        u.name as user_name,
        u.email,
        u.created_at,
        s.id as subject_id,
        s.name as subject_name,
        s.description as subject_description
      FROM teachers t
      LEFT JOIN users u
        ON t.user_id = u.id
      LEFT JOIN subjects s
        ON t.subject_id = s.id
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    const serializedTeachers = teachers.map((teacher) => {
      return {
        ...teacher,
        latitude: Decimal(teacher.latitude),
        longitude: Decimal(teacher.longitude),
        userId: teacher.user_id,
        subjectId: teacher.subject_id,
        user: {
          id: teacher.user_id,
          name: teacher.user_name,
          email: teacher.email,
          createdAt: teacher.created_at,
        },
        subject: {
          id: teacher.subject_id,
          name: teacher.subject_name,
          description: teacher.subject_description,
        },
      }
    })
    return serializedTeachers
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
