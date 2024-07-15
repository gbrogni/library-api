import { Book } from '@/domain/enterprise/entities/book';
import { BookDocument } from '../mongoose/schemas/book.schema';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class BookMapper {

  static toDomain(bookDocument: BookDocument): Book {
    return Book.create({
      title: bookDocument.title,
      description: bookDocument.description,
      publishDate: bookDocument.publishDate,
      authorId: new UniqueEntityID(bookDocument.authorId.toString()),
    }, new UniqueEntityID(bookDocument._id));
  }

  static toMongo(book: Book): BookDocument {
    return {
      _id: book.id.toString(),
      title: book.title,
      description: book.description,
      publishDate: book.publishDate,
      authorId: book.authorId.toString(),
    } as unknown as BookDocument;
  }

}