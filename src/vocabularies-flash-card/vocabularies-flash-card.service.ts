import { Injectable } from '@nestjs/common';
import { CreateVocabulariesFlashCardDto } from './dto/create-vocabularies-flash-card.dto';
import { UpdateVocabulariesFlashCardDto } from './dto/update-vocabularies-flash-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VocabulariesFlashCard } from './schema/vocabularies-flash-card.schema';
import { Model } from 'mongoose';

@Injectable()
export class VocabulariesFlashCardService {

  constructor(
    @InjectModel(VocabulariesFlashCard.name) private vocabulariesFlashCardModel: Model<VocabulariesFlashCard>,
  ) { }

  create(createVocabulariesFlashCardDto: CreateVocabulariesFlashCardDto) {
    return 'This action adds a new vocabulariesFlashCard';
  }

  findAll() {
    return `This action returns all vocabulariesFlashCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulariesFlashCard`;
  }

  update(id: number, updateVocabulariesFlashCardDto: UpdateVocabulariesFlashCardDto) {
    return `This action updates a #${id} vocabulariesFlashCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulariesFlashCard`;
  }
}
