import { IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";
import { Part } from "src/parts/schema/part.schema";

export class CreateExamResultDto {
  @IsNotEmpty()
  testId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  totalCorrect: number;

  @IsOptional()
  totalListeningCorrect: number;

  @IsOptional()
  totalReadingCorrect: number;

  @IsOptional()
  parts: Part[];

  @IsOptional()
  correctAnswer: Record<string, number>;

  @IsOptional()
  wrongAnswer: Record<string, number>;

  @IsOptional()
  noAnswer: Record<string, number>;
}
