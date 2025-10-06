import { Body, Controller, Post, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { WritingAiService } from './writing-ai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/core/http-exception.filter';
import * as fs from 'fs';

import { ResponseMessage } from 'src/decorator/customize';


@Controller('writing-ai')
export class WritingAiController {
  constructor(private readonly writingAiService: WritingAiService) { }

  @Post('generate-text')
  @ResponseMessage('Generate text successfully')
  async generateText(@Body() promptDto: PromptDto): Promise<string> {
    return this.writingAiService.generateText(promptDto);
  }

  @Post('generate-image')
  @UseInterceptors(FileInterceptor('image'))
  @UseFilters(new HttpExceptionFilter())
  async generateImage(
    @Body('prompt') prompt: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const imageBuffer = fs.readFileSync(file.path);
    const imageBase64 = imageBuffer.toString('base64');
    return this.writingAiService.generateImage(prompt, imageBase64);
  }

}
