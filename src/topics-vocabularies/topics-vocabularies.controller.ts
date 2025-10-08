import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TopicsVocabulariesService } from './topics-vocabularies.service';
import { CreateTopicsVocabularyDto } from './dto/create-topics-vocabulary.dto';
import { UpdateTopicsVocabularyDto } from './dto/update-topics-vocabulary.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { CreateVocabularyDto } from 'src/vocabularies/dto/create-vocabulary.dto';

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

  @Post(':id/vocabularies/multiple')
  @ResponseMessage('Part created successfully')
  createPart(@Param('id') id: string, @Body() createVocabularyDto: CreateVocabularyDto[], @User() user: IUser) {
    return this.topicsVocabulariesService.createMultipleVocabulary(id, createVocabularyDto, user);
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
