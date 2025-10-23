import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './schema/survey.schema';
import { LearningPath, LearningPathSchema } from 'src/learning-path/schema/learning-path.schema';
import { LearningStep, LearningStepSchema } from 'src/learning-step/schema/learning-step.schema';
import { LearningTask, LearningTaskSchema } from 'src/learning-task/schema/learning-task.schema';
import { UserTaskProgress, UserTaskProgressSchema } from 'src/user-task-progress/schema/user-task-progress.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Survey.name, schema: SurveySchema },
    { name: LearningPath.name, schema: LearningPathSchema },
    { name: LearningStep.name, schema: LearningStepSchema },
    { name: LearningTask.name, schema: LearningTaskSchema },
    { name: UserTaskProgress.name, schema: UserTaskProgressSchema },
  ])],
  controllers: [SurveysController],
  providers: [SurveysService],
})
export class SurveysModule { }
