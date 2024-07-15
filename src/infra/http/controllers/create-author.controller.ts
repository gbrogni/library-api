import { CreateAuthorUseCase } from '@/domain/application/use-cases/create-author';
import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';
import { Roles } from '@/infra/auth/roles';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

const createAuthorBodySchema = z.object({
  name: z.string(),
  bio: z.string(),
  birthDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format, expected 'YYYY-MM-DD'"
  }).transform(val => new Date(val))
});

type CreateAuthorBodySchema = z.infer<typeof createAuthorBodySchema>;

@ApiTags('Authors')
@ApiBearerAuth('access_token')
@Controller('/authors')
export class CreateAuthorController {

  constructor(private createAuthorUseCase: CreateAuthorUseCase) { }

  @Post()
  @Roles('ADMIN')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create author' })
  @ApiResponse({ status: 201, description: 'Author created' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiBody({
    description: 'Create author data, only ADMIN users can create authors.',
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
          bio: 'Author biography here...',
          birthDate: '2002-10-10',
        },
      },
    },
  })
  async handle(
    @Body() body: CreateAuthorBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { name, bio, birthDate } = body;
    const userId = user.sub.value;

    const result = await this.createAuthorUseCase.execute({
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