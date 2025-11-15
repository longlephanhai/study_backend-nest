import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePart5Dto } from './dto/create-part5.dto';
import { UpdatePart5Dto } from './dto/update-part5.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Part5 } from './schema/part5.schema';
import { Model } from 'mongoose';

@Injectable()
export class Part5Service {

  constructor(
    @InjectModel(Part5.name) private part5Model: Model<Part5>,
  ) { }

  create(createPart5Dto: CreatePart5Dto) {
    return 'This action adds a new part5';
  }

  async createMultiple(createPart5Dtos: CreatePart5Dto[], user: IUser) {
    const isExist = await this.part5Model.exists({
      $or: createPart5Dtos.map(dto => ({ question: dto.questionContent })),
    });
    if (isExist) {
      throw new BadRequestException('Question already exists');
    }
    const newParts5 = await this.part5Model.insertMany(
      createPart5Dtos.map(dto => ({
        ...dto,
        createdBy: user._id,
      })),
    );
    return newParts5;
  }

  async findAll() {
    return await this.part5Model.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} part5`;
  }

  update(id: number, updatePart5Dto: UpdatePart5Dto) {
    return `This action updates a #${id} part5`;
  }

  remove(id: number) {
    return `This action removes a #${id} part5`;
  }
}
