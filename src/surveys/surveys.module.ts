import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './schema/survey.schema';
import { LearningPath, LearningPathSchema } from 'src/learning-path/schema/learning-path.schema';
import { LearningStep, LearningStepSchema } from 'src/learning-step/schema/learning-step.schema';
import { LearningTask, LearningTaskSchema } from 'src/learning-task/schema/learning-task.schema';
import { UserTaskProgress, UserTaskProgressSchema } from 'src/user-task-progress/schema/user-task-progress.schema';
import { Part1Module } from 'src/part1/part1.module';
import { Part2Module } from 'src/part2/part2.module';
import { Part3Module } from 'src/part3/part3.module';
import { Part4Module } from 'src/part4/part4.module';
import { Part5Module } from 'src/part5/part5.module';
import { Part6Module } from 'src/part6/part6.module';
import { Part7Module } from 'src/part7/part7.module';
import { GrammarsModule } from 'src/grammars/grammars.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: LearningPath.name, schema: LearningPathSchema },
      { name: LearningStep.name, schema: LearningStepSchema },
      { name: LearningTask.name, schema: LearningTaskSchema },
      { name: UserTaskProgress.name, schema: UserTaskProgressSchema },
    ]),
    Part1Module,
    Part2Module,
    Part3Module,
    Part4Module,
    Part5Module,
    Part6Module,
    Part7Module,
    GrammarsModule
  ],
  controllers: [SurveysController],
  providers: [SurveysService],
})
export class SurveysModule { }
