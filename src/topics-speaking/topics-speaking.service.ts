import { Injectable } from '@nestjs/common';
import { CreateTopicsSpeakingDto } from './dto/create-topics-speaking.dto';
import { UpdateTopicsSpeakingDto } from './dto/update-topics-speaking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TopicsSpeaking } from './schema/topics-speaking.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class TopicsSpeakingService {
  constructor(
    @InjectModel(TopicsSpeaking.name) private topicsSpeakingModel: Model<TopicsSpeaking>,
  ) { }
  create(createTopicsSpeakingDto: CreateTopicsSpeakingDto) {
    return 'This action adds a new topicsSpeaking';
  }
  async createMultiple(createTopicsSpeakingDtos: CreateTopicsSpeakingDto[]) {
    const createdTopics = await this.topicsSpeakingModel.insertMany(createTopicsSpeakingDtos);
    return createdTopics;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 20;
    const totalItems = (await this.topicsSpeakingModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.topicsSpeakingModel.find(filter)
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

  findOne(id: number) {
    return `This action returns a #${id} topicsSpeaking`;
  }

  update(id: number, updateTopicsSpeakingDto: UpdateTopicsSpeakingDto) {
    return `This action updates a #${id} topicsSpeaking`;
  }

  remove(id: number) {
    return `This action removes a #${id} topicsSpeaking`;
  }
}
