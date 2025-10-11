import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicsVocabularyDto } from './dto/create-topics-vocabulary.dto';
import { UpdateTopicsVocabularyDto } from './dto/update-topics-vocabulary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TopicsVocabulary } from './schema/topics-vocabulary.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreateVocabularyDto } from 'src/vocabularies/dto/create-vocabulary.dto';
import { Vocabulary } from 'src/vocabularies/schema/vocabulary.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TopicsVocabulariesService {
  private genAI: GoogleGenerativeAI;
  private genAiProModel: any;
  private readonly batchSize = 5;
  constructor(
    @InjectModel(TopicsVocabulary.name) private topicsVocabularyModel: Model<TopicsVocabulary>,
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
    private configService: ConfigService
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('API_GEMINI_KEY')!);
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }
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

  async findOne(id: string) {
    return await this.topicsVocabularyModel.findById(id).populate('vocabularies').exec();
  }

  async getVocabulariesFromAI(id: string, maxWords = 20 ) {
    const topicsVocabulary = await this.topicsVocabularyModel.findById(id).populate('vocabularies').exec();
    if (!topicsVocabulary) {
      throw new BadRequestException('TopicsVocabulary not found');
    }

    const vocabularies = topicsVocabulary.vocabularies as Vocabulary[];
    if (!vocabularies.length) return [];

    const limitedVocab = vocabularies.slice(0, maxWords);

    const prompt = `
Bạn là trợ lý luyện TOEIC thông minh. Hãy giúp người học ôn tập các từ sau:
${limitedVocab.map(v => `- ${v.vocab} (${v.meaning}): ${v.example}`).join('\n')}

Sinh cho từng từ dạng bài tập:
Điền vào chỗ trống (blank) trong câu. Trả về JSON có cấu trúc:
[
  {
    "word": "desk",
    "fillBlank": {
      "question": "...", 
      "answer": "..."
    }
  }
]

Chỉ trả JSON, không thêm text khác.
`;

    try {
      const result = await this.genAiProModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const rawText = result.response.text();
      const jsonStart = rawText.indexOf('[');
      const jsonEnd = rawText.lastIndexOf(']');
      const jsonString = jsonStart !== -1 && jsonEnd !== -1 ? rawText.slice(jsonStart, jsonEnd + 1) : rawText;

      try {
        return JSON.parse(jsonString);
      } catch {
        console.warn('⚠️ AI output not valid JSON, returning raw text.');
        return [{ rawText }];
      }
    } catch (error) {
      console.error('❌ Error calling Gemini AI:', error);
      return [{ rawText: 'Error calling AI, please try again later.' }];
    }
  }



  update(id: number, updateTopicsVocabularyDto: UpdateTopicsVocabularyDto) {
    return `This action updates a #${id} topicsVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} topicsVocabulary`;
  }
}
