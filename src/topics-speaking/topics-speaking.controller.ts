import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TopicsSpeakingService } from './topics-speaking.service';
import { CreateTopicsSpeakingDto } from './dto/create-topics-speaking.dto';
import { UpdateTopicsSpeakingDto } from './dto/update-topics-speaking.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('topics-speaking')
export class TopicsSpeakingController {
  constructor(private readonly topicsSpeakingService: TopicsSpeakingService) { }

  @Post()
  create(@Body() createTopicsSpeakingDto: CreateTopicsSpeakingDto) {
    return this.topicsSpeakingService.create(createTopicsSpeakingDto);
  }

  @Post('multiple')
  @ResponseMessage('Multiple topics vocabularies created successfully')
  createMultiple(@Body() createTopicsSpeakingDtos: CreateTopicsSpeakingDto[]) {
    return this.topicsSpeakingService.createMultiple(createTopicsSpeakingDtos);
  }

  @Get()
  @ResponseMessage("Get all topics speaking with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.topicsSpeakingService.findAll(+currentPage, +limit, qs);
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
