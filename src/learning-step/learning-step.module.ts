import { Module } from '@nestjs/common';
import { LearningStepService } from './learning-step.service';
import { LearningStepController } from './learning-step.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningStep, LearningStepSchema } from './schema/learning-step.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LearningStep.name, schema: LearningStepSchema }]),
  ],
  controllers: [LearningStepController],
  providers: [LearningStepService],
})
export class LearningStepModule { }
