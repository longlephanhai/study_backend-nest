import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GrammarsService } from './grammars.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('grammars')
export class GrammarsController {
  constructor(private readonly grammarsService: GrammarsService) { }

  @Post()
  create(@Body() createGrammarDto: CreateGrammarDto) {
    return this.grammarsService.create(createGrammarDto);
  }

  @Post('multiple')
  createMultiple(@Body() createGrammarDto: CreateGrammarDto[], @User() user: IUser) {
    return this.grammarsService.createMultiple(createGrammarDto, user);
  }

  @Get()
  @ResponseMessage("Get all grammars with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.grammarsService.findAll(+currentPage, +limit, qs);
  }

  @Get('questions-ai/:id')
  @ResponseMessage("Get grammar questions by AI")
  findQuestionsByAI(@Param('id') id: string) {
    return this.grammarsService.findQuestionsByAI(id);
  }

  @Get('all')
  @ResponseMessage("Get all grammars without pagination")
  findAllWithoutPagination() {
    return this.grammarsService.findAllWithoutPagination();
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
