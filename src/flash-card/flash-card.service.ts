import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlashCard } from './schema/flash-card.schema';
import { Model } from 'mongoose';

@Injectable()
export class FlashCardService {

  constructor(
    @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,
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

  findAll() {
    return `This action returns all flashCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashCard`;
  }

  update(id: number, updateFlashCardDto: UpdateFlashCardDto) {
    return `This action updates a #${id} flashCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashCard`;
  }
}
