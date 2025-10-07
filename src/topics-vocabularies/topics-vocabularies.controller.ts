import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TopicsVocabulariesService } from './topics-vocabularies.service';
import { CreateTopicsVocabularyDto } from './dto/create-topics-vocabulary.dto';
import { UpdateTopicsVocabularyDto } from './dto/update-topics-vocabulary.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('topics-vocabularies')
export class TopicsVocabulariesController {
  constructor(private readonly topicsVocabulariesService: TopicsVocabulariesService) { }

  @Post()
  create(@Body() createTopicsVocabularyDto: CreateTopicsVocabularyDto) {
    return this.topicsVocabulariesService.create(createTopicsVocabularyDto);
  }

  @Post('multiple')
  @ResponseMessage('Multiple topics vocabularies created successfully')
  createMultiple(@Body() createTopicsVocabularyDtos: CreateTopicsVocabularyDto[]) {
    return this.topicsVocabulariesService.createMultiple(createTopicsVocabularyDtos);
  }

  @Get()
  @ResponseMessage("Get all topics vocabularies with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.topicsVocabulariesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsVocabulariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicsVocabularyDto: UpdateTopicsVocabularyDto) {
    return this.topicsVocabulariesService.update(+id, updateTopicsVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsVocabulariesService.remove(+id);
  }
}
