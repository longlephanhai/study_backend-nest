import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlashCard } from './schema/flash-card.schema';
import { Model } from 'mongoose';
import { VocabulariesFlashCard } from 'src/vocabularies-flash-card/schema/vocabularies-flash-card.schema';
import { CreateVocabulariesFlashCardDto } from 'src/vocabularies-flash-card/dto/create-vocabularies-flash-card.dto';

@Injectable()
export class FlashCardService {

  constructor(
    @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,
    @InjectModel(VocabulariesFlashCard.name) private vocabulariesFlashCardModel: Model<VocabulariesFlashCard>,
  ) { }

  async create(createFlashCardDto: CreateFlashCardDto, user: IUser) {
    const isExist = await this.flashCardModel.findOne({
      title: createFlashCardDto.title,
    })
    if (isExist) {
      throw new BadRequestException('Flash card with this title already exists');
    }
    const newFlashCard = await this.flashCardModel.create({
      ...createFlashCardDto,
      userId: user._id,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newFlashCard;
  }

  async createVocabularies(id: string, createVocabulariesFlashCardDto: CreateVocabulariesFlashCardDto[], user: IUser) {
    const flashCard = await this.flashCardModel.findById(id);
    if (!flashCard) {
      throw new BadRequestException("Flash card not found");
    }
    const vocabularies = await this.vocabulariesFlashCardModel.insertMany(createVocabulariesFlashCardDto)
    await this.flashCardModel.findByIdAndUpdate(id, {
      $push: {
        vocabulariesFlashCardId: { $each: vocabularies.map(v => v._id) }
      }
    })
  }

  findAll() {
    return `This action returns all flashCard`;
  }

  async findOne(id: string) {
    const flashCard = await this.flashCardModel.findById(id).populate('vocabulariesFlashCardId');
    if (!flashCard) {
      throw new BadRequestException("Flash card not found");
    }
    return flashCard;
  }

  update(id: number, updateFlashCardDto: UpdateFlashCardDto) {
    return `This action updates a #${id} flashCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashCard`;
  }
}
