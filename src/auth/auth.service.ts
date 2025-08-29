import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/util';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async handleRegister(registerUser: RegisterUserDto) {
    return this.usersService.registerUser(registerUser);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user) {
      const checkPassword = comparePassword(pass, user.password);
      if (checkPassword) {
        const { password, ...result } = user.toObject();
        return result;
      }
    }
    return null;
  }

  async login(user: IUser) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      userInfo: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        age: user.age,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone
      }
    };
  }
}
