import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from '../repositories/authors-repository';
import { BooksRepository } from '../repositories/books-repository';
import { AuthorHasLinkedBooksError } from './errors/author-has-linked-books-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UsersRepository } from '../repositories/users-repository';
import { UserRole } from '@/domain/enterprise/enums/user-role';

interface DeleteAuthorUseCaseRequest {
  authorId: string;
  userId: string;
}

type DeleteAuthorUseCaseResponse = Either<ResourceNotFoundError | AuthorHasLinkedBooksError | NotAllowedError, {}>;

@Injectable()
export class DeleteAuthorUseCase {

  constructor(
    private authorsRepository: AuthorsRepository,
    private booksRepository: BooksRepository,
    private usersRepository: UsersRepository
  ) { }

  async execute({
    authorId,
    userId
  }: DeleteAuthorUseCaseRequest): Promise<DeleteAuthorUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId);
    const user = await this.usersRepository.findById(userId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    if (user?.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    const linkedBooks = await this.booksRepository.findByAuthorId(authorId);

    if (linkedBooks.length) {
      return left(new AuthorHasLinkedBooksError(author.name));
    }

    await this.authorsRepository.delete(authorId);

    return right({});
  }

}