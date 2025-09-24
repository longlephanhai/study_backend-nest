import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Test } from './schema/test.schema';
import { Model } from 'mongoose';

@Injectable()
export class TestsService {

  constructor(
    @InjectModel(Test.name) private testModel: Model<Test>,
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

  findAll() {
    return `This action returns all tests`;
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
