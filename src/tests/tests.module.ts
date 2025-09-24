import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './schema/test.schema';
import { Part, PartSchema } from 'src/parts/schema/part.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: Part.name, schema: PartSchema }
    ]),
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule { }
