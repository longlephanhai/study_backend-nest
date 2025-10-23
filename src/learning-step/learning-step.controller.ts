import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningStepService } from './learning-step.service';
import { CreateLearningStepDto } from './dto/create-learning-step.dto';
import { UpdateLearningStepDto } from './dto/update-learning-step.dto';

@Controller('learning-step')
export class LearningStepController {
  constructor(private readonly learningStepService: LearningStepService) {}

  @Post()
  create(@Body() createLearningStepDto: CreateLearningStepDto) {
    return this.learningStepService.create(createLearningStepDto);
  }

  @Get()
  findAll() {
    return this.learningStepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningStepService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningStepDto: UpdateLearningStepDto) {
    return this.learningStepService.update(+id, updateLearningStepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningStepService.remove(+id);
  }
}
