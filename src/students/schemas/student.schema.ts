import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GradeLevel } from '../../common';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ type: String, enum: GradeLevel, required: true })
  gradeLevel: GradeLevel;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  classId: Types.ObjectId;

  @Prop()
  phone?: string;

  @Prop()
  parentName?: string;

  @Prop()
  parentEmail?: string;

  @Prop()
  parentPhone?: string;

  @Prop()
  address?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  profilePicture?: string;

  @Prop()
  admissionDate?: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
