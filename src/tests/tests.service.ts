import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Test } from './schema/test.schema';
import { Model } from 'mongoose';
import { Part } from 'src/parts/schema/part.schema';
import { CreatePartDto } from 'src/parts/dto/create-part.dto';
import aqp from 'api-query-params';

@Injectable()
export class TestsService {

  constructor(
    @InjectModel(Test.name) private testModel: Model<Test>,
    @InjectModel(Part.name) private partModel: Model<Part>,
  ) { }

  async create(createTestDto: CreateTestDto, user: IUser) {
    const isExist = await this.testModel.findOne({
      title: createTestDto.title,
    })
    if (isExist) {
      throw new BadRequestException('Test with this title is already exist')
    }
    const newTest = await this.testModel.create({
      ...createTestDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    })
    return newTest;
  }

  async createMultiple(createTestDto: CreateTestDto[], user: IUser) {
    const titles = createTestDto.map(test => test.title);
    const isExist = await this.testModel.find({
      title: { $in: titles }
    });
    if (isExist.length) {
      const existTitles = isExist.map(test => test.title);
      throw new BadRequestException(`Tests with these titles are already exist: ${existTitles.join(', ')}`);
    }
    const newTests = await this.testModel.insertMany(
      createTestDto.map(test => ({
        ...test,
        createdBy: {
          _id: user._id,
          email: user.email,
        }
      }))
    );
    return newTests;
  }

  async createPart(testId: string, createPartDto: CreatePartDto, user: IUser) {
    const test = await this.testModel.findOne({ _id: testId });
    if (!test) {
      throw new BadRequestException('Test not found');
    }
    const newPart = await this.partModel.create({
      ...createPartDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
    await this.testModel.findByIdAndUpdate(test._id, {
      $push: { parts: newPart._id }
    })
    return newPart;
  }

  async createMultipleParts(testId: string, createPartDto: CreatePartDto[], user: IUser) {
    const test = await this.testModel.findOne({ _id: testId });
    if (!test) {
      throw new BadRequestException('Test not found');
    }

    const parts = await this.partModel.find({
      partNo: { $in: createPartDto.map(part => part.partNo) },
      _id: { $in: test.parts }
    });

    if (parts.length) {
      const existPartNos = parts.map(part => part.partNo);
      throw new BadRequestException(`Parts with these part numbers are already exist in this test: ${existPartNos.join(', ')}`);
    }

    const newParts = await this.partModel.insertMany(
      createPartDto.map(part => ({
        ...part,
        createdBy: {
          _id: user._id,
          email: user.email,
        }
      }))
    );
    await this.testModel.findByIdAndUpdate(test._id, {
      $push: { parts: { $each: newParts.map(part => part._id) } }
    })
    return newParts;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.testModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.testModel.find(filter)
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
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
