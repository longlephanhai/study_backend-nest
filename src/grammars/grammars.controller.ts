import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrammarsService } from './grammars.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';

@Controller('grammars')
export class GrammarsController {
  constructor(private readonly grammarsService: GrammarsService) {}

  @Post()
  create(@Body() createGrammarDto: CreateGrammarDto) {
    return this.grammarsService.create(createGrammarDto);
  }

  @Get()
  findAll() {
    return this.grammarsService.findAll();
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
