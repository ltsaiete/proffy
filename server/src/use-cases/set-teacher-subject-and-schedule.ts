import type { TeacherSubjectRepository } from '@/repositories/teacher-subject-repository'

interface SetTeacherSubjectAndScheduleUseCaseProps {
  teacherId: string
  subjectId: string
  price: number
  schedule: {
    weekDay: number
    startTime: number
    endTime: number
  }[]
}

export class SetTeacherSubjectAndScheduleUseCase {
  constructor(private teacherSubjectRepository: TeacherSubjectRepository) {}

  execute({
    price,
    teacherId,
    subjectId,
    schedule,
  }: SetTeacherSubjectAndScheduleUseCaseProps) {
    
  }
}
