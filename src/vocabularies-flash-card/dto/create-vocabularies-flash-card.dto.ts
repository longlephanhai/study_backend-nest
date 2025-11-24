import { IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";

export class CreateVocabulariesFlashCardDto {
  _id: string;

  @IsNotEmpty({ message: 'Vocabulary is required' })
  vocabulary: string;

  @IsNotEmpty({ message: 'Meaning is required' })
  meaning: string;

  @IsOptional()
  example: string;

  @IsOptional()
  pronunciation: string;

  @IsOptional()
  image: string;
}
