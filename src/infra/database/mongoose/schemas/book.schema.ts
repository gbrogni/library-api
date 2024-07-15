import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ collection: 'books', timestamps: true })
export class Book {

  @Prop({ type: String, required: true, default: () => 'uuid_generate_v4()' })
  _id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  publishDate!: Date;

  @Prop({ type: Types.ObjectId, ref: 'authors' })
  authorId!: Types.ObjectId;

}

export const BookSchema = SchemaFactory.createForClass(Book);