import { PaginationParams } from '@/core/repositories/pagination-params';
import { Book } from '@/domain/enterprise/entities/book';

export abstract class BooksRepository {
  abstract create(book: Book): Promise<void>;
  abstract findById(bookId: string): Promise<Book | null>;
  abstract fetchBooks(params: PaginationParams): Promise<Book[]>;
  abstract findByAuthorId(authorId: string): Promise<Book[]>;
  abstract delete(bookId: string): Promise<void>;
  abstract update(book: Book): Promise<void>;
}