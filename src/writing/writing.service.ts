import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWritingDto } from './dto/create-writing.dto';
import { UpdateWritingDto } from './dto/update-writing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Writing } from './schema/writing.schema';
import { Model } from 'mongoose';

@Injectable()
export class WritingService {
  constructor(
    @InjectModel(Writing.name) private writingModel: Model<Writing>,
  ) { }

  create(createWritingDto: CreateWritingDto) {
    return 'This action adds a new writing';
  }

  async createMultiple(createWritingDto: CreateWritingDto[]) {
    const isExist = await this.writingModel.findOne({ title: createWritingDto[0].title }).exec();
    if (isExist) {
      throw new BadRequestException('Title already exists');
    }
    return this.writingModel.insertMany(createWritingDto);
  }

  findAll() {
    return `This action returns all writing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} writing`;
  }

  update(id: number, updateWritingDto: UpdateWritingDto) {
    return `This action updates a #${id} writing`;
  }

  remove(id: number) {
    return `This action removes a #${id} writing`;
  }
}
