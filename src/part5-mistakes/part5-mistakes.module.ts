import { Module } from '@nestjs/common';
import { Part5MistakesService } from './part5-mistakes.service';
import { Part5MistakesController } from './part5-mistakes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamResult, ExamResultSchema } from 'src/exam-result/schema/exam-result.schema';
import { Question, QuestionSchema } from 'src/question/schema/question.schema';
import { Part5Module } from 'src/part5/part5.module';
import { Part5, Part5Schema } from 'src/part5/schema/part5.schema';
import { Part6, Part6Schema } from 'src/part6/schema/part6.schema';
import { Part6Module } from 'src/part6/part6.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Part5.name, schema: Part5Schema },
      { name: Part6.name, schema: Part6Schema },
    ]),
    Part5Module,
    Part6Module,
  ],
  controllers: [Part5MistakesController],
  providers: [Part5MistakesService],
})
export class Part5MistakesModule { }
