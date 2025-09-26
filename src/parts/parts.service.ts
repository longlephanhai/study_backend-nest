import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { Part } from './schema/part.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from 'src/question/schema/question.schema';

@Injectable()
export class PartsService {
  constructor(
    @InjectModel(Part.name) private partModel: Model<Part>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) { }
  create(createPartDto: CreatePartDto) {
    return 'This action adds a new part';
  }

  async createQuestion(id: string, createQuestionDTO: CreateQuestionDto, user: IUser) {
    const part = await this.partModel.findOne({
      _id: id,
    })
    if (!part) {
      throw new BadRequestException('Part not found');
    }
    const newQuestion = await this.questionModel.create({
      ...createQuestionDTO,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    })
    await this.partModel.findByIdAndUpdate(part._id, {
      $push: { questions: newQuestion._id }
    })
    return newQuestion;
  }

  async createMultipleQuestions(id: string, createQuestionDTO: CreateQuestionDto[], user: IUser) {
    const part = await this.partModel.findOne({
      _id: id,
    })
    if (!part) {
      throw new BadRequestException('Part not found');
    }
    const questions = await this.questionModel.find({
      numberQuestion: { $in: createQuestionDTO.map(q => q.numberQuestion) },
      _id: { $in: part.questions }
    })

    if (questions.length) {
      const existNumbers = questions.map(q => q.numberQuestion);
      throw new BadRequestException(`Questions with these numbers are already exist: ${existNumbers.join(', ')}`);
    }

    const newQuestions = await this.questionModel.insertMany(
      createQuestionDTO.map(q => ({
        ...q,
        createdBy: {
          _id: user._id,
          email: user.email,
        }
      }))
    )
    await this.partModel.findByIdAndUpdate(part._id, {
      $push: { questions: { $each: newQuestions.map(q => q._id) } }
    })
    return newQuestions;
  }

  findAll() {
    return `This action returns all parts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} part`;
  }

  update(id: number, updatePartDto: UpdatePartDto) {
    return `This action updates a #${id} part`;
  }

  remove(id: number) {
    return `This action removes a #${id} part`;
  }
}
