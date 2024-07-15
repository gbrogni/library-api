import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Author } from '@/domain/enterprise/entities/author';
import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from '../repositories/authors-repository';

interface GetAuthorByIdUseCaseRequest {
  authorId: string;
}

type GetAuthorByIdUseCaseResponse = Either<ResourceNotFoundError, { author: Author; }>;

@Injectable()
export class GetAuthorByIdUseCase {

  constructor(private authorsRepository: AuthorsRepository) { }

  async execute({
    authorId
  }: GetAuthorByIdUseCaseRequest): Promise<GetAuthorByIdUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    return right({ author });
  }

}