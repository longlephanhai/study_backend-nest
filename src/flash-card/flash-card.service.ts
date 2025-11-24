import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlashCard } from './schema/flash-card.schema';
import { Model } from 'mongoose';
import { VocabulariesFlashCard } from 'src/vocabularies-flash-card/schema/vocabularies-flash-card.schema';
import { CreateVocabulariesFlashCardDto } from 'src/vocabularies-flash-card/dto/create-vocabularies-flash-card.dto';
import { UpdateVocabulariesFlashCardDto } from 'src/vocabularies-flash-card/dto/update-vocabularies-flash-card.dto';
import { VocabulariesFlashCardService } from 'src/vocabularies-flash-card/vocabularies-flash-card.service';

@Injectable()
export class FlashCardService {

  constructor(
    @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,
    @InjectModel(VocabulariesFlashCard.name) private vocabulariesFlashCardModel: Model<VocabulariesFlashCard>,
    private readonly vocabulariesFlashCardService: VocabulariesFlashCardService,
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
    return await this.flashCardModel.findByIdAndUpdate(id, {
      $push: {
        vocabulariesFlashCardId: { $each: vocabularies.map(v => v._id) }
      }
    })
  }

  async findAll(user: IUser) {
    const flashCards = await this.flashCardModel.find({
      userId: user._id,
    })
    return flashCards;
  }

  async findOne(id: string) {
    const flashCard = await this.flashCardModel.findById(id).populate('vocabulariesFlashCardId');
    if (!flashCard) {
      throw new BadRequestException("Flash card not found");
    }
    return flashCard;
  }

  async update(id: string, updateFlashCardDto: UpdateFlashCardDto) {
    const flashCard = await this.flashCardModel.findOne({ _id: id });
    if (!flashCard) {
      throw new BadRequestException("Flash card not found");
    }
    return await this.flashCardModel.findByIdAndUpdate(id, updateFlashCardDto, {
      new: true,
    });
  }

  //   [
  //   {
  //     _id: '6924b1f66dc3d195041b8564',
  //     vocabulary: 'tuwf bngfw1',
  //     meaning: 'ưqe',
  //     example: 'ưqewq',
  //     pronunciation: 'ưqewq',
  //     __v: 0,
  //     createdAt: '2025-11-24T19:28:54.889Z',
  //     updatedAt: '2025-11-24T19:28:54.889Z'
  //   },
  //   {
  //     vocabulary: 'dqw',
  //     meaning: 'dwqdwq',
  //     example: 'dwqdwq',
  //     pronunciation: 'dwqdwqd'
  //   },
  //   {
  //     vocabulary: 'dwq',
  //     meaning: 'dwqd',
  //     pronunciation: 'wqdwq',
  //     example: 'dwqd'
  //   }
  // ]

  async updateVocabularies(id: string, updateVocabulariesFlashCardDto: UpdateVocabulariesFlashCardDto[]) {
    const flashCard = await this.flashCardModel.findById(id);
    if (!flashCard) {
      throw new BadRequestException("Flash card not found");
    }
    updateVocabulariesFlashCardDto.forEach(async (vocab) => {
      if (vocab._id) {
        await this.vocabulariesFlashCardService.update(vocab._id, vocab);
      } else {
        const newVocab = await this.vocabulariesFlashCardModel.create(vocab);
        await this.flashCardModel.findByIdAndUpdate(id, {
          $push: {
            vocabulariesFlashCardId: newVocab._id
          }
        })
      }
    })
    return await this.flashCardModel.findById(id).populate('vocabulariesFlashCardId');
  }

  async remove(id: string) {
    const flashCard = await this.flashCardModel.findOne({ _id: id });
    if (!flashCard) {
      throw new BadRequestException("Flash card not found");
    }
    await this.vocabulariesFlashCardModel.deleteMany({
      _id: { $in: flashCard.vocabulariesFlashCardId }
    });
    return await this.flashCardModel.deleteOne({ _id: id });

  }
}
