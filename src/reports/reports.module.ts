import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { Mark, MarkSchema } from '../marks/schemas/mark.schema';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { Class, ClassSchema } from '../classes/schemas/class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Mark.name, schema: MarkSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
