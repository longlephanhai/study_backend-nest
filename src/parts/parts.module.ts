import { Module } from '@nestjs/common';
import { PartsService } from './parts.service';
import { PartsController } from './parts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part, PartSchema } from './schema/part.schema';
import { Question, QuestionSchema } from 'src/question/schema/question.schema';
import { Test } from '@nestjs/testing';
import { TestSchema } from 'src/tests/schema/test.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Part.name, schema: PartSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Test.name, schema: TestSchema },
    ]),
  ],
  controllers: [PartsController],
  providers: [PartsService],
  exports: [PartsService],
})
export class PartsModule { }
