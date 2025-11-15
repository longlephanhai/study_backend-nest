import { Module } from '@nestjs/common';
import { Part5Service } from './part5.service';
import { Part5Controller } from './part5.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part5, Part5Schema } from './schema/part5.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part5.name, schema: Part5Schema }])],
  controllers: [Part5Controller],
  providers: [Part5Service],
  exports: [Part5Service],
})
export class Part5Module {}
