import { describe } from 'node:test'
import { beforeEach, expect, it } from 'vitest'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { CreateSubjectUseCase } from './create-subject'
import { SubjectAlreadyExistsError } from './errors/subject-already-exists-error'

describe('Create subject use case', () => {
  let subjectsRepository: InMemorySubjectsRepository
  let sut: CreateSubjectUseCase

  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new CreateSubjectUseCase(subjectsRepository)
  })

  it('should create a subject', async () => {
    const subject = await sut.execute({ name: 'Maths', description: '' })

    expect(subject.id).toEqual(expect.any(String))
  })

  it('Should not be able to create two subjects with the same name', async () => {
    await subjectsRepository.create({
      name: 'Maths',
    })

    await expect(() => sut.execute({ name: 'Maths' })).rejects.toBeInstanceOf(
      SubjectAlreadyExistsError,
    )
  })
})
