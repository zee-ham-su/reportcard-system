import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TermType } from '../../common';

export type MarkDocument = Mark & Document;

@Schema({ timestamps: true })
export class Mark {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  classId: Types.ObjectId;

  @Prop({ type: String, enum: TermType, required: true })
  term: TermType;

  @Prop({ required: true })
  academicYear: string;

  @Prop({ required: true })
  marksObtained: number;

  @Prop({ required: true })
  maxMarks: number;

  @Prop()
  percentage: number;

  @Prop()
  grade: string;

  @Prop()
  gpa: number;

  @Prop()
  remarks?: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  enteredBy: Types.ObjectId;

  @Prop({ default: Date.now })
  enteredAt: Date;

  @Prop()
  lastModifiedBy?: Types.ObjectId;

  @Prop()
  lastModifiedAt?: Date;
}

export const MarkSchema = SchemaFactory.createForClass(Mark);
