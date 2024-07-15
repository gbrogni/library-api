import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface BookProps {
  title: string;
  description: string;
  publishDate: Date;
  authorId: UniqueEntityID;
}

export class Book extends Entity<BookProps> {

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get publishDate(): Date {
    return this.props.publishDate;
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId;
  }
  
  set title(value: string) {
    this.props.title = value;
  }

  set description(value: string) {
    this.props.description = value;
  }

  set publishDate(value: Date) {
    this.props.publishDate = value;
  }

  set authorId(value: UniqueEntityID) {
    this.props.authorId = value;
  }

  public static create(props: BookProps, id?: UniqueEntityID): Book {
    return new Book(props, id);
  }

}