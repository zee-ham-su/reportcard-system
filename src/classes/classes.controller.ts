import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'List of all classes' })
  async findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200, description: 'Class details' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete class' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async remove(@Param('id') id: string) {
    await this.classesService.remove(id);
    return { message: 'Class deleted successfully' };
  }
}
