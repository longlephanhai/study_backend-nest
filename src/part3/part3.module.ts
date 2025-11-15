import { Module } from '@nestjs/common';
import { Part3Service } from './part3.service';
import { Part3Controller } from './part3.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part3, Part3Schema } from './schema/part3.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part3.name, schema: Part3Schema }])],
  controllers: [Part3Controller],
  providers: [Part3Service],
  exports: [Part3Service],
})
export class Part3Module { }
