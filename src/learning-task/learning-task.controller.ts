import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningTaskService } from './learning-task.service';
import { CreateLearningTaskDto } from './dto/create-learning-task.dto';
import { UpdateLearningTaskDto } from './dto/update-learning-task.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('learning-task')
export class LearningTaskController {
  constructor(private readonly learningTaskService: LearningTaskService) { }

  @Post()
  create(@Body() createLearningTaskDto: CreateLearningTaskDto) {
    return this.learningTaskService.create(createLearningTaskDto);
  }

  @Get()
  findAll() {
    return this.learningTaskService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Get learning task successfully')
  findOne(@Param('id') id: string) {
    return this.learningTaskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningTaskDto: UpdateLearningTaskDto) {
    return this.learningTaskService.update(id, updateLearningTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningTaskService.remove(+id);
  }
}
