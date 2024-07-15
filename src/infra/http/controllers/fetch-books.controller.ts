import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { FetchBooksUseCase } from '@/domain/application/use-cases/fetch-books';
import { BookPresenter } from '../presenters/book-presenter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

const queryParamsSchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default('10').transform(Number).pipe(z.number().min(1)),
  sortBy: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  title: z.string().optional(),
  authorName: z.string().optional()
});

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema);

type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

@ApiTags('Books')
@ApiBearerAuth('access_token')
@Controller('/books')
export class FetchBooksController {

  constructor(private fetchBooksUseCase: FetchBooksUseCase) { }

  @Get()
  @ApiOperation({ summary: 'Fetch books', description: 'Fetches a list of books based on query parameters.' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort the books by' })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false, description: 'Order of the sorting (ascending or descending)' })
  @ApiQuery({ name: 'title', type: String, required: false, description: 'Filter books by title' })
  @ApiQuery({ name: 'authorName', type: String, required: false, description: 'Filter books by author name' })
  @ApiResponse({ status: 200, description: 'Books fetched successfully' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async handle(
    @Query(queryValidationPipe) query: QueryParamsSchema
  ) {
    const result = await this.fetchBooksUseCase.execute(query);

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const books = result.value.books;

    return {
      books: books.map(BookPresenter.toHttp)
    };
  }

}
