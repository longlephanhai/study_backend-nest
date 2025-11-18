import { Module } from '@nestjs/common';
import { VocabulariesFlashCardService } from './vocabularies-flash-card.service';
import { VocabulariesFlashCardController } from './vocabularies-flash-card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabulariesFlashCard, VocabulariesFlashCardSchema } from './schema/vocabularies-flash-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VocabulariesFlashCard.name, schema: VocabulariesFlashCardSchema },]),
  ],
  controllers: [VocabulariesFlashCardController],
  providers: [VocabulariesFlashCardService],
})
export class VocabulariesFlashCardModule { }
