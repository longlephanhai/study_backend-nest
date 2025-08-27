import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ResponseMessage('User registered successfully')
  register(
    @Body() registerUser: RegisterUserDto
  ) {
    return this.authService.handleRegister(registerUser);
  }
}
