import { Module } from '@nestjs/common';
import { GrammarsService } from './grammars.service';
import { GrammarsController } from './grammars.controller';

@Module({
  controllers: [GrammarsController],
  providers: [GrammarsService],
})
export class GrammarsModule {}
