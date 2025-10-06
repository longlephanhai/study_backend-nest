import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WritingHistoryService } from './writing-history.service';
import { CreateWritingHistoryDto } from './dto/create-writing-history.dto';
import { UpdateWritingHistoryDto } from './dto/update-writing-history.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('writing-history')
export class WritingHistoryController {
  constructor(private readonly writingHistoryService: WritingHistoryService) { }

  @Post()
  @ResponseMessage('Save writing history successfully')
  create(@Body() createWritingHistoryDto: CreateWritingHistoryDto) {
    return this.writingHistoryService.create(createWritingHistoryDto);
  }

  @Get()
  findAll() {
    return this.writingHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.writingHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWritingHistoryDto: UpdateWritingHistoryDto) {
    return this.writingHistoryService.update(+id, updateWritingHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.writingHistoryService.remove(+id);
  }
}
