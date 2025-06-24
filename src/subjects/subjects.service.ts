import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new this.subjectModel(createSubjectDto);
    return subject.save();
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().exec();
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findById(id).exec();
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.subjectModel.findByIdAndUpdate(id, updateSubjectDto, { new: true }).exec();
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subjectModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Subject not found');
  }
}
