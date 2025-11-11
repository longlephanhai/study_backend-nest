import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePart4Dto {
  @IsOptional()
  imageUrl: string;

  @IsNotEmpty({ message: 'Audio URL is required' })
  audioUrl: string;

  @IsNotEmpty({ message: 'Options are required' })
  options: string[];

  @IsNotEmpty({ message: 'Correct answer is required' })
  correctAnswer: string;

  @IsNotEmpty({ message: 'Explanation is required' })
  explanation: string;

  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsNotEmpty({ message: 'Transcript is required' })
  transcript: string;

  @IsNotEmpty({ message: 'Question content is required' })
  questionContent: string;
}
