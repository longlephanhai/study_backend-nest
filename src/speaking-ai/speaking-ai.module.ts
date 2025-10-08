import { Module } from '@nestjs/common';
import { SpeakingAiService } from './speaking-ai.service';
import { SpeakingAiController } from './speaking-ai.controller';

@Module({
  controllers: [SpeakingAiController],
  providers: [SpeakingAiService],
})
export class SpeakingAiModule {}
