import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = new this.teacherModel(createTeacherDto);
    return teacher.save();
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().exec();
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherModel.findByIdAndUpdate(id, updateTeacherDto, { new: true }).exec();
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async remove(id: string): Promise<void> {
    const result = await this.teacherModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Teacher not found');
  }
}
