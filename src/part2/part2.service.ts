import { Injectable } from '@nestjs/common';
import { CreatePart2Dto } from './dto/create-part2.dto';
import { UpdatePart2Dto } from './dto/update-part2.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Part2 } from './schema/part2.schema';
import { Model } from 'mongoose';

@Injectable()
export class Part2Service {

  constructor(
    @InjectModel(Part2.name) private part2Model: Model<Part2>,
  ) { }

  create(createPart2Dto: CreatePart2Dto) {
    return 'This action adds a new part2';
  }

  async createMultiple(createPart2Dtos: CreatePart2Dto[], user: IUser) {
    const audioUrls = createPart2Dtos.map(dto => dto.audioUrl);
    const isExist = await this.part2Model.find({
      audioUrl: { $in: audioUrls },
    });

    if (isExist.length > 0) {
      throw new Error('Part2 with the same audioUrl already exists for this user.');
    }

    const newParts2 = await this.part2Model.insertMany(
      createPart2Dtos.map(dto => ({
        ...dto,
        createdBy: user._id,
      })),
    );
    return newParts2;
  }

  findAll() {
    return `This action returns all part2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} part2`;
  }

  update(id: number, updatePart2Dto: UpdatePart2Dto) {
    return `This action updates a #${id} part2`;
  }

  remove(id: number) {
    return `This action removes a #${id} part2`;
  }
}
