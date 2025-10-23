import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTaskProgressDto } from './create-user-task-progress.dto';

export class UpdateUserTaskProgressDto extends PartialType(CreateUserTaskProgressDto) {}
