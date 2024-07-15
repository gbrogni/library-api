import { Author } from '@/domain/enterprise/entities/author';

export class AuthorPresenter {

  static toHttp(author: Author) {
    return {
      id: author.id.toString(),
      name: author.name,
      bio: author.bio,
      birthDate: author.birthDate
    };
  }

}