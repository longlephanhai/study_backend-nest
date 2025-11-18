import { Module } from '@nestjs/common';
import { FlashCardService } from './flash-card.service';
import { FlashCardController } from './flash-card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashCard, FlashCardSchema } from './schema/flash-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashCard.name, schema: FlashCardSchema },
    ]),
  ],
  controllers: [FlashCardController],
  providers: [FlashCardService],
})
export class FlashCardModule { }
