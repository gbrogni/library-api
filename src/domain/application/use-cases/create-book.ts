import { Either, left, right } from '@/core/either';
import { Book } from '@/domain/enterprise/entities/book';
import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from '../repositories/authors-repository';
import { BooksRepository } from '../repositories/books-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UsersRepository } from '../repositories/users-repository';
import { UserRole } from '@/domain/enterprise/enums/user-role';

interface CreateBookUseCaseRequest {
  title: string;
  description: string;
  publishDate: Date;
  authorId: string;
  userId: string;
}

type CreateBookUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { book: Book; }>;

@Injectable()
export class CreateBookUseCase {

  constructor(
    private authorsRepository: AuthorsRepository,
    private booksRepository: BooksRepository,
    private usersRepository: UsersRepository
  ) { }

  async execute({
    title,
    description,
    publishDate,
    authorId,
    userId
  }: CreateBookUseCaseRequest): Promise<CreateBookUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId);
    const user = await this.usersRepository.findById(userId);

    console.log('author', author);
    console.log('user', user);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    if (user?.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    const book = Book.create({
      authorId: new UniqueEntityID(authorId),
      title,
      description,
      publishDate
    });

    await this.booksRepository.create(book);

    return right({ book });

  }

}