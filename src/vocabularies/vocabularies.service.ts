import { Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vocabulary } from './schema/vocabulary.schema';
import { Model } from 'mongoose';

@Injectable()
export class VocabulariesService {
  constructor(
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
  ) { }

  create(createVocabularyDto: CreateVocabularyDto) {
    return 'This action adds a new vocabulary';
  }

  findAll() {
    return `This action returns all vocabularies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulary`;
  }

  update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return `This action updates a #${id} vocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulary`;
  }
}
