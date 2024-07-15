import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { User } from '@/domain/enterprise/entities/user';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../mongoose/schemas/user.schema';
import { UserMapper } from '../mappers/user-mapper';

@Injectable()
export class MongoUsersRepository implements UsersRepository {
  constructor(
    @InjectModel('users') private readonly usersModel: Model<UserDocument>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersModel.findOne({ email }).exec();
    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  async findById(id: string | { value: string }): Promise<User | null> {
    const userId = typeof id === 'object' && id.value ? id.value : id;
    const user = await this.usersModel.findById(userId).exec();
    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const userData = UserMapper.toMongo(user);
    await this.usersModel.create(userData);
  }

  async update(user: User): Promise<void> {
    const userData = UserMapper.toMongo(user);
    await this.usersModel.findByIdAndUpdate(userData._id, userData).exec();
  }

}