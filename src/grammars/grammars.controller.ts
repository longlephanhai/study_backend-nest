import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GrammarsService } from './grammars.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('grammars')
export class GrammarsController {
  constructor(private readonly grammarsService: GrammarsService) { }

  @Post()
  create(@Body() createGrammarDto: CreateGrammarDto) {
    return this.grammarsService.create(createGrammarDto);
  }

  @Get()
  @ResponseMessage("Get all grammars with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.grammarsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grammarsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrammarDto: UpdateGrammarDto) {
    return this.grammarsService.update(+id, updateGrammarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grammarsService.remove(+id);
  }
}
