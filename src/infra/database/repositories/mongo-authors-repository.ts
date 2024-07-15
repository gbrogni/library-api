import { AuthorsRepository } from '@/domain/application/repositories/authors-repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthorDocument } from '../mongoose/schemas/author.schema';
import { Model } from 'mongoose';
import { Author } from '@/domain/enterprise/entities/author';
import { AuthorMapper } from '../mappers/author-mapper';
import { PaginationParams } from '@/core/repositories/pagination-params';

@Injectable()
export class MongoAuthorsRepository implements AuthorsRepository {

  constructor(@InjectModel('authors') private readonly authorsModel: Model<AuthorDocument>) { }

  async create(author: Author): Promise<void> {
    const authorData = AuthorMapper.toMongo(author);
    await this.authorsModel.create(authorData);
  }

  async findById(authorId: string): Promise<Author | null> {
    const author = await this.authorsModel.findById(authorId).exec();
    if (!author) return null;
    return AuthorMapper.toDomain(author);
  }

  async fetchAuthors(params: PaginationParams): Promise<Author[]> {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc' } = params;
    const skip = (page - 1) * limit;
    const authors = await this.authorsModel
      .find()
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return authors.map(AuthorMapper.toDomain);
  }

  async delete(authorId: string): Promise<void> {
    await this.authorsModel.findByIdAndDelete(authorId).exec();
  }

  async update(author: Author): Promise<void> {
    const authorData = AuthorMapper.toMongo(author);
    await this.authorsModel.findByIdAndUpdate(authorData._id, authorData).exec();
  }

}