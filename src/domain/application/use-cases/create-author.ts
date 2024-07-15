import { Either, left, right } from '@/core/either';
import { Author } from '@/domain/enterprise/entities/author';
import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from '../repositories/authors-repository';
import { UsersRepository } from '../repositories/users-repository';
import { UserRole } from '@/domain/enterprise/enums/user-role';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface CreateAuthorUseCaseRequest {
  name: string;
  bio: string;
  birthDate: Date;
  userId: string
}

type CreateAuthorUseCaseResponse = Either<null | NotAllowedError, { author: Author; }>;

@Injectable()
export class CreateAuthorUseCase {

  constructor(
    private authorsRepository: AuthorsRepository,
    private usersRepository: UsersRepository
  ) { }

  async execute({
    name,
    bio,
    birthDate,
    userId
  }: CreateAuthorUseCaseRequest): Promise<CreateAuthorUseCaseResponse> {
    const author = Author.create({ name, bio, birthDate });
    const user = await this.usersRepository.findById(userId);

    if (user?.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    await this.authorsRepository.create(author);

    return right({ author });
  }

}