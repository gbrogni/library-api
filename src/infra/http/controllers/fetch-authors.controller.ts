import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { FetchAuthorsUseCase } from '@/domain/application/use-cases/fetch-authors';
import { AuthorPresenter } from '../presenters/author-presenter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

const queryParamsSchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default('10').transform(Number).pipe(z.number().min(1)),
  sortBy: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('asc')
});


const queryValidationPipe = new ZodValidationPipe(queryParamsSchema);

type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

@ApiTags('Authors')
@ApiBearerAuth('access_token')
@Controller('/authors')
export class FetchAuthorsController {

  constructor(private fetchAuthorsUseCase: FetchAuthorsUseCase) { }

  @Get()
  @ApiOperation({ summary: 'Fetch authors', description: 'Fetches a list of authors based on query parameters.' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort the authors by' })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false, description: 'Order of the sorting (ascending or descending)' })
  @ApiResponse({ status: 200, description: 'Authors fetched successfully' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async handle(
    @Query(queryValidationPipe) query: QueryParamsSchema
  ) {
    const result = await this.fetchAuthorsUseCase.execute(query);

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const authors = result.value.authors;

    return {
      authors: authors.map(AuthorPresenter.toHttp)
    };
  }

}