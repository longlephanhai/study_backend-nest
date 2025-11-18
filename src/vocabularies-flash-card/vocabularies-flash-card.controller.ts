import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VocabulariesFlashCardService } from './vocabularies-flash-card.service';
import { CreateVocabulariesFlashCardDto } from './dto/create-vocabularies-flash-card.dto';
import { UpdateVocabulariesFlashCardDto } from './dto/update-vocabularies-flash-card.dto';

@Controller('vocabularies-flash-card')
export class VocabulariesFlashCardController {
  constructor(private readonly vocabulariesFlashCardService: VocabulariesFlashCardService) {}

  @Post()
  create(@Body() createVocabulariesFlashCardDto: CreateVocabulariesFlashCardDto) {
    return this.vocabulariesFlashCardService.create(createVocabulariesFlashCardDto);
  }

  @Get()
  findAll() {
    return this.vocabulariesFlashCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabulariesFlashCardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocabulariesFlashCardDto: UpdateVocabulariesFlashCardDto) {
    return this.vocabulariesFlashCardService.update(+id, updateVocabulariesFlashCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabulariesFlashCardService.remove(+id);
  }
}
