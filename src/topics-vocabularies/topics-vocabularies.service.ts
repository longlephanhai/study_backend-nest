import { Injectable } from '@nestjs/common';
import { CreateTopicsVocabularyDto } from './dto/create-topics-vocabulary.dto';
import { UpdateTopicsVocabularyDto } from './dto/update-topics-vocabulary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TopicsVocabulary } from './schema/topics-vocabulary.schema';
import { Model } from 'mongoose';

@Injectable()
export class TopicsVocabulariesService {
  constructor(
    @InjectModel(TopicsVocabulary.name) private topicsVocabularyModel: Model<TopicsVocabulary>,
  ) { }
  create(createTopicsVocabularyDto: CreateTopicsVocabularyDto) {
    return 'This action adds a new topicsVocabulary';
  }

  findAll() {
    return `This action returns all topicsVocabularies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} topicsVocabulary`;
  }

  update(id: number, updateTopicsVocabularyDto: UpdateTopicsVocabularyDto) {
    return `This action updates a #${id} topicsVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} topicsVocabulary`;
  }
}
