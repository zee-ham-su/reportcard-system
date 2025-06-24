import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if student ID already exists
    const existingStudent = await this.studentModel.findOne({
      studentId: createStudentDto.studentId,
    });
    
    if (existingStudent) {
      throw new ConflictException('Student ID already exists');
    }

    const student = new this.studentModel(createStudentDto);
    return student.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel
      .find()
      .populate('classId', 'name gradeLevel')
      .exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel
      .findById(id)
      .populate('classId', 'name gradeLevel')
      .exec();
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    
    return student;
  }

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ studentId })
      .populate('classId', 'name gradeLevel')
      .exec();
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .populate('classId', 'name gradeLevel')
      .exec();
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    
    return student;
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Student not found');
    }
  }

  async findByClass(classId: string): Promise<Student[]> {
    return this.studentModel
      .find({ classId })
      .populate('classId', 'name gradeLevel')
      .exec();
  }

  async findByGradeLevel(gradeLevel: string): Promise<Student[]> {
    return this.studentModel
      .find({ gradeLevel })
      .populate('classId', 'name gradeLevel')
      .exec();
  }
}
