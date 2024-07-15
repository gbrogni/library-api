import { Author } from '@/domain/enterprise/entities/author';
import { AuthorDocument } from '../mongoose/schemas/author.schema';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class AuthorMapper {

  static toDomain(authorDocument: AuthorDocument): Author {
    return Author.create({
      name: authorDocument.name,
      bio: authorDocument.bio,
      birthDate: authorDocument.birthDate,
    }, new UniqueEntityID(authorDocument._id));
  }

  static toMongo(author: Author): AuthorDocument {
    return {
      _id: author.id.toString(),
      name: author.name,
      bio: author.bio,
      birthDate: author.birthDate,
    } as AuthorDocument;
  }
}