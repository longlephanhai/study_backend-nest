import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FlashCardService } from './flash-card.service';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { CreateVocabulariesFlashCardDto } from 'src/vocabularies-flash-card/dto/create-vocabularies-flash-card.dto';
import { UpdateVocabulariesFlashCardDto } from 'src/vocabularies-flash-card/dto/update-vocabularies-flash-card.dto';

@Controller('flash-card')
export class FlashCardController {
  constructor(private readonly flashCardService: FlashCardService) { }

  @Post()
  @ResponseMessage("Flash card created successfully")
  create(@Body() createFlashCardDto: CreateFlashCardDto, @User() user: IUser) {
    return this.flashCardService.create(createFlashCardDto, user);
  }

  @Post('vocabularies/:id')
  @ResponseMessage("Vocabularies created successfully")
  createVocabularies(@Param('id') id: string, @Body() createVocabulariesFlashCardDto: CreateVocabulariesFlashCardDto[], @User() user: IUser) {
    return this.flashCardService.createVocabularies(id, createVocabulariesFlashCardDto, user);
  }

  @Get()
  @ResponseMessage("Flash cards retrieved successfully by user")
  findAll(@User() user: IUser) {
    return this.flashCardService.findAll(user);
  }

  @Get(':id')
  @ResponseMessage("vocabularies flash card retrieved successfully")
  findOne(@Param('id') id: string) {
    return this.flashCardService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Flash card updated successfully")
  update(@Param('id') id: string, @Body() updateFlashCardDto: UpdateFlashCardDto) {
    return this.flashCardService.update(id, updateFlashCardDto);
  }

  @Patch('vocabularies/:id')
  @ResponseMessage("Vocabularies flash card updated successfully")
  updateVocabularies(@Param('id') id: string, @Body() updateVocabulariesFlashCardDto: UpdateVocabulariesFlashCardDto[]) {
    return this.flashCardService.updateVocabularies(id, updateVocabulariesFlashCardDto);
  }

  @Delete(':id')
  @ResponseMessage("Flash card deleted successfully")
  remove(@Param('id') id: string) {
    return this.flashCardService.remove(id);
  }
}
