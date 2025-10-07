import { Module } from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesController } from './vocabularies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './schema/vocabulary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vocabulary.name, schema: VocabularySchema },]),
  ],
  controllers: [VocabulariesController],
  providers: [VocabulariesService],
})
export class VocabulariesModule { }
