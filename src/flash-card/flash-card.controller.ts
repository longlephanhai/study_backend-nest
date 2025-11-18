import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlashCardService } from './flash-card.service';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { User } from 'src/decorator/customize';

@Controller('flash-card')
export class FlashCardController {
  constructor(private readonly flashCardService: FlashCardService) { }

  @Post()
  create(@Body() createFlashCardDto: CreateFlashCardDto, @User() user: IUser) {
    return this.flashCardService.create(createFlashCardDto, user);
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
