import { Either, left, right } from '@/core/either';
import { User } from '@/domain/enterprise/entities/user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { UserRole } from '@/domain/enterprise/enums/user-role';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User; }>;

@Injectable()
export class CreateUserUseCase {

  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: passwordHash,
      role,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}