import { Injectable } from '@nestjs/common';
import { CreateLearningStepDto } from './dto/create-learning-step.dto';
import { UpdateLearningStepDto } from './dto/update-learning-step.dto';

@Injectable()
export class LearningStepService {
  create(createLearningStepDto: CreateLearningStepDto) {
    return 'This action adds a new learningStep';
  }

  findAll() {
    return `This action returns all learningStep`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningStep`;
  }

  update(id: number, updateLearningStepDto: UpdateLearningStepDto) {
    return `This action updates a #${id} learningStep`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningStep`;
  }
}
