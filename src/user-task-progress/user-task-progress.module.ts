import { Module } from '@nestjs/common';
import { UserTaskProgressService } from './user-task-progress.service';
import { UserTaskProgressController } from './user-task-progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTaskProgress, UserTaskProgressSchema } from './schema/user-task-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserTaskProgress.name, schema: UserTaskProgressSchema }]),
  ],
  controllers: [UserTaskProgressController],
  providers: [UserTaskProgressService],
})
export class UserTaskProgressModule { }
