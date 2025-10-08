import { Module } from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { ExamResultController } from './exam-result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamResult, ExamResultSchema } from './schema/exam-result.schema';
import { Part, PartSchema } from 'src/parts/schema/part.schema';
import { Question, QuestionSchema } from 'src/question/schema/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: Question.name, schema: QuestionSchema }
    ]),
  ],
  controllers: [ExamResultController],
  providers: [ExamResultService],
})
export class ExamResultModule { }
