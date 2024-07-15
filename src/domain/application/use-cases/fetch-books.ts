import { Either, right } from '@/core/either';
import { Book } from '@/domain/enterprise/entities/book';
import { Injectable } from '@nestjs/common';
import { BooksRepository } from '../repositories/books-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';

interface FetchBooksUseCaseRequest {
  page: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  title?: string;
  authorName?: string;
}

type FetchBooksUseCaseResponse = Either<null, { books: Book[]; }>;

@Injectable()
export class FetchBooksUseCase {

  constructor(private booksRepository: BooksRepository) { }

  async execute({
    page,
    limit = 10,
    sortBy = 'createdAt',
    order = 'asc',
    title,
    authorName
  }: FetchBooksUseCaseRequest): Promise<FetchBooksUseCaseResponse> {
    const paginationParams: PaginationParams = { page, limit, sortBy, order, title, authorName };
    const books = await this.booksRepository.fetchBooks(paginationParams);

    return right({ books });
  }

}