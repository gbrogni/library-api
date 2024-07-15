import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { BooksRepository } from '../repositories/books-repository';
import { UsersRepository } from '../repositories/users-repository';
import { UserRole } from '@/domain/enterprise/enums/user-role';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteBookUseCaseRequest {
  bookId: string;
  userId: string;
}

type DeleteBookUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class DeleteBookUseCase {

  constructor(
    private booksRepository: BooksRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    bookId,
    userId
  }: DeleteBookUseCaseRequest): Promise<DeleteBookUseCaseResponse> {
    const book = await this.booksRepository.findById(bookId);
    const user = await this.usersRepository.findById(userId);

    if (!book) {
      return left(new ResourceNotFoundError());
    }

    if (user?.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    await this.booksRepository.delete(bookId);

    return right({});
  }

}