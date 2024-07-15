import { UserRole } from '@/domain/enterprise/enums/user-role';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {

  @Prop({ type: String, required: true, default: () => 'uuid_generate_v4()' })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  role!: UserRole;

}

export const UserSchema = SchemaFactory.createForClass(User);