import { Injectable } from '@nestjs/common';
import { CreateTopicsSpeakingDto } from './dto/create-topics-speaking.dto';
import { UpdateTopicsSpeakingDto } from './dto/update-topics-speaking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TopicsSpeaking } from './schema/topics-speaking.schema';
import { Model } from 'mongoose';

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

  findAll() {
    return `This action returns all topicsSpeaking`;
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
