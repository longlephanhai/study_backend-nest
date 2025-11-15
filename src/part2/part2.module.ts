import { Module } from '@nestjs/common';
import { Part2Service } from './part2.service';
import { Part2Controller } from './part2.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Part2, Part2Schema } from './schema/part2.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part2.name, schema: Part2Schema }])],
  controllers: [Part2Controller],
  providers: [Part2Service],
  exports: [Part2Service],
})
export class Part2Module { }
