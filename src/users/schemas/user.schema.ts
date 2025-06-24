import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  profilePicture?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
