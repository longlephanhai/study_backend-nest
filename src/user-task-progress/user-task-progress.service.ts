import { Injectable } from '@nestjs/common';
import { CreateUserTaskProgressDto } from './dto/create-user-task-progress.dto';
import { UpdateUserTaskProgressDto } from './dto/update-user-task-progress.dto';

@Injectable()
export class UserTaskProgressService {
  create(createUserTaskProgressDto: CreateUserTaskProgressDto) {
    return 'This action adds a new userTaskProgress';
  }

  findAll() {
    return `This action returns all userTaskProgress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userTaskProgress`;
  }

  update(id: number, updateUserTaskProgressDto: UpdateUserTaskProgressDto) {
    return `This action updates a #${id} userTaskProgress`;
  }

  remove(id: number) {
    return `This action removes a #${id} userTaskProgress`;
  }
}
