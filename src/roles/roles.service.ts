import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {

  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) { }


  async create(createRoleDto: CreateRoleDto, user: IUser) {

    const isExist = await this.roleModel.findOne({
      name: createRoleDto.name
    })
    if (isExist) {
      throw new BadRequestException("Role already exists. Please choose a different name.")
    }

    const newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
    return newRole;
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
