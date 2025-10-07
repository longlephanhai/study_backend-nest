import { Module } from '@nestjs/common';
import { TopicsVocabulariesService } from './topics-vocabularies.service';
import { TopicsVocabulariesController } from './topics-vocabularies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsVocabulary, TopicsVocabularySchema } from './schema/topics-vocabulary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopicsVocabulary.name, schema: TopicsVocabularySchema }
    ]),
  ],
  controllers: [TopicsVocabulariesController],
  providers: [TopicsVocabulariesService],
})
export class TopicsVocabulariesModule { }
