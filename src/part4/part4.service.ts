import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePart4Dto } from './dto/create-part4.dto';
import { UpdatePart4Dto } from './dto/update-part4.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Part4 } from './schema/part4.schema';
import { Model } from 'mongoose';

@Injectable()
export class Part4Service {

  constructor(
    @InjectModel(Part4.name) private part4Model: Model<Part4>,
  ) { }

  create(createPart4Dto: CreatePart4Dto) {
    return 'This action adds a new part4';
  }

  async createMultiple(createPart4Dtos: CreatePart4Dto[], user: IUser) {
      const audioUrl = await this.part4Model.find().select('audioUrl').lean();
      const isExist = audioUrl.some(item =>
        createPart4Dtos.some(dto => dto.audioUrl === item.audioUrl),
      );
      if (isExist) {
        throw new BadRequestException('Question already exists');
      }
      const newParts4 = await this.part4Model.insertMany(
        createPart4Dtos.map(dto => ({
          ...dto,
          createdBy: user._id,
        })),
      );
      return newParts4;
    }

  findAll() {
    return `This action returns all part4`;
  }

  findOne(id: number) {
    return `This action returns a #${id} part4`;
  }

  update(id: number, updatePart4Dto: UpdatePart4Dto) {
    return `This action updates a #${id} part4`;
  }

  remove(id: number) {
    return `This action removes a #${id} part4`;
  }
}
