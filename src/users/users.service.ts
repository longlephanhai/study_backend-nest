import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from 'src/util';
import { Role } from 'src/roles/schema/role.schema';
import aqp from 'api-query-params';

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

    return newUser._id
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate('role')
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async updateUserToken(refreshToken: string, _id: string) {
    return this.userModel.updateOne({
      _id: _id
    }, {
      refreshToken: refreshToken
    })
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
