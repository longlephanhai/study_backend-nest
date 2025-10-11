import { Injectable } from '@nestjs/common';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Grammar } from './schema/grammar.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class GrammarsService {
  constructor(
    @InjectModel(Grammar.name) private grammarModel: Model<Grammar>,
  ) { }
  create(createGrammarDto: CreateGrammarDto) {
    return 'This action adds a new grammar';
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.grammarModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.grammarModel.find(filter)
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
    return `This action returns a #${id} grammar`;
  }

  update(id: number, updateGrammarDto: UpdateGrammarDto) {
    return `This action updates a #${id} grammar`;
  }

  remove(id: number) {
    return `This action removes a #${id} grammar`;
  }
}
