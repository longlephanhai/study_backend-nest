import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LearningPath } from './schema/learning-path.schema';
import { Model } from 'mongoose';
import { BadRequestError } from 'openai';

@Injectable()
export class LearningPathService {

  constructor(
    @InjectModel(LearningPath.name) private learningPathModel: Model<LearningPath>,
  ) { }

  create(createLearningPathDto: CreateLearningPathDto) {
    return 'This action adds a new learningPath';
  }

  findAll() {
    return `This action returns all learningPath`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningPath`;
  }

  async findByUser(userId: string) {
    const learningPaths = await this.learningPathModel.find({
      userId,
    }).populate({
      path: 'steps',
      select: 'title description order tasks unlockAt',
      populate: {
        path: 'tasks',
        select: 'title description type content isLocked relatedStep',
      }
    });

    if (learningPaths.length === 0) {
      return false;
    }

    return learningPaths;
  }

  update(id: number, updateLearningPathDto: UpdateLearningPathDto) {
    return `This action updates a #${id} learningPath`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningPath`;
  }
}
