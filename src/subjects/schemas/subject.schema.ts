import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  credits: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  category?: string; // e.g., 'Science', 'Mathematics', 'Language Arts'

  @Prop({ default: 100 })
  maxMarks: number;

  @Prop({ default: 40 })
  passingMarks: number;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
