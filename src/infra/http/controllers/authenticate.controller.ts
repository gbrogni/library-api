import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@ApiTags('Authenticate')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      properties: {
        email: { type: 'string', format: 'email', example: 'gui123@gmail.com' },
        password: { type: 'string', example: '123' },
      },
      required: ['email', 'password'],
    },
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'strongpassword123',
        },
      },
    },
  })
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken, userRole, refreshToken } = result.value;

    return {
      access_token: accessToken,
      user_role: userRole,
      refresh_token: refreshToken,
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh user token' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiBody({
    description: 'Refresh token',
    type: String,
    examples: {
      example1: {
        value: {
          refresh_token: 'your refresh token here',
        },
      },
    },
  })
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    const newTokens = await this.authenticateUser.refreshToken(refreshToken);

    if (newTokens.isLeft()) {
      const error = newTokens.value;
      throw new UnauthorizedException(error.message);
    }

    const { accessToken, newRefreshToken } = newTokens.value;

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }
}
