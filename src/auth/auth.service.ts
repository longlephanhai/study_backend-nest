import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LearningPathService } from 'src/learning-path/learning-path.service';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/util';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly learningPathService: LearningPathService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService
  ) { }

  // create refresh token
  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRE"),
    })
    return refreshToken;
  }

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

  async login(user: IUser, response: Response) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      targetScore: user.targetScore,
      // learningPaths: await this.learningPathService.findByUser(user._id.toString()) ?? false,
    };

    const refreshToken = this.createRefreshToken(payload);

    await this.usersService.updateUserToken(refreshToken, user._id);
    response.cookie('token', refreshToken, {
      httpOnly: true,
      maxAge: this.configService.get<number>("JWT_REFRESH_EXPIRE"),
    })

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        age: user.age,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone,
        targetScore: user.targetScore,
        learningPaths: await this.learningPathService.findByUser(user._id) ? true : false,
      },
      refreshToken: refreshToken,
    };
  }

  async getAccount(user: any) {
    const account = await this.usersService.findByEmail(user.email);
    if (!account) {
      throw new BadRequestException('User not found');
    }
    const { password, ...result } = account.toObject();
    return result;
  }

  async logout(response: Response, user: IUser) {
    await this.usersService.updateUserToken("", user._id);
    response.clearCookie('token');
    return true;
  }

  async refreshToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET")
      });
      let user = await this.usersService.findUserByRefreshToken(refreshToken);
      if (user) {
        const { _id, email, role, targetScore } = user;
        const payload = {
          email: user.email,
          sub: user._id,
          role: user.role,
          targetScore: user.targetScore,
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        const userRole = user.role as unknown as { _id: string; name: string };
        const tmp = await this.rolesService.findOne(userRole._id);

        response.clearCookie('token');
        response.cookie('token', refresh_token, {
          httpOnly: true,
          maxAge: this.configService.get<number>("JWT_REFRESH_EXPIRE"),
        })
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: role,
            age: user.age,
            avatar: user.avatar,
            address: user.address,
            phone: user.phone,
            targetScore: user.targetScore,
            learningPaths: await this.learningPathService.findByUser(user._id.toString()) ? true : false,
          },
          refreshToken: refreshToken,
        };
      }
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}