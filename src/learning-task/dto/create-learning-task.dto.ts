import mongoose from "mongoose";

export class CreateLearningTaskDto {
  title: string;
  description: string;
  type: string;
  content: mongoose.Types.ObjectId[];
  isLocked: boolean;
  relatedStep: number;
}
