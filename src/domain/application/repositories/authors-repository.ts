import { PaginationParams } from '@/core/repositories/pagination-params';
import { Author } from '@/domain/enterprise/entities/author';

export abstract class AuthorsRepository {
  abstract create(author: Author): Promise<void>;
  abstract findById(authorId: string): Promise<Author | null>;
  abstract fetchAuthors(params: PaginationParams): Promise<Author[]>;
  abstract delete(authorId: string): Promise<void>;
  abstract update(author: Author): Promise<void>;
}