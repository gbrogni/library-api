import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { object, z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { UserRole } from '@/domain/enterprise/enums/user-role';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['ADMIN', 'COMMON']),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@ApiTags('Accounts')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private createUser: CreateUserUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiBody({
    description: 'User login credentials. The `role` can be either `ADMIN` or `COMMON`.',
    schema: {
      properties: {
        name: { type: 'string', example: 'Guilherme' },
        email: { type: 'string', format: 'email', example: 'gui123@gmail.com' },
        password: { type: 'string', example: '123' },
        role: {
          type: 'string',
          description: 'Role of the user',
          enum: ['ADMIN', 'COMMON'],
          example: 'ADMIN'
        },
      },
      required: ['name', 'email', 'password', 'role'],
    },
    examples: {
      example1: {
        value: {
          name: 'Guilherme',
          email: 'gui123@gmail.com',
          password: '123',
          role: 'ADMIN',
        },
      },
    },
  })
  async handle(
    @Body() body: CreateAccountBodySchema
  ) {
    const { name, email, password, role } = body;

    const result = await this.createUser.execute({
      name,
      email,
      password,
      role: UserRole[role.toUpperCase() as keyof typeof UserRole]
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

  }
}
