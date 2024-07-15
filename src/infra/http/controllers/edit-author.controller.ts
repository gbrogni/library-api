import { z } from 'zod';
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { EditAuthorUseCase } from '@/domain/application/use-cases/edit-author';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { Roles } from '@/infra/auth/roles';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

const editAuthorBodySchema = z.object({
  name: z.string(),
  bio: z.string(),
  birthDate: z.date()
});

type EditAuthorBodySchema = z.infer<typeof editAuthorBodySchema>;

@ApiTags('Authors')
@ApiBearerAuth('access_token')
@Controller('/authors/:id')
export class EditAuthorController {

  constructor(private editAuthorBodySchema: EditAuthorUseCase) { }

  @Put()
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Edit author' })
  @ApiResponse({ status: 204, description: 'Author edited' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the author to edit' })
  @ApiBody({
    description: 'Edit author data, only ADMIN users can edit authors.',
    schema: {
      properties: {
        name: { type: 'string', example: 'Guilherme' },
        bio: { type: 'string', example: 'Author biography here...' },
        birthDate: { type: 'date', example: '123' },
      },
      required: ['name', 'bio', 'birthDate'],
    },
    examples: {
      example1: {
        value: {
          name: 'Guilherme',
          bio: 'gui123@gmail.com',
          birthDate: '2002-10-10',
        },
      },
    },
  })
  async handle(
    @Body() body: EditAuthorBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') authorId: string,
  ) {
    const { name, bio, birthDate } = body;
    const userId = user.sub.value;

    const result = await this.editAuthorBodySchema.execute({
      authorId,
      name,
      bio,
      birthDate,
      userId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

  }

}