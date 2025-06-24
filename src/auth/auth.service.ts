import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { JwtPayload } from '../common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
