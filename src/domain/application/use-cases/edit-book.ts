import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Book } from '@/domain/enterprise/entities/book';
import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from '../repositories/authors-repository';
import { BooksRepository } from '../repositories/books-repository';
import { UsersRepository } from '../repositories/users-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UserRole } from '@/domain/enterprise/enums/user-role';

interface EditBookUseCaseRequest {
  bookId: string;
  userId: string;
  title: string;
  description: string;
  publishDate: Date;
  authorId: string;
}

type EditBookUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { book: Book; }>;

@Injectable()
export class EditBookUseCase {

  constructor(
    private booksRepository: BooksRepository,
    private authorsRepository: AuthorsRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    bookId,
    userId,
    title,
    description,
    publishDate,
    authorId
  }: EditBookUseCaseRequest): Promise<EditBookUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId);
    const user = await this.usersRepository.findById(userId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    const book = await this.booksRepository.findById(bookId);

    if (!book) {
      return left(new ResourceNotFoundError());
    }

    if (user?.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    book.title = title;
    book.description = description;
    book.publishDate = publishDate;
    book.authorId = author.id;

    await this.booksRepository.update(book);

    return right({ book });
  }

}