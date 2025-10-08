import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicsVocabularyDto } from './dto/create-topics-vocabulary.dto';
import { UpdateTopicsVocabularyDto } from './dto/update-topics-vocabulary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TopicsVocabulary } from './schema/topics-vocabulary.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { BadRequestError } from 'openai';
import { CreateVocabularyDto } from 'src/vocabularies/dto/create-vocabulary.dto';
import { Vocabulary } from 'src/vocabularies/schema/vocabulary.schema';

@Injectable()
export class TopicsVocabulariesService {
  constructor(
    @InjectModel(TopicsVocabulary.name) private topicsVocabularyModel: Model<TopicsVocabulary>,
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
  ) { }
  create(createTopicsVocabularyDto: CreateTopicsVocabularyDto) {
    return 'This action adds a new topicsVocabulary';
  }

  async createMultiple(createTopicsVocabularyDtos: CreateTopicsVocabularyDto[]) {
    const createdTopicsVocabularies = await this.topicsVocabularyModel.insertMany(createTopicsVocabularyDtos);
    return createdTopicsVocabularies;
  }

  async createMultipleVocabulary(id: string, createVocabularyDto: CreateVocabularyDto[], user: IUser) {
    const topicsVocabulary = await this.topicsVocabularyModel.findById(id);
    if (!topicsVocabulary) {
      throw new BadRequestException('TopicsVocabulary not found');
    }
    const vocabularies = await this.vocabularyModel.find({
      vocab: { $in: createVocabularyDto.map(v => v.vocab) },
      _id: { $in: topicsVocabulary._id }
    })
    if (vocabularies.length) {
      const existVocabularies = vocabularies.map(v => v.vocab);
      throw new BadRequestException(`Vocabularies with these vocabs are already exist: ${existVocabularies.join(', ')}`);
    }

    const newVocabularies = await this.vocabularyModel.insertMany(
      createVocabularyDto.map(v => ({
        ...v,
        topicsVocabulary: topicsVocabulary._id,
        createdBy: {
          _id: user._id,
          email: user.email,
        }
      }))
    );
    await this.topicsVocabularyModel.findByIdAndUpdate(topicsVocabulary._id, {
      $push: { vocabularies: { $each: newVocabularies.map(v => v._id) } }
    })
    return newVocabularies;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 20;
    const totalItems = (await this.topicsVocabularyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.topicsVocabularyModel.find(filter)
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
    return `This action returns a #${id} topicsVocabulary`;
  }

  update(id: number, updateTopicsVocabularyDto: UpdateTopicsVocabularyDto) {
    return `This action updates a #${id} topicsVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} topicsVocabulary`;
  }
}
