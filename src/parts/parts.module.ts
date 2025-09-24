import { Module } from '@nestjs/common';
import { PartsService } from './parts.service';
import { PartsController } from './parts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part, PartSchema } from './schema/part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Part.name, schema: PartSchema }
    ]),
  ],
  controllers: [PartsController],
  providers: [PartsService],
  exports: [PartsService],
})
export class PartsModule { }
