import { Module } from '@nestjs/common';
import { Part7Service } from './part7.service';
import { Part7Controller } from './part7.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part7, Part7Schema } from './schema/part7.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part7.name, schema: Part7Schema }])],
  controllers: [Part7Controller],
  providers: [Part7Service],
  exports: [Part7Service],
})
export class Part7Module { }
