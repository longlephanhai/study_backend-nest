import { IsNotEmpty } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Description is required" })
  description: string;
}
