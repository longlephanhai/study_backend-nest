import { Injectable } from '@nestjs/common';
import { CreateWritingHistoryDto } from './dto/create-writing-history.dto';
import { UpdateWritingHistoryDto } from './dto/update-writing-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WritingHistory } from './schema/writing-history.schema';
import { Model } from 'mongoose';

@Injectable()
export class WritingHistoryService {
  constructor(
    @InjectModel(WritingHistory.name) private writingHistoryModel: Model<WritingHistory>,
  ) { }

  async create(createWritingHistoryDto: CreateWritingHistoryDto) {
    const createdWritingHistory = await this.writingHistoryModel.create(createWritingHistoryDto);
    return createdWritingHistory;
  }

  findAll() {
    return `This action returns all writingHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} writingHistory`;
  }

  update(id: number, updateWritingHistoryDto: UpdateWritingHistoryDto) {
    return `This action updates a #${id} writingHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} writingHistory`;
  }
}
