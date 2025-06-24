import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const classObj = new this.classModel(createClassDto);
    return classObj.save();
  }

  async findAll(): Promise<Class[]> {
    return this.classModel.find().exec();
  }

  async findOne(id: string): Promise<Class> {
    const classObj = await this.classModel.findById(id).exec();
    if (!classObj) throw new NotFoundException('Class not found');
    return classObj;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classObj = await this.classModel.findByIdAndUpdate(id, updateClassDto, { new: true }).exec();
    if (!classObj) throw new NotFoundException('Class not found');
    return classObj;
  }

  async remove(id: string): Promise<void> {
    const result = await this.classModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Class not found');
  }
}
