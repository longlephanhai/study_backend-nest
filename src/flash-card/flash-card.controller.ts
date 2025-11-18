import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlashCardService } from './flash-card.service';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { CreateVocabulariesFlashCardDto } from 'src/vocabularies-flash-card/dto/create-vocabularies-flash-card.dto';

@Controller('flash-card')
export class FlashCardController {
  constructor(private readonly flashCardService: FlashCardService) { }

  @Post()
  @ResponseMessage("Flash card created successfully")
  create(@Body() createFlashCardDto: CreateFlashCardDto, @User() user: IUser) {
    return this.flashCardService.create(createFlashCardDto, user);
  }

  @Post('vocabularies/:id')
  @ResponseMessage("Flash card with vocabularies created successfully")
  createVocabularies(@Param('id') id: string, @Body() createVocabulariesFlashCardDto: CreateVocabulariesFlashCardDto[], @User() user: IUser) {
    return this.flashCardService.createVocabularies(id, createVocabulariesFlashCardDto, user);
  }

  @Get()
  findAll() {
    return this.flashCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashCardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlashCardDto: UpdateFlashCardDto) {
    return this.flashCardService.update(+id, updateFlashCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashCardService.remove(+id);
  }
}
