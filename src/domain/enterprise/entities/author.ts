import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AuthorProps {
  name: string;
  bio: string;
  birthDate: Date;
}

export class Author extends Entity<AuthorProps> {

  get name(): string {
    return this.props.name;
  }

  get bio(): string {
    return this.props.bio;
  }

  get birthDate(): Date {
    return this.props.birthDate;
  }

  set name(value: string) {
    this.props.name = value;
  }

  set bio(value: string) {
    this.props.bio = value;
  }

  set birthDate(value: Date) {
    this.props.birthDate = value;
  }

  public static create(props: AuthorProps, id?: UniqueEntityID): Author {
    return new Author(props, id);
  }

}