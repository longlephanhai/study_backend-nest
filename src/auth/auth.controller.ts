import { Body, Controller, Request, Post, UseGuards, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @Public()
  @ResponseMessage('User registered successfully')
  register(
    @Body() registerUser: RegisterUserDto
  ) {
    return this.authService.handleRegister(registerUser);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage('User logged in successfully')
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Get('account')
  @ResponseMessage('User account fetched successfully')
  getAccount(@Request() req) {
    return this.authService.getAccount(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  @ResponseMessage('User logged out successfully')
  logout(@Res({ passthrough: true }) response: Response,
        @User() user: IUser,) {
    return this.authService.logout(response, user);
  }

}
