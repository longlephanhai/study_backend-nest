import { Controller, Post, Body, Get } from '@nestjs/common';
import { Part5MistakesService } from './part5-mistakes.service';
import { ResponseMessage, User } from 'src/decorator/customize';


@Controller('part5-mistakes')
export class Part5MistakesController {
  constructor(private readonly part5MistakesService: Part5MistakesService) { }

  @Post('generate-part3-mistakes')
  @ResponseMessage('Generate questions successfully')
  generateTextPart3(@Body('numQuestions') numQuestions: number, @User() user: IUser) {
    return this.part5MistakesService.generatePart3Mistakes(numQuestions, user);
  }

  @Post('generate-part4-mistakes')
  @ResponseMessage('Generate questions successfully')
  generateTextPart4(@Body('numQuestions') numQuestions: number, @User() user: IUser) {
    return this.part5MistakesService.generatePart4Mistakes(numQuestions, user);
  }

  @Post('generate-part5-mistakes')
  @ResponseMessage('Generate questions successfully')
  generateTextPart5(@Body('numQuestions') numQuestions: number, @User() user: IUser) {
    return this.part5MistakesService.generatePart5Mistakes(numQuestions, user);
  }

  @Post('generate-part6-mistakes')
  @ResponseMessage('Generate questions successfully')
  generateTextPart6(@Body('numQuestions') numQuestions: number, @User() user: IUser) {
    return this.part5MistakesService.generatePart6Mistakes(numQuestions, user);
  }

  @Post('generate-part7-mistakes')
  @ResponseMessage('Generate questions successfully')
  generateTextPart7(@Body('numQuestions') numQuestions: number, @User() user: IUser) {
    return this.part5MistakesService.generatePart7Mistakes(numQuestions, user);
  }

  @Get()
  @ResponseMessage('Get all mistakes successfully')
  getAllMistakes(@User() user: IUser) {
    return this.part5MistakesService.getAllMistakes(user);
  }

}
