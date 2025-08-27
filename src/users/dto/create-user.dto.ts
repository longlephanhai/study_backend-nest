import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto { }

export class RegisterUserDto {
  @IsNotEmpty({ message: "Full Name is required" })
  fullName: string;

  @IsNotEmpty({ message: "Age is required" })
  age: number;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsNotEmpty({ message: "Phone number is required" })
  phone: number;

  @IsNotEmpty({ message: "Address is required" })
  address: string;
}
