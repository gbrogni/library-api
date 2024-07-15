import { GetAuthorByIdUseCase } from '@/domain/application/use-cases/get-author-by-id';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { AuthorPresenter } from '../presenters/author-presenter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authors')
@ApiBearerAuth('access_token')
@Controller('authors/:id')
export class GetAuthorByIdController {

  constructor(private getAuthorByIdUseCase: GetAuthorByIdUseCase) { }

  @Get()
  @ApiOperation({ summary: 'Get author by ID', description: 'Retrieves an author by their ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the author to retrieve', type: String })
  @ApiResponse({ status: 200, description: 'Author retrieved successfully', type: AuthorPresenter })
  @ApiBadRequestResponse({ description: 'Invalid ID supplied' })
  async handle(
    @Param('id') authorId: string
  ) {
    const result = await this.getAuthorByIdUseCase.execute({ authorId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      author: AuthorPresenter.toHttp(result.value.author)
    };
  }

}