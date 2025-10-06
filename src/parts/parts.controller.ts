import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';

export interface StartTestDTO {
  partIds: string[];
}

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) { }

  @Post(':id/questions')
  @ResponseMessage('Question created successfully')
  createQuestion(@Param('id') id: string, @Body() createQuestionDTO: CreateQuestionDto, @User() user: IUser) {
    return this.partsService.createQuestion(id, createQuestionDTO, user);
  }

  @Post(':id/questions/multiple')
  @ResponseMessage('Questions created successfully')
  createMultipleQuestion(@Param('id') id: string, @Body() createQuestionDTO: CreateQuestionDto[], @User() user: IUser) {
    return this.partsService.createMultipleQuestions(id, createQuestionDTO, user);
  }

  @Post()
  create(@Body() createPartDto: CreatePartDto) {
    return this.partsService.create(createPartDto);
  }

  @Get()
  @ResponseMessage("Get all parts with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.partsService.findAll(+currentPage, +limit, qs);
  }

  @Post('start')
  @ResponseMessage("Get all parts to start a test")
  findAllToStart(@Body() startTestDTO: StartTestDTO) {
    return this.partsService.findAllToStart(startTestDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartDto: UpdatePartDto) {
    return this.partsService.update(+id, updatePartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partsService.remove(+id);
  }
}
