import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TopicsSpeakingService } from './topics-speaking.service';
import { CreateTopicsSpeakingDto } from './dto/create-topics-speaking.dto';
import { UpdateTopicsSpeakingDto } from './dto/update-topics-speaking.dto';

@Controller('topics-speaking')
export class TopicsSpeakingController {
  constructor(private readonly topicsSpeakingService: TopicsSpeakingService) { }

  @Post()
  create(@Body() createTopicsSpeakingDto: CreateTopicsSpeakingDto) {
    return this.topicsSpeakingService.create(createTopicsSpeakingDto);
  }

  @Post('multiple')
  createMultiple(@Body() createTopicsSpeakingDtos: CreateTopicsSpeakingDto[]) {
    return this.topicsSpeakingService.createMultiple(createTopicsSpeakingDtos);
  }

  @Get()
  findAll() {
    return this.topicsSpeakingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsSpeakingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicsSpeakingDto: UpdateTopicsSpeakingDto) {
    return this.topicsSpeakingService.update(+id, updateTopicsSpeakingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsSpeakingService.remove(+id);
  }
}
