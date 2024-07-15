import { CreateBookUseCase } from '@/domain/application/use-cases/create-book';
import { Roles } from '@/infra/auth/roles';
import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

const createBookBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  authorId: z.string(),
});

type CreateBookBodySchema = z.infer<typeof createBookBodySchema>;

@ApiTags('Books')
@ApiBearerAuth('access_token')
@Controller('books')
export class CreateBookController {

  constructor(private createBookUseCase: CreateBookUseCase) { }

  @Post()
  @Roles('ADMIN')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create book' })
  @ApiResponse({ status: 201, description: 'Book created' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiBody({
    description: 'Create book data, only ADMIN users can create books.',
    schema: {
      properties: {
        title: { type: 'string', example: 'Gabriel' },
        description: { type: 'string', example: 'Book description here...' },
        publishDate: { type: 'date', example: '2002-12-12' },
        authorId: { type: 'string', example: '123' },
      },
      required: ['title', 'description', 'publishDate', 'authorId'],
    },
    examples: {
      example1: {
        value: {
          title: 'Guilherme',
          description: 'gui123@gmail.com',
          publishDate: '2002-10-10',
          authorId: '123',
        },
      },
    },
  })
  async handle(
    @Body() body: CreateBookBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, description, publishDate, authorId } = body;
    const userId = user.sub.value;

    const result = await this.createBookUseCase.execute({
      title,
      description,
      publishDate,
      authorId,
      userId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

  }

}