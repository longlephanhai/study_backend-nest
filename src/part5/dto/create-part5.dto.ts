import { IsNotEmpty } from "class-validator";

export class CreatePart5Dto {
  @IsNotEmpty({message: 'Options are required'})
  options: string[];

  @IsNotEmpty({message: 'Correct answer is required'})
  correctAnswer: string;

  @IsNotEmpty({message: 'Explanation is required'})
  explanation: string;

  @IsNotEmpty({message: 'Category is required'})
  category: string;

  @IsNotEmpty({message: 'Question content is required'})
  questionContent: string;
}
