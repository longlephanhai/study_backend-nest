import { Controller, Post, Body, Res } from '@nestjs/common';
import express from 'express';
import { ResponseMessage } from 'src/decorator/customize';
import { SpeakingAiService } from './speaking-ai.service';

@Controller('speaking-ai')
export class SpeakingAiController {
  constructor(private readonly speakingAiService: SpeakingAiService) { }

  @Post()
  @ResponseMessage('Chat GPT response')
  async chat(@Body('text') text: string, @Res() res: express.Response) {
    const responseText = await this.speakingAiService.getChatGptResponse(text);
    const audio = await this.speakingAiService.convertTextToSpeech(responseText);
    res.set('Content-Type', 'application/json');
    res.send({
      text: responseText,
      audio: `data:audio/mpeg;base64,${audio.toString('base64')}`,
    });
  }

  @Post('start')
  @ResponseMessage('Start speaking session')
  async start(@Body('topic') topic: string, @Res() res: express.Response) {
    const firstQuestion = await this.speakingAiService.startConversation(topic);
    const audio = await this.speakingAiService.convertTextToSpeech(firstQuestion);
    res.set('Content-Type', 'application/json');
    res.send({
      text: firstQuestion,
      audio: `data:audio/mpeg;base64,${audio.toString('base64')}`,
    });
  }
}
