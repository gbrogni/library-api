import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksRepository } from '@/domain/application/repositories/books-repository';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { MongoBooksRepository } from './repositories/mongo-books-repository';
import { MongoUsersRepository } from './repositories/mongo-users-repository';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { AuthorsRepository } from '@/domain/application/repositories/authors-repository';
import { MongoAuthorsRepository } from './repositories/mongo-authors-repository';
import { AuthorSchema } from './mongoose/schemas/author.schema';
import { BookSchema } from './mongoose/schemas/book.schema';
import { UserSchema } from './mongoose/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'authors', schema: AuthorSchema }]),
    MongooseModule.forFeature([{ name: 'books', schema: BookSchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
    EnvModule,
    MongooseModule.forRootAsync({
      imports: [EnvModule],
      useFactory: async (envService: EnvService) => ({
        uri: envService.get('DATABASE_URL'),
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    {
      provide: AuthorsRepository,
      useClass: MongoAuthorsRepository,
    },
    {
      provide: BooksRepository,
      useClass: MongoBooksRepository,
    },
    {
      provide: UsersRepository,
      useClass: MongoUsersRepository,
    },
  ],
  exports: [
    AuthorsRepository,
    BooksRepository,
    UsersRepository,
  ],
})
export class DatabaseModule { }