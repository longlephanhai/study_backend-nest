import { Injectable } from '@nestjs/common';
import { CreatePart7Dto } from './dto/create-part7.dto';
import { UpdatePart7Dto } from './dto/update-part7.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Part7 } from './schema/part7.schema';
import { Model } from 'mongoose';

@Injectable()
export class Part7Service {

  constructor(
    @InjectModel(Part7.name) private part7Model: Model<Part7>,
  ) { }

  create(createPart7Dto: CreatePart7Dto) {
    return 'This action adds a new part7';
  }

  async createMultiple(createPart7Dtos: CreatePart7Dto[], user: IUser) {
    const newParts7 = await this.part7Model.insertMany(
      createPart7Dtos.map(dto => ({
        ...dto,
        createdBy: user._id,
      })),
    );
    return newParts7;
  }

  findAll() {
    return `This action returns all part7`;
  }

  findOne(id: number) {
    return `This action returns a #${id} part7`;
  }

  update(id: number, updatePart7Dto: UpdatePart7Dto) {
    return `This action updates a #${id} part7`;
  }

  remove(id: number) {
    return `This action removes a #${id} part7`;
  }
}
