import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreatePart5MistakeDto {
  @IsNotEmpty()
  categoryPart5Mistakes: mongoose.Schema.Types.ObjectId[]
}
