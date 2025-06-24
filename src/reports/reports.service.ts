import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as PDFDocument from 'pdfkit';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { Mark, MarkDocument } from '../marks/schemas/mark.schema';
import { Subject, SubjectDocument } from '../subjects/schemas/subject.schema';
import { Class, ClassDocument } from '../classes/schemas/class.schema';
import { TermType } from '../common';
import { calculateLetterGrade, calculateGPA, formatDate, formatStudentId } from '../common';

export interface ReportCardData {
  student: Student;
  class: Class;
  marks: Array<{
    subject: Subject;
    mark: Mark;
  }>;
  overallPercentage: number;
  overallGrade: string;
  overallGPA: number;
  term: TermType;
  academicYear: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Mark.name) private markModel: Model<MarkDocument>,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async generateReportCard(
    studentId: string,
    term: TermType,
    academicYear: string,
  ): Promise<Buffer> {
    const reportData = await this.getReportCardData(studentId, term, academicYear);
    return this.createPDFReportCard(reportData);
  }

  async getReportCardData(
    studentId: string,
    term: TermType,
    academicYear: string,
  ): Promise<ReportCardData> {
    // Get student data
    const student = await this.studentModel
      .findById(studentId)
      .populate('classId')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get marks for the term
    const marks = await this.markModel
      .find({
        studentId,
        term,
        academicYear,
      })
      .populate('subjectId')
      .exec();

    if (marks.length === 0) {
      throw new NotFoundException('No marks found for the specified term and academic year');
    }

    // Calculate overall performance
    const totalMarksObtained = marks.reduce((sum, mark) => sum + mark.marksObtained, 0);
    const totalMaxMarks = marks.reduce((sum, mark) => sum + mark.maxMarks, 0);
    const overallPercentage = (totalMarksObtained / totalMaxMarks) * 100;
    const overallGrade = calculateLetterGrade(overallPercentage);
    const overallGPA = calculateGPA(overallPercentage);

    // Format marks data
    const marksData = marks.map(mark => ({
      subject: mark.subjectId as any,
      mark,
    }));

    return {
      student,
      class: student.classId as any,
      marks: marksData,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      overallGrade,
      overallGPA: Math.round(overallGPA * 100) / 100,
      term,
      academicYear,
    };
  }

  private async createPDFReportCard(data: ReportCardData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header
        doc
          .fontSize(20)
          .text('School Report Portal', 50, 50, { align: 'center' })
          .fontSize(16)
          .text('Student Report Card', 50, 80, { align: 'center' })
          .moveDown();

        // Student Information
        const studentY = 130;
        doc
          .fontSize(12)
          .text('Student Information', 50, studentY, { underline: true })
          .moveDown(0.5);

        doc
          .text(`Name: ${data.student.firstName} ${data.student.lastName}`, 50)
          .text(`Student ID: ${data.student.studentId}`, 50)
          .text(`Class: ${data.class.name}`, 50)
          .text(`Grade Level: ${data.class.gradeLevel.replace('_', ' ').toUpperCase()}`, 50)
          .text(`Academic Year: ${data.academicYear}`, 50)
          .text(`Term: ${data.term.replace('_', ' ').toUpperCase()}`, 50)
          .text(`Report Date: ${formatDate(new Date())}`, 50)
          .moveDown();

        // Marks Table
        const tableY = doc.y + 20;
        doc
          .fontSize(12)
          .text('Academic Performance', 50, tableY, { underline: true })
          .moveDown(0.5);

        // Table headers
        const startY = doc.y;
        const colWidths = [150, 80, 80, 80, 60, 60];
        const headers = ['Subject', 'Marks Obtained', 'Maximum Marks', 'Percentage', 'Grade', 'GPA'];

        let currentX = 50;
        headers.forEach((header, index) => {
          doc
            .rect(currentX, startY, colWidths[index], 25)
            .stroke()
            .fontSize(10)
            .text(header, currentX + 5, startY + 8, {
              width: colWidths[index] - 10,
              align: 'center',
            });
          currentX += colWidths[index];
        });

        // Table rows
        let currentY = startY + 25;
        data.marks.forEach((markData) => {
          currentX = 50;
          const rowData = [
            markData.subject.name,
            markData.mark.marksObtained.toString(),
            markData.mark.maxMarks.toString(),
            `${markData.mark.percentage.toFixed(1)}%`,
            markData.mark.grade,
            markData.mark.gpa.toFixed(2),
          ];

          rowData.forEach((cellData, index) => {
            doc
              .rect(currentX, currentY, colWidths[index], 20)
              .stroke()
              .fontSize(9)
              .text(cellData, currentX + 5, currentY + 6, {
                width: colWidths[index] - 10,
                align: 'center',
              });
            currentX += colWidths[index];
          });
          currentY += 20;
        });

        // Overall Performance
        doc
          .moveDown(2)
          .fontSize(12)
          .text('Overall Performance', 50, currentY + 30, { underline: true })
          .moveDown(0.5)
          .text(`Overall Percentage: ${data.overallPercentage}%`, 50)
          .text(`Overall Grade: ${data.overallGrade}`, 50)
          .text(`Overall GPA: ${data.overallGPA}`, 50)
          .moveDown();

        // Footer
        doc
          .moveDown(2)
          .fontSize(10)
          .text('This is a computer-generated report card.', 50, doc.page.height - 100, {
            align: 'center',
          })
          .text('School Report Portal - Academic Management System', 50, doc.page.height - 80, {
            align: 'center',
          });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getStudentReports(studentId: string): Promise<any[]> {
    const reports = await this.markModel
      .aggregate([
        { $match: { studentId: studentId } },
        {
          $group: {
            _id: {
              term: '$term',
              academicYear: '$academicYear',
            },
            totalMarks: { $sum: '$marksObtained' },
            totalMaxMarks: { $sum: '$maxMarks' },
            subjectCount: { $sum: 1 },
          },
        },
        {
          $addFields: {
            percentage: {
              $multiply: [{ $divide: ['$totalMarks', '$totalMaxMarks'] }, 100],
            },
          },
        },
        {
          $sort: { '_id.academicYear': -1, '_id.term': 1 },
        },
      ])
      .exec();

    return reports.map(report => ({
      term: report._id.term,
      academicYear: report._id.academicYear,
      percentage: Math.round(report.percentage * 100) / 100,
      grade: calculateLetterGrade(report.percentage),
      gpa: calculateGPA(report.percentage),
      subjectCount: report.subjectCount,
    }));
  }

  async getClassReports(classId: string, term: TermType, academicYear: string): Promise<any[]> {
    const reports = await this.markModel
      .aggregate([
        { $match: { classId, term, academicYear } },
        {
          $group: {
            _id: '$studentId',
            totalMarks: { $sum: '$marksObtained' },
            totalMaxMarks: { $sum: '$maxMarks' },
            subjectCount: { $sum: 1 },
          },
        },
        {
          $addFields: {
            percentage: {
              $multiply: [{ $divide: ['$totalMarks', '$totalMaxMarks'] }, 100],
            },
          },
        },
        {
          $lookup: {
            from: 'students',
            localField: '_id',
            foreignField: '_id',
            as: 'student',
          },
        },
        { $unwind: '$student' },
        {
          $sort: { percentage: -1 },
        },
      ])
      .exec();

    return reports.map((report, index) => ({
      rank: index + 1,
      student: {
        _id: report.student._id,
        firstName: report.student.firstName,
        lastName: report.student.lastName,
        studentId: report.student.studentId,
      },
      percentage: Math.round(report.percentage * 100) / 100,
      grade: calculateLetterGrade(report.percentage),
      gpa: calculateGPA(report.percentage),
      subjectCount: report.subjectCount,
    }));
  }
}
