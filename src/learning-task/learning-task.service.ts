import { Injectable } from '@nestjs/common';
import { CreateLearningTaskDto } from './dto/create-learning-task.dto';
import { UpdateLearningTaskDto } from './dto/update-learning-task.dto';

@Injectable()
export class LearningTaskService {
  create(createLearningTaskDto: CreateLearningTaskDto) {
    return 'This action adds a new learningTask';
  }

  findAll() {
    return `This action returns all learningTask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningTask`;
  }

  update(id: number, updateLearningTaskDto: UpdateLearningTaskDto) {
    return `This action updates a #${id} learningTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningTask`;
  }
}
