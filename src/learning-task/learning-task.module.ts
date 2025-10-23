import { Module } from '@nestjs/common';
import { LearningTaskService } from './learning-task.service';
import { LearningTaskController } from './learning-task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningTask, LearningTaskSchema } from './schema/learning-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LearningTask.name, schema: LearningTaskSchema }]),
  ],
  controllers: [LearningTaskController],
  providers: [LearningTaskService],
})
export class LearningTaskModule { }
