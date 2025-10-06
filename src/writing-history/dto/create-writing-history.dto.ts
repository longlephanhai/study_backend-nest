import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateWritingHistoryDto {
  @IsNotEmpty()
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  writingId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  feedback: WritingFeedback;

  @IsNotEmpty()
  score: any;
}
