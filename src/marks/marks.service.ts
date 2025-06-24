import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mark, MarkDocument } from './schemas/mark.schema';
import { CreateMarkDto, UpdateMarkDto } from './dto/mark.dto';
import { calculateLetterGrade } from '../common';

@Injectable()
export class MarksService {
  constructor(
    @InjectModel(Mark.name) private markModel: Model<MarkDocument>,
  ) {}

  async create(createMarkDto: CreateMarkDto): Promise<Mark> {
    const percentage = (createMarkDto.marksObtained / createMarkDto.totalMarks) * 100;
    const grade = calculateLetterGrade(percentage);
    
    const mark = new this.markModel({
      ...createMarkDto,
      percentage,
      grade,
    });
    
    return mark.save();
  }

  async findAll(): Promise<Mark[]> {
    return this.markModel.find().populate('studentId subjectId classId').exec();
  }

  async findOne(id: string): Promise<Mark> {
    const mark = await this.markModel.findById(id).populate('studentId subjectId classId').exec();
    if (!mark) throw new NotFoundException('Mark not found');
    return mark;
  }

  async findByStudent(studentId: string): Promise<Mark[]> {
    return this.markModel.find({ studentId }).populate('subjectId classId').exec();
  }

  async findByClass(classId: string): Promise<Mark[]> {
    return this.markModel.find({ classId }).populate('studentId subjectId').exec();
  }

  async findBySubject(subjectId: string): Promise<Mark[]> {
    return this.markModel.find({ subjectId }).populate('studentId classId').exec();
  }

  async update(id: string, updateMarkDto: UpdateMarkDto): Promise<Mark> {
    const percentage = (updateMarkDto.marksObtained / updateMarkDto.totalMarks) * 100;
    const grade = calculateLetterGrade(percentage);
    
    const mark = await this.markModel.findByIdAndUpdate(
      id, 
      { ...updateMarkDto, percentage, grade }, 
      { new: true }
    ).populate('studentId subjectId classId').exec();
    
    if (!mark) throw new NotFoundException('Mark not found');
    return mark;
  }

  async remove(id: string): Promise<void> {
    const result = await this.markModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Mark not found');
  }

  async getStudentReportCard(studentId: string, term?: string, academicYear?: string): Promise<Mark[]> {
    const filter: any = { studentId };
    if (term) filter.term = term;
    if (academicYear) filter.academicYear = academicYear;
    
    return this.markModel.find(filter).populate('subjectId classId').exec();
  }
}
