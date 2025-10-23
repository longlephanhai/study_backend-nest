import { IsNotEmpty } from "class-validator";

export class CreatePart2Dto {
  @IsNotEmpty({ message: 'Audio URL should not be empty' })
  audioUrl: string;

  @IsNotEmpty({ message: 'Options should not be empty' })
  options: string[];

  @IsNotEmpty({ message: 'Correct answer should not be empty' })
  correctAnswer: string;

  @IsNotEmpty({ message: 'Explanation should not be empty' })
  explanation: string;

  @IsNotEmpty({ message: 'Category should not be empty' })
  category: string;

  @IsNotEmpty({ message: 'Transcript should not be empty' })
  transcript: string;
}
