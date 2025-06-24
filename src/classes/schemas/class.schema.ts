import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GradeLevel } from '../../common';

export type ClassDocument = Class & Document;

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: GradeLevel, required: true })
  gradeLevel: GradeLevel;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  classTeacher: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subject' }] })
  subjects: Types.ObjectId[];

  @Prop({ default: 30 })
  maxCapacity: number;

  @Prop({ default: 0 })
  currentStrength: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  room?: string;

  @Prop()
  academicYear?: string;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
