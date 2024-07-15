import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Book } from '@/domain/enterprise/entities/book';
import { BooksRepository } from '../repositories/books-repository';
import { Injectable } from '@nestjs/common';

interface GetBookByIdUseCaseRequest {
  bookId: string;
}

type GetBookByIdUseCaseResponse = Either<ResourceNotFoundError, { book: Book; }>;

@Injectable()
export class GetBookByIdUseCase {

  constructor(private booksRepository: BooksRepository) { }

  async execute({
    bookId
  }: GetBookByIdUseCaseRequest): Promise<GetBookByIdUseCaseResponse> {
    const book = await this.booksRepository.findById(bookId);

    if (!book) {
      return left(new ResourceNotFoundError());
    }

    return right({ book });
  }

}