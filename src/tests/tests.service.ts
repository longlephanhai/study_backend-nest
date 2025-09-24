import { Injectable } from '@nestjs/common';
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

  create(createTestDto: CreateTestDto) {
    return 'This action adds a new test';
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
