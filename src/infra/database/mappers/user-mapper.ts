import { User } from '@/domain/enterprise/entities/user';
import { UserDocument } from '../mongoose/schemas/user.schema';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class UserMapper {

  static toDomain(userDocument: UserDocument): User {
    return User.create({
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      role: userDocument.role,
    }, new UniqueEntityID(userDocument._id));
  }

  static toMongo(user: User): UserDocument {
    return {
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    } as UserDocument;
  }

}