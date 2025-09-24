import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { CreatePartDto } from 'src/parts/dto/create-part.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) { }

  @Post()
  @ResponseMessage('Test created successfully')
  create(@Body() createTestDto: CreateTestDto, @User() user: IUser) {
    return this.testsService.create(createTestDto, user);
  }

  @Post('multiple')
  @ResponseMessage('Tests created successfully')
  createMultiple(@Body() createTestDto: CreateTestDto[], @User() user: IUser) {
    return this.testsService.createMultiple(createTestDto, user);
  }

  @Post(':id/parts')
  @ResponseMessage('Part created successfully')
  createPart(@Param('id') id: string, @Body() createPartDto: CreatePartDto, @User() user: IUser) {
    return this.testsService.createPart(id, createPartDto, user);
  }

  @Get()
  findAll() {
    return this.testsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.remove(+id);
  }
}
