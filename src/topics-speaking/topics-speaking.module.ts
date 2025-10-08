import { Module } from '@nestjs/common';
import { TopicsSpeakingService } from './topics-speaking.service';
import { TopicsSpeakingController } from './topics-speaking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsSpeaking, TopicsSpeakingSchema } from './schema/topics-speaking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopicsSpeaking.name, schema: TopicsSpeakingSchema }
    ]),
  ],
  controllers: [TopicsSpeakingController],
  providers: [TopicsSpeakingService],
})
export class TopicsSpeakingModule { }
