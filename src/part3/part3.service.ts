import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePart3Dto } from './dto/create-part3.dto';
import { UpdatePart3Dto } from './dto/update-part3.dto';
import { Part3 } from './schema/part3.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class Part3Service {

  constructor(
    @InjectModel(Part3.name) private part3Model: Model<Part3>,
  ) { }

  create(createPart3Dto: CreatePart3Dto) {
    return 'This action adds a new part3';
  }

  async createMultiple(createPart3Dtos: CreatePart3Dto[], user: IUser) {
    const audioUrl = await this.part3Model.find().select('audioUrl').lean();
    const isExist = audioUrl.some(item =>
      createPart3Dtos.some(dto => dto.audioUrl === item.audioUrl),
    );
    if (isExist) {
      throw new BadRequestException('Question already exists');
    }
    const newParts3 = await this.part3Model.insertMany(
      createPart3Dtos.map(dto => ({
        ...dto,
        createdBy: user._id,
      })),
    );
    return newParts3;
  }

  async findAll() {
    return await this.part3Model.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} part3`;
  }

  update(id: number, updatePart3Dto: UpdatePart3Dto) {
    return `This action updates a #${id} part3`;
  }

  remove(id: number) {
    return `This action removes a #${id} part3`;
  }
}
