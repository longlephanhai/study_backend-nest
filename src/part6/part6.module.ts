import { Module } from '@nestjs/common';
import { Part6Service } from './part6.service';
import { Part6Controller } from './part6.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part6, Part6Schema } from './schema/part6.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part6.name, schema: Part6Schema }])],
  controllers: [Part6Controller],
  providers: [Part6Service],
})
export class Part6Module {}
