import { Module } from '@nestjs/common';
import { Part4Service } from './part4.service';
import { Part4Controller } from './part4.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part4, Part4Schema } from './schema/part4.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part4.name, schema: Part4Schema }])],
  controllers: [Part4Controller],
  providers: [Part4Service],
  exports: [Part4Service],
})
export class Part4Module {}
