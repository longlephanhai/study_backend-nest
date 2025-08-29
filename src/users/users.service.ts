import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from 'src/util';
import { Role } from 'src/roles/schema/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>
  ) { }

  async registerUser(registerUser: RegisterUserDto) {

    const isExist = await this.userModel.findOne({
      email: registerUser.email
    })

    if (isExist) {
      throw new BadRequestException('Email already exists, please use another one.');
    }

    const hashedPassword = hashPassword(registerUser.password);

    const userRole = await this.roleModel.findOne({ name: 'NORMAL_USER' });

    const newUser = await this.userModel.create({
      ...registerUser, password: hashedPassword, role: userRole
    });

    return newUser;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.findOne({
      email: createUserDto.email
    })
    if (isExist) {
      throw new BadRequestException('Email already exists, please use another one.');
    }

    const hashedPassword = hashPassword(createUserDto.password);

    const newUser = await this.userModel.create({
      ...createUserDto,
      role: createUserDto.role,
      password: hashedPassword,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
