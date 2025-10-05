import { IsNotEmpty } from "class-validator";

export class CreateWritingDto {
  @IsNotEmpty({ message: "Topic is required" })
  topic: string;

  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @IsNotEmpty({ message: "Minimum words are required" })
  minWords: number;

  @IsNotEmpty({ message: "Maximum words are required" })
  maxWords: number;

  @IsNotEmpty({ message: "Level is required" })
  level: string;

  @IsNotEmpty({ message: "Suggestion is required" })
  suggestion: string;

}
