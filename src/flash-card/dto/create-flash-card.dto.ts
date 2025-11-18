import { IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";


export class CreateFlashCardDto {

  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsOptional()
  vocabulariesFlashCardId: mongoose.Schema.Types.ObjectId[];
}
