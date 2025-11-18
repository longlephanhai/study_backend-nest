import { Module } from '@nestjs/common';
import { FlashCardService } from './flash-card.service';
import { FlashCardController } from './flash-card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashCard, FlashCardSchema } from './schema/flash-card.schema';
import { VocabulariesFlashCard, VocabulariesFlashCardSchema } from 'src/vocabularies-flash-card/schema/vocabularies-flash-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashCard.name, schema: FlashCardSchema },
      { name: VocabulariesFlashCard.name, schema: VocabulariesFlashCardSchema }
    ]),
  ],
  controllers: [FlashCardController],
  providers: [FlashCardService],
})
export class FlashCardModule { }
