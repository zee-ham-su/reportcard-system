import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mark, MarkSchema } from './schemas/mark.schema';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mark.name, schema: MarkSchema }]),
  ],
  controllers: [MarksController],
  providers: [MarksService],
  exports: [MarksService],
})
export class MarksModule {}
