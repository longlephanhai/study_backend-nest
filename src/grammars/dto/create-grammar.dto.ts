import { IsNotEmpty } from "class-validator";

export class CreateGrammarDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
