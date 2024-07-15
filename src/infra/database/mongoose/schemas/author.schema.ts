import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ collection: 'authors', timestamps: true })
export class Author {

  @Prop({ type: String, required: true, default: () => 'uuid_generate_v4()' })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  bio!: string;

  @Prop({ required: true })
  birthDate!: Date;

}

export const AuthorSchema = SchemaFactory.createForClass(Author);