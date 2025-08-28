import { IsArray, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsNotEmpty({ message: "Description is required" })
  description: string;


  @IsNotEmpty({ message: 'permissions is required' })
  @IsMongoId({ each: true, message: "each permission must be a mongo object id" })
  @IsArray({ message: 'permissions must be an array' })
  permissions: mongoose.Types.ObjectId[];
}
