import { Body, Controller, Post } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) { }

  @Post('explain-sentence')
  @Public()
  @ResponseMessage('Ai Assistant - Explain Sentence successfully')
  explainSentence(@Body('sentence') sentence: string) {
    return this.aiAssistantService.explainSentence(sentence);
  }
}
