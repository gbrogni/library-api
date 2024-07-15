import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { Injectable } from '@nestjs/common';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { UsersRepository } from '../repositories/users-repository';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, { accessToken: string; refreshToken: string; userRole: string; }>;

@Injectable()
export class AuthenticateUserUseCase {

  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) { }

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const passwordMatch = await this.hashComparer.compare(password, user.password);

    if (!passwordMatch) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
      role: user.role,
    });

    const refreshToken = await this.encrypter.encrypt({
      sub: user.id,
      role: user.role,
    }, '7d');

    return right({
      accessToken,
      userRole: user.role,
      refreshToken
    });
  }

  async refreshToken(refreshToken: string): Promise<Either<Error, { accessToken: string, newRefreshToken?: string; }>> {
      const validation = await this.encrypter.validateRefreshToken(refreshToken);
      if (validation.isLeft()) {
        return left(validation.value);
      }
    
      const userId = await this.encrypter.getUserIdFromRefreshToken(refreshToken);
      const user = await this.usersRepository.findById(userId);
      if (!user) {
        return left(new Error('User not found'));
      }
    
      const accessToken = await this.encrypter.encrypt({
        sub: user.id,
        role: user.role,
      });
      const newRefreshToken = await this.encrypter.generateRefreshToken(user);
    
      return right({ accessToken, newRefreshToken });
    }

}