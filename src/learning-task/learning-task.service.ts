import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLearningTaskDto } from './dto/create-learning-task.dto';
import { UpdateLearningTaskDto } from './dto/update-learning-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LearningTask } from './schema/learning-task.schema';

@Injectable()
export class LearningTaskService {

  constructor(
    @InjectModel(LearningTask.name) private learningTask: Model<LearningTask>,
  ) { }

  create(createLearningTaskDto: CreateLearningTaskDto) {
    return 'This action adds a new learningTask';
  }

  findAll() {
    return `This action returns all learningTask`;
  }

  async findOne(id: string) {
    const task = await this.learningTask.findById(id)
      .populate('content')
      .select("-createdBy -createdAt -updatedAt -__v")
      .exec();
    if (!task) {
      throw new BadRequestException('Learning task does not exist');
    }
    return task;
  }

  update(id: number, updateLearningTaskDto: UpdateLearningTaskDto) {
    return `This action updates a #${id} learningTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningTask`;
  }
}
