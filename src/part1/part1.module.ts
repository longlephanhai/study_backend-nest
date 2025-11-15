import { Module } from '@nestjs/common';
import { Part1Service } from './part1.service';
import { Part1Controller } from './part1.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part1, Part1Schema } from './schema/part1.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part1.name, schema: Part1Schema }])],
  controllers: [Part1Controller],
  providers: [Part1Service],
  exports: [Part1Service],
})
export class Part1Module { }
