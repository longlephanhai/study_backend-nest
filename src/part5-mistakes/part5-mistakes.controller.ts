import { Controller, Post, Body, Get } from '@nestjs/common';
import { Part5MistakesService } from './part5-mistakes.service';
import { ResponseMessage, User } from 'src/decorator/customize';


@Controller('part5-mistakes')
export class Part5MistakesController {
  constructor(private readonly part5MistakesService: Part5MistakesService) { }

  @Post('generate-part5-mistakes')
  @ResponseMessage('Generate questions successfully')
  generateText(@Body('numQuestions') numQuestions: number, @User() user: IUser) {
    return this.part5MistakesService.generatePart5Mistakes(numQuestions, user);
  }

  @Get()
  @ResponseMessage('Get all mistakes successfully')
  getAllMistakes(@User() user: IUser) {
    return this.part5MistakesService.getAllMistakes(user);
  }

}
