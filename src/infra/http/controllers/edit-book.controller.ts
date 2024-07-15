import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { z } from 'zod';
import { EditBookUseCase } from '@/domain/application/use-cases/edit-book';
import { Roles } from '@/infra/auth/roles';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

const editBookBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  authorId: z.string(),
});

type EditBookBodySchema = z.infer<typeof editBookBodySchema>;

@ApiTags('Books')
@ApiBearerAuth('access_token')
@Controller('/books/:id')
export class EditBookController {

  constructor(private editBookUseCase: EditBookUseCase) { }

  @Put()
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Edit book' })
  @ApiResponse({ status: 204, description: 'Book edited' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the book to edit' })
  @ApiBody({
    description: 'Edit book data, only ADMIN users can edit books.',
    schema: {
      properties: {
        name: { type: 'string', example: 'Gabriel' },
        description: { type: 'string', example: 'Book description here...' },
        publishDate: { type: 'date', example: '2002-12-12' },
        authorId: { type: 'string', example: '123' },
      },
      required: ['name', 'bio', 'publishDate', 'authorId'],
    },
    examples: {
      example1: {
        value: {
          name: 'Guilherme',
          bio: 'gui123@gmail.com',
          publishDate: '2002-10-10',
          authorId: '123',
        },
      },
    },
  })
  async handle(
    @Body() body: EditBookBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') bookId: string,
  ) {
    const { title, description, publishDate, authorId } = body;
    const userId = user.sub.value;

    const result = await this.editBookUseCase.execute({ bookId, userId, title, description, publishDate, authorId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}