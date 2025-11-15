import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePart6Dto } from './dto/create-part6.dto';
import { UpdatePart6Dto } from './dto/update-part6.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Part6 } from './schema/part6.schema';
import { Model } from 'mongoose';

@Injectable()
export class Part6Service {

  constructor(
    @InjectModel(Part6.name) private part6Model: Model<Part6>,
  ) { }

  create(createPart6Dto: CreatePart6Dto) {
    return 'This action adds a new part6';
  }

  async createMultiple(createPart6Dtos: CreatePart6Dto[], user: IUser) {
    const newParts6 = await this.part6Model.insertMany(
      createPart6Dtos.map(dto => ({
        ...dto,
        createdBy: user._id,
      })),
    );
    return newParts6;
  }

  async findAll() {
    return await this.part6Model.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} part6`;
  }

  update(id: number, updatePart6Dto: UpdatePart6Dto) {
    return `This action updates a #${id} part6`;
  }

  remove(id: number) {
    return `This action removes a #${id} part6`;
  }
}
