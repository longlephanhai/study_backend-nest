import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService) { }

  async handleRegister(registerUser: RegisterUserDto) {
    return this.usersService.registerUser(registerUser);
  }
}
