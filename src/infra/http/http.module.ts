import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateAuthorController } from './controllers/create-author.controller';
import { CreateBookController } from './controllers/create-book.controller';
import { DeleteAuthorController } from './controllers/delete-author.controller';
import { DeleteBookController } from './controllers/delete-book.controller';
import { EditAuthorController } from './controllers/edit-author.controller';
import { EditBookController } from './controllers/edit-book.controller';
import { FetchAuthorsController } from './controllers/fetch-authors.controller';
import { FetchBooksController } from './controllers/fetch-books.controller';
import { GetAuthorByIdController } from './controllers/get-author-by-id.controller';
import { GetBookByIdController } from './controllers/get-book-by-id.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user';
import { CreateBookUseCase } from '@/domain/application/use-cases/create-book';
import { CreateAuthorUseCase } from '@/domain/application/use-cases/create-author';
import { DeleteAuthorUseCase } from '@/domain/application/use-cases/delete-author';
import { DeleteBookUseCase } from '@/domain/application/use-cases/delete-book';
import { EditAuthorUseCase } from '@/domain/application/use-cases/edit-author';
import { EditBookUseCase } from '@/domain/application/use-cases/edit-book';
import { FetchAuthorsUseCase } from '@/domain/application/use-cases/fetch-authors';
import { FetchBooksUseCase } from '@/domain/application/use-cases/fetch-books';
import { GetAuthorByIdUseCase } from '@/domain/application/use-cases/get-author-by-id';
import { GetBookByIdUseCase } from '@/domain/application/use-cases/get-book-by-id';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateAuthorController,
    CreateBookController,
    DeleteAuthorController,
    DeleteBookController,
    EditAuthorController,
    EditBookController,
    FetchAuthorsController,
    FetchBooksController,
    GetAuthorByIdController,
    GetBookByIdController
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    CreateAuthorUseCase,
    CreateBookUseCase,
    DeleteAuthorUseCase,
    DeleteBookUseCase,
    EditAuthorUseCase,
    EditBookUseCase,
    FetchAuthorsUseCase,
    FetchBooksUseCase,
    GetAuthorByIdUseCase,
    GetBookByIdUseCase
  ],
})
export class HttpModule { }