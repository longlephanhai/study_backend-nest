import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserTaskProgressService } from './user-task-progress.service';
import { CreateUserTaskProgressDto } from './dto/create-user-task-progress.dto';
import { UpdateUserTaskProgressDto } from './dto/update-user-task-progress.dto';

@Controller('user-task-progress')
export class UserTaskProgressController {
  constructor(private readonly userTaskProgressService: UserTaskProgressService) {}

  @Post()
  create(@Body() createUserTaskProgressDto: CreateUserTaskProgressDto) {
    return this.userTaskProgressService.create(createUserTaskProgressDto);
  }

  @Get()
  findAll() {
    return this.userTaskProgressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTaskProgressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserTaskProgressDto: UpdateUserTaskProgressDto) {
    return this.userTaskProgressService.update(+id, updateUserTaskProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTaskProgressService.remove(+id);
  }
}
