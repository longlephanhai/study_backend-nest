import mongoose from "mongoose";
import { LearningStep } from "src/learning-step/schema/learning-step.schema";

export class CreateLearningPathDto {

  userId: mongoose.Schema.Types.ObjectId;


  title: string;

  description: string;


  survey: mongoose.Schema.Types.ObjectId;


  steps: LearningStep[];


  currentDay: number;


  isCompleted: boolean;
}
