import { Module } from '@nestjs/common';
import { WritingHistoryService } from './writing-history.service';
import { WritingHistoryController } from './writing-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WritingHistory, WritingHistorySchema } from './schema/writing-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WritingHistory.name, schema: WritingHistorySchema },]),
  ],
  controllers: [WritingHistoryController],
  providers: [WritingHistoryService],
})
export class WritingHistoryModule { }
