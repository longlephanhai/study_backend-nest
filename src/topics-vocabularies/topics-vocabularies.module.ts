import { Module } from '@nestjs/common';
import { TopicsVocabulariesService } from './topics-vocabularies.service';
import { TopicsVocabulariesController } from './topics-vocabularies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsVocabulary, TopicsVocabularySchema } from './schema/topics-vocabulary.schema';
import { Vocabulary, VocabularySchema } from 'src/vocabularies/schema/vocabulary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopicsVocabulary.name, schema: TopicsVocabularySchema },
      { name: Vocabulary.name, schema: VocabularySchema }
    ]),
  ],
  controllers: [TopicsVocabulariesController],
  providers: [TopicsVocabulariesService],
})
export class TopicsVocabulariesModule { }
