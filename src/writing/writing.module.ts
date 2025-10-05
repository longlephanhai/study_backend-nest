import { Module } from '@nestjs/common';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Writing, WritingSchema } from './schema/writing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Writing.name, schema: WritingSchema },]),
  ],
  controllers: [WritingController],
  providers: [WritingService],
})
export class WritingModule { }
