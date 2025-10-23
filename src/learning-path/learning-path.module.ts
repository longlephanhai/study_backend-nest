import { Module } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { LearningPathController } from './learning-path.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningPath, LearningPathSchema } from './schema/learning-path.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LearningPath.name, schema: LearningPathSchema }]),
  ],
  controllers: [LearningPathController],
  providers: [LearningPathService],
})
export class LearningPathModule { }
