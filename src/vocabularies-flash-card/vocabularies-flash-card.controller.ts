import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VocabulariesFlashCardService } from './vocabularies-flash-card.service';
import { CreateVocabulariesFlashCardDto } from './dto/create-vocabularies-flash-card.dto';
import { UpdateVocabulariesFlashCardDto } from './dto/update-vocabularies-flash-card.dto';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('vocabularies-flash-card')
export class VocabulariesFlashCardController {
  constructor(private readonly vocabulariesFlashCardService: VocabulariesFlashCardService) { }

  @Post()
  @ResponseMessage("Vocabularies flash card created successfully")
  create(@Body() createVocabulariesFlashCardDto: CreateVocabulariesFlashCardDto, @User() user: IUser) {
    return this.vocabulariesFlashCardService.create(createVocabulariesFlashCardDto, user);
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
  @ResponseMessage("Vocabularies flash card updated successfully")
  update(@Param('id') id: string, @Body() updateVocabulariesFlashCardDto: UpdateVocabulariesFlashCardDto) {
    return this.vocabulariesFlashCardService.update(id, updateVocabulariesFlashCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabulariesFlashCardService.remove(+id);
  }
}
