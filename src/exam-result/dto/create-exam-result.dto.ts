import { IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";
import { Part } from "src/parts/schema/part.schema";
import { Question } from "src/question/schema/question.schema";

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
  correctAnswer?: mongoose.Schema.Types.ObjectId[];

  @IsOptional()
  wrongAnswer?: mongoose.Schema.Types.ObjectId[];

  @IsOptional()
  noAnswer?: mongoose.Schema.Types.ObjectId[];
}
