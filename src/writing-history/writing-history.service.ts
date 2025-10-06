import { Injectable } from '@nestjs/common';
import { CreateWritingHistoryDto } from './dto/create-writing-history.dto';
import { UpdateWritingHistoryDto } from './dto/update-writing-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WritingHistory } from './schema/writing-history.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class WritingHistoryService {
  constructor(
    @InjectModel(WritingHistory.name) private writingHistoryModel: Model<WritingHistory>,
  ) { }

  async create(createWritingHistoryDto: CreateWritingHistoryDto) {
    const createdWritingHistory = await this.writingHistoryModel.create(createWritingHistoryDto);
    return createdWritingHistory;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.writingHistoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.writingHistoryModel.find(filter)
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

  async findOne(id: string, userId: string) {
    return await this.writingHistoryModel.findOne({ _id: id, userId: userId });
  }

  async findByUserId(userId: string) {
    return await this.writingHistoryModel.find({ userId: userId }).populate('writingId', 'topic title').exec();
  }

  update(id: number, updateWritingHistoryDto: UpdateWritingHistoryDto) {
    return `This action updates a #${id} writingHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} writingHistory`;
  }
}
