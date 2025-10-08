import { Module } from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { ExamResultController } from './exam-result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamResult, ExamResultSchema } from './schema/exam-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema }
    ]),
  ],
  controllers: [ExamResultController],
  providers: [ExamResultService],
})
export class ExamResultModule { }
