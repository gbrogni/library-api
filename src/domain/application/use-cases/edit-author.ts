import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Author } from '@/domain/enterprise/entities/author';
import { AuthorsRepository } from '../repositories/authors-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UserRole } from '@/domain/enterprise/enums/user-role';
import { UsersRepository } from '../repositories/users-repository';
import { Injectable } from '@nestjs/common';

interface EditAuthorUseCaseRequest {
  authorId: string;
  name: string;
  bio: string;
  birthDate: Date;
  userId: string;
}

type EditAuthorUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { author: Author; }>;

@Injectable()
export class EditAuthorUseCase {

  constructor(
    private authorsRepository: AuthorsRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    authorId,
    name,
    bio,
    birthDate,
    userId
  }: EditAuthorUseCaseRequest): Promise<EditAuthorUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId);
    const user = await this.usersRepository.findById(userId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    if (user?.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    author.name = name;
    author.bio = bio;
    author.birthDate = birthDate;

    await this.authorsRepository.update(author);

    return right({ author });
  }

}