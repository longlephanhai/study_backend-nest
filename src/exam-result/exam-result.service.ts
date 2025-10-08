import { Injectable } from '@nestjs/common';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { UpdateExamResultDto } from './dto/update-exam-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ExamResult } from './schema/exam-result.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExamResultService {

  constructor(
    @InjectModel(ExamResult.name) private examResultModel: Model<ExamResult>,
  ) { }


  async create(createExamResultDto: CreateExamResultDto, user: IUser) {
    const createdExamResult = new this.examResultModel({
      ...createExamResultDto,
      userId: user._id,
    });
    return createdExamResult.save();
  }

  findAll() {
    return `This action returns all examResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examResult`;
  }

  update(id: number, updateExamResultDto: UpdateExamResultDto) {
    return `This action updates a #${id} examResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} examResult`;
  }
}
