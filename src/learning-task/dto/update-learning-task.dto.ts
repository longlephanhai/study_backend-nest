import { PartialType } from '@nestjs/mapped-types';
import { CreateLearningTaskDto } from './create-learning-task.dto';

export class UpdateLearningTaskDto extends PartialType(CreateLearningTaskDto) {}
