import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import mongoose from "mongoose";

export class CreatePartDto {
  @IsNotEmpty({ message: 'Part number is required' })
  @IsNumber({}, { message: 'Part number must be a number' })
  partNo: number;

  @IsNotEmpty({ message: 'Part name is required' })
  name: string;

  @IsOptional()
  durationSec?: number;

  @IsNotEmpty({ message: 'Order index is required' })
  orderIndex: number;

  @IsNotEmpty({ message: 'Description is required' })
  description?: string;

  // Questions
  @IsOptional()
  @IsMongoId({ each: true, message: "each question must be a mongo object id" })
  @IsArray({ message: 'questions must be an array' })
  questions: mongoose.Schema.Types.ObjectId[];
}
