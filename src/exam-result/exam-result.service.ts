import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { UpdateExamResultDto } from './dto/update-exam-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ExamResult } from './schema/exam-result.schema';
import mongoose, { Model } from 'mongoose';
import { Question } from 'src/question/schema/question.schema';

@Injectable()
export class ExamResultService {

  constructor(
    @InjectModel(ExamResult.name) private examResultModel: Model<ExamResult>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) { }


  async create(createExamResultDto: CreateExamResultDto, user: IUser) {
    const createdExamResult = new this.examResultModel({
      ...createExamResultDto,
      userId: user._id,
    });
    return createdExamResult.save();
  }

  findAll() {
    return `This action returns all examResult`;
  }

  async findOne(id: string, user: IUser) {
    const examResult = await this.examResultModel.findOne({ _id: id, userId: user._id });
    if (!examResult) {
      throw new BadRequestException('Exam result not found');
    }

    const getQuestionsData = async (answerIds: mongoose.Schema.Types.ObjectId[]) => {
      if (!answerIds?.length) return [];
      const questions = await this.questionModel.find({
        _id: { $in: answerIds }
      }).select('numberQuestion category').lean();

      return questions.map(q => ({
        numberQuestion: q.numberQuestion,
        category: q.category
      }));
    };

    const correctAnswer = await getQuestionsData(examResult.correctAnswer);
    const wrongAnswer = await getQuestionsData(examResult.wrongAnswer);
    const noAnswer = await getQuestionsData(examResult.noAnswer);

    return {
      totalCorrect: examResult.totalCorrect,
      totalListeningCorrect: examResult.totalListeningCorrect,
      totalReadingCorrect: examResult.totalReadingCorrect,
      parts: examResult.parts,
      correctAnswer,
      wrongAnswer,
      noAnswer,
    };
  }


  update(id: number, updateExamResultDto: UpdateExamResultDto) {
    return `This action updates a #${id} examResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} examResult`;
  }
}
