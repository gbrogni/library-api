import { PaginationParams } from '@/core/repositories/pagination-params';
import { BooksRepository } from '@/domain/application/repositories/books-repository';
import { Book } from '@/domain/enterprise/entities/book';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookDocument } from '../mongoose/schemas/book.schema';
import { BookMapper } from '../mappers/book-mapper';
import { AuthorDocument } from '../mongoose/schemas/author.schema';

@Injectable()
export class MongoBooksRepository implements BooksRepository {

  constructor(
    @InjectModel('books') private readonly booksModel: Model<BookDocument>,
    @InjectModel('authors') private readonly authorsModel: Model<AuthorDocument>
  ) { }

  async create(book: Book): Promise<void> {
    const createdBook = BookMapper.toMongo(book);
    await this.booksModel.create(createdBook);
  }

  async findById(bookId: string): Promise<Book | null> {
    const book = await this.booksModel.findById(bookId).exec();
    if (!book) return null;
    return BookMapper.toDomain(book);
  }

  async fetchBooks(params: PaginationParams): Promise<Book[]> {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc', title, authorName } = params;
    const query = {};
    if (title) query['title'] = { $regex: title, $options: 'i' };
    if (authorName) {
      const authorIds = await this.authorsModel.find({ name: { $regex: authorName, $options: 'i' } }, '_id');
      query['authorId'] = { $in: authorIds.map(a => a._id) };
    }

    const skip = (page - 1) * limit;
    const books = await this.booksModel
      .find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return books.map(BookMapper.toDomain);
  }

  async findByAuthorId(authorId: string): Promise<Book[]> {
    const bookDocuments = await this.booksModel.find({ authorId }).exec();
    return bookDocuments.map(BookMapper.toDomain);
  }

  async delete(bookId: string): Promise<void> {
    this.booksModel.findByIdAndDelete(bookId).exec();
  }

  async update(book: Book): Promise<void> {
    const bookData = BookMapper.toMongo(book);
    await this.booksModel.findByIdAndUpdate(bookData._id, bookData).exec();
  }

}