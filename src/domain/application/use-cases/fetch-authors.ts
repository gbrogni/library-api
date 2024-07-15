import { Either, right } from '@/core/either';
import { Author } from '@/domain/enterprise/entities/author';
import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from '../repositories/authors-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';

interface FetchAuthorsUseCaseRequest {
  page: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

type FetchAuthorsUseCaseResponse = Either<null, { authors: Author[]; }>;

@Injectable()
export class FetchAuthorsUseCase {

  constructor(private authorsRepository: AuthorsRepository) { }

  async execute({
    page,
    limit = 10,
    sortBy = 'createdAt',
    order = 'asc'
  }: FetchAuthorsUseCaseRequest): Promise<FetchAuthorsUseCaseResponse> {
    const paginationParams: PaginationParams = { page, limit, sortBy, order };
    const authors = await this.authorsRepository.fetchAuthors(paginationParams);

    return right({ authors });
  }

}