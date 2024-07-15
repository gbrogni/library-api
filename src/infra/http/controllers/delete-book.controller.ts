import { DeleteBookUseCase } from '@/domain/application/use-cases/delete-book';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Roles } from '@/infra/auth/roles';
import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Books')
@ApiBearerAuth('access_token')
@Controller('/books/:id')
export class DeleteBookController {

  constructor(private deleteBookUseCase: DeleteBookUseCase) { }

  @Delete()
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete an book', description: 'Deletes an book by ID. Only accessible by ADMIN users.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the book to delete' })
  @ApiResponse({ status: 204, description: 'Book deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data or parameters' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string
  ) {
    const userId = user.sub.value;
    const result = await this.deleteBookUseCase.execute({ bookId: id, userId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }

}