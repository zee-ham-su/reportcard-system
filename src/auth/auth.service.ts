import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Teacher, TeacherDocument } from '../teachers/schemas/teacher.schema';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { JwtPayload, UserRole } from '../common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, ...userData } = createUserDto;
    
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new this.userModel({
      ...userData,
      email,
      password: hashedPassword,
    });
    
    await user.save();

    // If user is a teacher, create teacher record
    if (user.role === UserRole.TEACHER) {
      const teacher = new this.teacherModel({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        teacherId: `TCH${user._id.toString().slice(-6).toUpperCase()}`,
        qualification: 'To be updated',
        experience: 0,
        phone: user.phone,
        address: user.address,
        isActive: true,
      });
      await teacher.save();
    }

    // If user is a student, create student record
    if (user.role === UserRole.STUDENT) {
      const student = new this.studentModel({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        studentId: `STU${user._id.toString().slice(-6).toUpperCase()}`,
        dateOfBirth: new Date(), // Should be provided in registration
        gradeLevel: 'grade_1', // Should be provided in registration
        // classId will be assigned later by admin
        phone: user.phone,
        address: user.address,
        isActive: true,
      });
      await student.save();
    }
    
    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();
    
    return {
      message: 'User registered successfully',
      user: userResponse,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate JWT
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    
    const accessToken = this.jwtService.sign(payload);
    
    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();
    
    return {
      accessToken,
      user: userResponse,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user = await this.userModel.findById(payload.sub).select('-password');
    return user?.isActive ? user : null;
  }
}
