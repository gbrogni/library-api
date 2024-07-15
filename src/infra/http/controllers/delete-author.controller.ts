import { DeleteAuthorUseCase } from '@/domain/application/use-cases/delete-author';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Roles } from '@/infra/auth/roles';
import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Authors')
@ApiBearerAuth('access_token')
@Controller('/authors/:id')
export class DeleteAuthorController {

  constructor(private deleteAuthorUseCase: DeleteAuthorUseCase) { }

  @Delete()
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete an author', description: 'Deletes an author by ID. Only accessible by ADMIN users.' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the author to delete' })
  @ApiResponse({ status: 204, description: 'Author deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data or parameters' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string
  ) {
    const userId = user.sub.value;
    const result = await this.deleteAuthorUseCase.execute({ authorId: id, userId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }

}