import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  teacherId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop({ required: true })
  qualification: string;

  @Prop({ required: true })
  experience: number; // in years

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subject' }] })
  subjects: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Class' }] })
  classes: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  profilePicture?: string;

  @Prop()
  joiningDate?: Date;

  @Prop()
  subject?: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
