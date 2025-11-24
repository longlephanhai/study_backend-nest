import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(createVocabulariesFlashCardDto: CreateVocabulariesFlashCardDto, user: IUser) {
    await this.vocabulariesFlashCardModel.create({
      ...createVocabulariesFlashCardDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  findAll() {
    return `This action returns all vocabulariesFlashCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulariesFlashCard`;
  }

  async update(id: string, updateVocabulariesFlashCardDto: UpdateVocabulariesFlashCardDto) {
    const vocabulary = await this.vocabulariesFlashCardModel.findOne({
      _id: id,
    })
    if (!vocabulary) {
      throw new BadRequestException("Vocabulary not found");
    }
    return await this.vocabulariesFlashCardModel.findByIdAndUpdate(id, updateVocabulariesFlashCardDto, { new: true });
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulariesFlashCard`;
  }
}
