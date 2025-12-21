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
      return [];
    }

    return learningPaths;
  }

  async update(id: string, updateLearningPathDto: UpdateLearningPathDto) {
    const path = await this.learningPathModel.findById(id);
    if (!path) {
      throw new BadRequestException('Learning path does not exist');
    }
    return await this.learningPathModel.updateOne({
      _id: id,
    }, {
      currentDay: path.currentDay + 1,
    })
  }

  remove(id: number) {
    return `This action removes a #${id} learningPath`;
  }
}
