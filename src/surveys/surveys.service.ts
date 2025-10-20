import { Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Survey } from './schema/survey.schema';
import { Model } from 'mongoose';
import { User } from 'src/decorator/customize';

@Injectable()
export class SurveysService {

  constructor(@InjectModel(Survey.name) private surveyModel: Model<Survey>) { }

  async create(createSurveyDto: CreateSurveyDto, @User() user: IUser) {
    const newSurvey = await this.surveyModel.create({
      ...createSurveyDto,
      userId: user._id,
    })
    return newSurvey;
  }

  findAll() {
    return `This action returns all surveys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} survey`;
  }

  update(id: number, updateSurveyDto: UpdateSurveyDto) {
    return `This action updates a #${id} survey`;
  }

  remove(id: number) {
    return `This action removes a #${id} survey`;
  }
}
