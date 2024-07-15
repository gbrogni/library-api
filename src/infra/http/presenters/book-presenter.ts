import { Book } from '@/domain/enterprise/entities/book';

export class BookPresenter {

  static toHttp(book: Book) {
    return {
      id: book.id.toString(),
      title: book.title,
      description: book.description,
      publishDate: book.publishDate,
      authorId: book.authorId.toString(),
    }
  }

}