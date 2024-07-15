import { GetBookByIdUseCase } from '@/domain/application/use-cases/get-book-by-id';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { BookPresenter } from '../presenters/book-presenter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@ApiBearerAuth('access_token')
@Controller('books/:id')
export class GetBookByIdController {

  constructor(private getBookByIdUseCase: GetBookByIdUseCase) { }

  @Get()
  @ApiOperation({ summary: 'Get book by ID', description: 'Retrieves an book by their ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the book to retrieve', type: String })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully', type: BookPresenter })
  @ApiBadRequestResponse({ description: 'Invalid ID supplied' })
  async handle(
    @Param('id') bookId: string
  ) {
    const result = await this.getBookByIdUseCase.execute({ bookId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      book: BookPresenter.toHttp(result.value.book)
    };
  }

}