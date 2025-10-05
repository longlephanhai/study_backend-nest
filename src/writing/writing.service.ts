import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWritingDto } from './dto/create-writing.dto';
import { UpdateWritingDto } from './dto/update-writing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Writing } from './schema/writing.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

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

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.writingModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.writingModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    return await this.writingModel.findById(id);
  }

  update(id: number, updateWritingDto: UpdateWritingDto) {
    return `This action updates a #${id} writing`;
  }

  remove(id: number) {
    return `This action removes a #${id} writing`;
  }
}
