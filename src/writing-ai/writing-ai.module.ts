import { Module } from '@nestjs/common';
import { WritingAiService } from './writing-ai.service';
import { WritingAiController } from './writing-ai.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/files/multer.config';

@Module({
  controllers: [WritingAiController],
  providers: [WritingAiService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    })
  ]
})
export class WritingAiModule { }
